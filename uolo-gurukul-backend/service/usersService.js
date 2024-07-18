require("dotenv").config();
const UserModel = require("../model/usersModel");
const ElasticSearchService = require("./elasticService");
const logger = require("../config/logger");
const ImageService = require("./ImageService");


const addUser = async (name, email, password, file) => {
  if (!validateEmail(email)) {
    return { status: 400, msg: "!!Invalid email address!!" };
  }

  if (await isEmailExists(email)) {
    logger.warn("🚀 Email already exists");
    return { status: 400, msg: "Email already exists!!" };
  }

  let uploadResult;
  if (file) {
    uploadResult = await uploadImage(file);
    if (uploadResult.status !== 200) {
      return { status: uploadResult.status, msg: uploadResult.msg };
    }
  }

  const session = await UserModel.startSession();
  session.startTransaction();

  try{

    // Adding into MongoDB
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

    // Adding into Elastic Index
    const elasticPayLoad = {
      name,
      email,
      key: uploadResult ? uploadResult.Key : undefined,
      isDeleted: false,
    };
    const elasticResponse  = await ElasticSearchService.addDocument(
      process.env.ELASTIC_INDEX_NAME,
      userDoc._doc._id,
      elasticPayLoad
    );

    if (elasticResponse.status !== 201) {
      console.error("Error while adding user in elastic index!");
      throw new Error("Error while adding user in elastic index!");
    }

    await session.commitTransaction();
    session.endSession();

    return { status: 201, newUser: newUser };

  } catch (error) {
    // Rollback
    await session.abortTransaction();
    await session.endSession();
    logger.error("❌ Error adding user: ", error);
    logger.info("Rollback happend!")
    return { status: 500, msg: `An error occurred while adding user: ${error.message}` };
  }
};

const deleteUser = async (userId) => {
  const session = await UserModel.startSession();
  session.startTransaction();

  try {

     // Updating mongoDB
     let user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { isDeleted: true },
      { session }
    );

    if (!user) {
      // Rollback
      console.error("Something went wrong while updating MongoDB! Rollback occured!")
      logger.error("Something went wrong while updating MongoDB! Rollback occured!")
      await session.abortTransaction();
      await session.endSession();
      return { status: 404, msg: `User with ID ${userId} not found.` };
    }

    // update elastic index
    const res = await ElasticSearchService.updateDocument(
      process.env.ELASTIC_INDEX_NAME,
      user._id,
      { isDeleted: true }
    );

    if(res.status !== 200){
      console.error("Something went wrong while updating Index.")
      logger.error("Something went wrong while updating Index.")
      throw new Error("Something went wrong while updating Index.")
    }

    console.log(`User with ID ${userId} deleted successfully`);
    logger.info(`User with ID ${userId} deleted successfully`);

    return {
      status: 200,
      msg: `User with ID ${userId} deleted successfully`,
    };

  } catch (error) {
    // Rollback
    await session.abortTransaction();
    await session.endSession();
    logger.error("Error deleting user: ", error);
    logger.info("Rollback happend!");

    return {
      status: 500,
      msg: `An error occurred: ${error.message}`,
    };
  }
};

const findUserByEmail = async (emailID) => {
  const user = await UserModel.findOne({ email: emailID });

  if (!user) {
    return { status: 400, message: `User with email ${emailID} not found.` };
  }

  const usersArray = await ImageService.addImageUrl([user]);

  return {
    status: 200,
    user: usersArray[0],
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
};
