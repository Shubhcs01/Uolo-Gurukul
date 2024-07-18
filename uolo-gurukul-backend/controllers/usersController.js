const UserService = require("../service/usersService");
const ElasticService = require("../service/elasticService");
const { default: mongoose } = require("mongoose");
const logger = require("../config/logger");
const ObjectId = mongoose.Types.ObjectId;

const getusers = async (req, res) => {
  logger.info("🚀 Getting users controller called");
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 8);
  let query = (req.query.query || '*');
  query = query.trim();

  if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
    return res.status(400).json({
      status: 400,
      error: "Invalid page or limit parameter. Both must be positive numbers.",
    });
  }

  if (!query) {
    return res
      .status(400)
      .json({ error: "Invalid User query. User query not provided" });
  }

  try {
    // Get all users from elastic search db
    const result = await ElasticService.searchUsers(process.env.ELASTIC_INDEX_NAME, query, page, limit);
    logger.info(`🚀 Search Results: `, {result})
    res.status(result.status).json(result);
  } catch (error) {
    logger.error("500: Error in getting all users:", error);
    res.status(500).json({
      status: 500,
      error: "Internal server error. Please try again later.",
    });
  }
};

const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.file;
  const trimmedName = name.trim();

  if (!email) {
    logger.warn("Email ID required. Please check!");
    return res.status(400).json({ msg: "Email ID required. Please check!" });
  }

  if (!trimmedName) {
    logger.warn("Name must not be empty.");
    return res.status(400).json({ msg: "Name must not be empty." });
  }

  if (!password) {
    logger.warn("Password must not be empty.");
    return res.status(400).json({ msg: "Password must not be empty." });
  }

  if (!file) {
    logger.error("No file provided for upload");
    return res
      .status(400)
      .json({ status: 400, msg: "Profile photo Required!" });
  }

  try {
    const result = await UserService.addUser(
      trimmedName,
      email,
      password,
      file
    );
    return res.status(result.status).json(result);
  } catch (error) {
    logger.error(`Error in adding user: `, error);
    res.status(500).json({
      status: 500,
      msg: `Error in adding user: ${error.message}`,
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
    
  if (!userId || userId === "") {
    return res
      .status(400)
      .json({ status: 400, error: "Invalid parameter. User ID not provided" });
  }

  if (!ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: 400, error: `User ID ${userId} not found` });
  }

  try {
    const result = await UserService.deleteUser(userId);
    res.status(result.status).json(result.msg);
  } catch (error) {
    logger.error(`Error in deleting user with ID ${userId}:`, error);
    res.status(500).json({
      status: 500,
      error: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  getusers,
  addUser,
  deleteUser,
};
