const express = require("express");
const {loginUser, verifyToken, logoutUser } = require("../controllers/authController");
const { validateBearerToken } = require("../middleware/validateAuthToken");

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post("/verify-token", validateBearerToken, verifyToken);
authRouter.post('/logout', logoutUser);

module.exports = authRouter;