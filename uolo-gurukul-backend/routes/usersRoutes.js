const express = require("express");
const multer = require("multer");
const { validateBearerToken } = require("../middleware/validateAuthToken");
const userRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  getusers,
  addUser,
  deleteUser,
} = require("../controllers/usersController");

userRouter.get("/", validateBearerToken, getusers);
userRouter.post("/", validateBearerToken, upload.single("avatar"), addUser);
userRouter.delete("/:id", validateBearerToken, deleteUser);

module.exports = userRouter;
