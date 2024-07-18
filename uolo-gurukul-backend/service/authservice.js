require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const CryptoJS = require("crypto-js");
const UserModel = require("../model/usersModel");
const ImageService = require("../service/ImageService");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


const authenticateUser = async (email, encryptedPassword) => {
  //decrypt password
  const bytes = CryptoJS.AES.decrypt(
    encryptedPassword,
    process.env.SECRET_PASS_KEY
  );
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.error("Invalid email or password");
      logger.error("Invalid email or password");
      return { status: 400, msg: "Invalid email or password" };
    }

    if(user.isDeleted) {
      // user deleted from system, not authorized
      console.error("No user found with this email.");
      logger.error("No user found with this email.");
      return { status: 404, msg: "No user found with this email." };
    }

    const isPasswordMatched = await bcrypt.compare(
      originalPassword,
      user.password
    );

    if (!isPasswordMatched) {
      console.error("Invalid password!");
      logger.error("Invalid password!");
      return { status: 400, msg: "Invalid password!" };
    }

    // user validated successfully
    const updatedUsersArr = await ImageService.addImageUrl([user]); //add image from s3 bucket
    const token = jwt.sign({ userId: user._id, userEmail: user.email }, JWT_SECRET_KEY, {expiresIn: "1d", });

    return {
      status: 200,
      msg: "Login Successful!",
      token,
      loggedUser: {
        name: updatedUsersArr[0].name,
        imageUrl: updatedUsersArr[0].imageUrl,
      }
    }
  } catch (error) {
    console.error("Error While logging!");
    logger.error("Error While logging!");
    return { status: 500, msg: "Error logging in user!" };
  }
};

module.exports = { authenticateUser };
