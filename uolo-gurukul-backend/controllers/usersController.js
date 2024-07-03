const UserService = require("../service/usersService");

const getAllusers = async (req, res) => {
  console.log("getAllusers called");
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 8);

  if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
    return res.status(400).json({
      error: "Invalid page or limit parameter. Both must be positive numbers.",
    });
  }

  try {
    const result = await UserService.getUserFromDB(page, limit);
    const updatedUsers = await UserService.addImageUrl(result.data);
    result.data = updatedUsers;
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getting all users:", error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

const getSpecificUser = async (req, res) => {
  console.log("getSpecificUser");

  const userName = req.params.name;

  if (!userName || userName === "") {
    return res
      .status(400)
      .json({ error: "Invalid User name. User name not provided" });
  }

  try {
    const result = UserService.findUserByName(userName);
    res.status(result.status).json(result.user);
  } catch (error) {
    console.error(`Error in getting user with name ${userName}:`, error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.file;

  if (!email || !name || !password) {
    console.log("Please check email/name/pasword");
    return res.status(400).json({ error: "Please check email/name/pasword" });
  }

  if (!file) {
    throw new Error("No file provided for upload");
  }

  // console.log("body: ",req.body)
  // console.log("file: ",req.file)

  try {
    const uploadResult = await UserService.postObject(
      file.originalname,
      file.mimetype,
      file.buffer
    );
    if (uploadResult.status === 200) {
      const result = await UserService.addUser(
        name,
        email,
        password,
        uploadResult.Key
      );
      if (result.status == 400) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ msg: "Upload Failed!" });
    }
  } catch (error) {
    console.error(`Error in adding user`, error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!userId || userId === "") {
    return res
      .status(400)
      .json({ error: "Invalid parameter. User ID not provided" });
  }

  try {
    const result = await UserService.deleteUser(userId);
    res.status(result.status).json(result.message);
  } catch (error) {
    console.error(`Error in deleting user with ID ${userId}:`, error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

const uploadImage = async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new Error("No file provided for upload");
  }

  try {
    const result = await UserService.postObject(
      file.originalname,
      file.mimetype,
      file.buffer
    );

    if (result.status === 200) {
      return res
        .status(200)
        .json({ Key: result.Key, msg: "Successfully Uploaded File." });
    } else {
      return res.status(400).json({ msg: "Upload Failed!" });
    }
  } catch (error) {
    console.error(`Error in Uploading File: `, error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  getAllusers,
  addUser,
  deleteUser,
  getSpecificUser,
  uploadImage,
};
