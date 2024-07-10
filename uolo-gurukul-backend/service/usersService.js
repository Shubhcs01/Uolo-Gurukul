require("dotenv").config();
const UserModel = require("../model/usersModel");
const ElasticSearchService = require("./elasticService");
const logger = require('../config/logger');
const ImageService = require('./ImageService');


const getUserFromDB = async (page, limit) => {
  let activeUsers = await UserModel.find({ isDeleted: false })
    .skip((page - 1) * limit)
    .limit(limit);
  let deletedUsers = await UserModel.find({ isDeleted: true });

  let inActiveItems = deletedUsers.length;
  let totalItems = await UserModel.countDocuments();
  let activeItems = totalItems - inActiveItems;

  if (activeUsers.length === 0) {
    logger.info('Empty Users');
    return { status: 200, data: [], meta: { totalPages: 0 } };
  }

  const updatedUsers = await ImageService.addImageUrl(activeUsers); // Add S3 image Url from key

  return {
    status: 200,
    data: updatedUsers,
    meta: {
      totalItems: activeItems,
      currentPage: page,
      totalPages: Math.ceil(activeItems / limit),
    },
  };
};

const addUser = async (name, email, password, file) => {
  if (!validateEmail(email)) {
    return { status: 400, msg: "!!Invalid email address!!" };
  }

  if (await isEmailExists(email)) {
    logger.warn('🚀 Email already exists');
    return { status: 400, msg: "Email already exists!!" };
  }

  let uploadResult;
  if (file) {
    uploadResult = await uploadImage(file);
    if (uploadResult.status !== 200) {
      return { status: uploadResult.status, msg: uploadResult.msg };
    }
  }

  const newUser = {
    name,
    email,
    password,
    key: uploadResult ? uploadResult.Key : undefined,
    isDeleted: false,
  };

  logger.info("🔄 Saving into DB...", JSON.stringify(newUser));
  let userDoc = await UserModel.create(newUser);
  logger.info("✅ Saved!! : ", userDoc);
  const elasticPayLoad = {
    name,
    email,
    key: uploadResult ? uploadResult.Key : undefined,
    isDeleted: false,
  };
  ElasticSearchService.addDocument(process.env.ELASTIC_INDEX_NAME, userDoc._doc._id, elasticPayLoad);
  return { status: 201, newUser: newUser };
};

const deleteUser = async (userId) => {
  let user = await UserModel.findOneAndUpdate(
    { _id: userId },
    { isDeleted: true }
  );

  if (!user) {
    return { status: 400, msg: `User with ID ${userId} not found.` };
  }

  // update elastic index
  const res = await ElasticSearchService.updateDocument(process.env.ELASTIC_INDEX_NAME, user._id, {isDeleted: true})
  logger.info("🚀 ~ ElasticdeleteUser ~ res:", {res})

  return {
    status: 200,
    msg: `User with ID ${userId} deleted successfully.`,
  };
};

const findUserByEmail = async (emailID) => {
  let user = await UserModel.findOne({ email: emailID });

  if (!user) {
    return { status: 400, message: `User with email ${emailID} not found.` };
  }

  return {
    status: 200,
    user: user,
  };
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isEmailExists = async (email) => {
  const result = await findUserByEmail(email);
  return result.status === 200;
};

const uploadImage = async (file) => {
  try {
    const result = await ImageService.postObject(
      file.originalname,
      file.mimetype,
      file.buffer
    );

    if (result.status === 200) {
      return {
        status: 200,
        Key: result.Key,
        msg: "Successfully Uploaded File.",
      };
    } else {
      return { status: 400, msg: "Profile photo upload failed!" };
    }
  } catch (error) {
    logger.error(`Error in Uploading File: `, error);
    return {
      status: 500,
      msg: "Internal server error. Please try again later.",
    };
  }
};

module.exports = {
  addUser,
  deleteUser,
  findUserByEmail,
  getUserFromDB,
};
