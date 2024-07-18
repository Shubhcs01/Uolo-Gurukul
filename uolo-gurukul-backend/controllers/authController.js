require("dotenv").config();
const logger = require("../config/logger");
const AuthService = require("../service/authservice");
const UsersService = require("../service/usersService");


// Login user
const loginUser = async (req, res) => {
  console.log("Inside authController!");

  const { email, encryptedPassword } = req.body;

  if (!email || !encryptedPassword) {
    console.error("Empty email/password!");
    logger.error("Empty email/password!");
    res.status(400).json({ status: 400, msg: "Email and password are required" });
  }

  if (!validateEmail(email)) {
    console.error("Invalid email address!");
    logger.error("Invalid email address!");
    return res.status(400).json({ status: 400, msg: "!!Invalid email address!!" });
  }

  try {
    const result = await AuthService.authenticateUser(email, encryptedPassword);
    console.log("🚀 ~ loginUser ~ result:", result)

    if (result.status !== 200) {
      console.error(result.msg);
      logger.error(result);
      res.status(result.status).json({ status: result.status, msg: result.msg });
      return;
    }

    res.cookie("token", result.token, { httpOnly: true });
    res.status(200).json({ status: 200, msg: result.msg, loggedUser: result.loggedUser });

  } catch (error) {
    console.error(error);
    logger.error({error});
    res.status(500).json({ status: 500, msg: error });
  }
};

// Verify Token
const verifyToken = async (req, res) => {
  try {
    if (!req.authData) {
      throw new Error("Auth data not found");
    }

    const result = await UsersService.findUserByEmail(req.authData.userEmail);

    if (result.status !== 200) {
      console.error("Failed to get logged user details!");
      logger.error(result.msg);
      res
        .status(result.status)
        .json({
          status: result.status,
          msg: "Failed to get current user details",
        });
    }

    res.status(200).json({
      status: 200,
      msg: "Token successfully verified!",
      authData: {
        name: result.user.name,
        email: result.user.email,
        imageUrl: result.user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error verifying token: ", error);
    logger.error(error);
    res.status(500).json({status:500, msg: "Failed to verify token", error: error.message });
  }
};

// Logout user
const logoutUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    throw new Error("You are not logged in!");
  }

  try {
    res.clearCookie("token");
    res.status(200).json({ status: 200, msg: "Logout successful" });
  } catch (error) {
    console.error(error);
    logger.error(error);
    res.status(500).json({ status: 500, msg: error });
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = { loginUser, verifyToken, logoutUser };
