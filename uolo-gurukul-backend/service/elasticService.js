require("dotenv").config();
const elasticSearch = require("@elastic/elasticsearch");
const UserModel = require("../model/usersModel");
const logger = require("../config/logger");
const ImageService = require("./ImageService");

// connect
const elasticClient = new elasticSearch.Client({
  node: process.env.ELASTIC_CLIENT_NODE,
});

// check
const pingElasticsearch = async () => {
  try {
    const response = await elasticClient.ping();
    logger.info("✅ Elasticsearch cluster is up and running.", { response });
  } catch (error) {
    logger.error("❌ Elasticsearch cluster is down!", { error });
  }
};

const settings = {
  analysis: {
    filter: {
      autocomplete_filter: {
        type: "edge_ngram", // break into substrings length(2,20)
        min_gram: 2,
        max_gram: 20,
      },
    },
    tokenizer: {
      autocomplete_tokenizer: {
        type: "edge_ngram",
        min_gram: 1,
        max_gram: 20,
        token_chars: ["letter", "digit", "symbol", "punctuation"], // break into substrings length(1,20) with given chars
      },
    },
    analyzer: {
      // combine filter + tokenizer
      autocomplete: {
        type: "custom",
        tokenizer: "autocomplete_tokenizer",
        filter: ["lowercase", "autocomplete_filter"],
      },
      keyword_lowercase: {
        type: "custom",
        tokenizer: "keyword",
        filter: ["lowercase"],
      },
    },
    number_of_shards: 1,
    number_of_replicas: 1,
  },
};

const mappings = {
  properties: {
    name: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "keyword_lowercase",
    },
    email: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "keyword_lowercase",
    },
  },
};

// Create Index
const createIndex = async (indexName) => {
  try {
    // Check if the index already exists
    const { body: exists } = await elasticClient.indices.exists({
      index: indexName,
    });
    if (exists) {
      logger.info(`✅ Index ${indexName} already exists.`);
      return;
    } else {
      // Create the index
      const { body } = await elasticClient.indices.create({
        index: indexName,
        body: {
          settings: settings,
          mappings: mappings,
        },
      });
      logger.info("✅ Index created. ", { body });
      //TODO: validate response
      //sync with DB
      syncElasticSearchIndexWithDB(indexName);
    }
  } catch (error) {
    logger.error("🚀 Error creating index:", error);
  }
};

// sync Index with DB
const syncElasticSearchIndexWithDB = async (indexName) => {
  try {
    let bulkData = await UserModel.find();
    const payload = bulkData.map((item) => {
      return {
        id: item._id.toString(),
        name: item.name,
        email: item.email,
        key: item.key,
        isDeleted: item.isDeleted,
      };
    });
    await addBulkDocuments(indexName, payload);
  } catch (error) {
    logger.error("Error adding users in bulk:", { error });
    //TODO: send some response to controller
  }
};

// Add Document
const addDocument = async (indexName, dbID, payload) => {
  const res = await elasticClient.index({
    index: indexName,
    id: dbID,
    body: payload,
  });

  logger.info("✅ Document successfully added to Elastic Search:", { res });

  return { status: res.statusCode, result: res };
};

// Bulk Add
const addBulkDocuments = async (indexName, payload) => {
  const result = await elasticClient.helpers.bulk({
    datasource: payload,
    onDocument(doc) {
      return {
        index: { _index: indexName, _id: doc.id },
      };
    },
    onDrop(doc) {
      logger.error("Error adding users in bulk: ", doc.error);
    },

    retries: 3,
    wait: 3000,
    refreshOnCompletion: true,
  });

  //TODO: send some response to controller

  logger.info("✅ Synced Index with DB. ", { result });
};

// Update Document
const updateDocument = async (indexName, userID, payload) => {
  try {
    const result = await elasticClient.update({
      index: indexName,
      id: userID,
      body: { doc: payload },
    });

    logger.info("✅ Updated Document in Elastic Index:", { result });
    return { status: 200, result };
  } catch (error) {
    logger.error("❌ Error updating document in Elastic Index", { error });
    return { status: 500, error };
  }
};

// Search document
const searchUsers = async (indexName, query, page, limit) => {
  logger.info("🚀 searchUser service called!");
  try {
    const result = await elasticClient.search({
      index: indexName,
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: {
          bool: {
            must: {
              term: {
                isDeleted: false,
              },
            },
            should: [
              {
                wildcard: {
                  name: `*${query.toLowerCase()}*`, // Lowercase query for case-insensitive search
                },
              },
              {
                wildcard: {
                  email: `*${query.toLowerCase()}*`, // Lowercase query for case-insensitive search
                },
              },
              {
                match_phrase: {
                  name: query,
                },
              },
            ],
            minimum_should_match: 1, // At least one condition should match
          },
        },
      },
    });

    let searchedUser = [];
    result.body.hits.hits.map((item) => {
      item._source["_id"] = item._id;
      searchedUser.push(item._source);
    });

    if (searchedUser.length === 0) {
      logger.info("Searched Users Not Found!");
      return { status: 200, data: [], meta: { totalPages: 0 } };
    }

    searchedUser = await ImageService.addImageUrl(searchedUser);

    const activeItems = result.body.hits.total.value;

    return {
      status: 200,
      data: searchedUser,
      meta: {
        totalItems: activeItems,
        currentPage: page,
        totalPages: Math.ceil(activeItems / limit),
      },
    };
  } catch (error) {
    logger.error("Error searching users:", { error });
    //TODO: send some response to controller
  }
};

module.exports = {
  pingElasticsearch,
  createIndex,
  addDocument,
  updateDocument,
  searchUsers,
};
