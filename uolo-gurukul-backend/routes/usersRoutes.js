const express = require("express");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const {
  getAllusers,
  addUser,
  deleteUser,
  searchUser
} = require("../controllers/usersController");

router.get("/", getAllusers);
router.post("/",upload.single("avatar"), addUser);
router.get("/search", searchUser);
router.delete("/:id", deleteUser);

module.exports = router;
