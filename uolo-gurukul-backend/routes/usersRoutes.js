const express = require("express");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const {
  getAllusers,
  getSpecificUser,
  addUser,
  deleteUser,
} = require("../controllers/usersController");

router.get("/", getAllusers);
router.post("/",upload.single("avatar"), addUser);
router.delete("/:id", deleteUser);
router.get('/:name',getSpecificUser);

module.exports = router;
