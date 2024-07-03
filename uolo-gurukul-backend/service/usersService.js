require('dotenv').config();
const {S3Client,GetObjectCommand,PutObjectCommand,} = require("@aws-sdk/client-s3");
const UserModel = require("../model/usersModel");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const getUserFromDB = async (page, limit) => {
  let paginatedUsers = await UserModel.find().skip((page - 1) * limit).limit(limit);
  let totalItems = await UserModel.countDocuments();

  if (paginatedUsers.length === 0) {
    console.log("users: empty");
    return { data: [], meta: { totalPages: 0 } };
  }

  return {
    data: paginatedUsers,
    meta: {
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

const addImageUrl = async (users) => {
  await Promise.all(users.map(async (user) => {
    const url = await getObjectUrl(user.key);
    user["imageUrl"] = url;
  }));

  return users;
};

const addUser = async (name, email, password, key) => {

  if (!validateEmail(email)) {
    return { status: 400, error: "Invalid email address" };
  }

  if (isEmailExists(email)) {
    console.log("Email already exists");
    return { status: 400, error: "Email already exists" };
  }

  // Todo: vaidate password in backend

  const newUser = {
    name: name,
    email: email,
    password: password,
    key, key
  };

  console.log("Saving into DB...", JSON.stringify(newUser));
  let user = await UserModel.create(newUser);
  console.log("Saved!! : " + user);
  return { status: 201, newUser: newUser };
};

const getObjectUrl = async (key) => {

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command,{expiresIn:3600});
    return url;
  } catch (err) {
    console.error("Error in getting image:", err);
    throw err;
  }

}

const postObject = async (filename, contentType, buffer) => {

  const imageName = `${Date.now()}_${filename}`;
  const key = `shubham/uploads/team-uploads/${imageName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: buffer,
      contentType: contentType,
    });
    const data = await s3Client.send(command);
    if(data.$metadata.httpStatusCode === 200){
      return {status:200, Key: key, msg: "Successfully Uploaded Image"};
    } else {
      return {status:400, msg: "Upload Failed!"};
    }
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
};

const deleteUser = async (userId) => {
  let user = await UserModel.findOneAndDelete({ _id: userId });

  if (!user) {
    return { status: 400, message: `User with ID ${userId} not found.` };
  }

  return {
    status: 200,
    message: `User with ID ${userId} deleted successfully.`,
  };
};

const findUserByName = (userName) => {
  const userIndex = users.findIndex((user) =>
    user.name.toLowerCase().includes(userName.toLowerCase())
  );

  if (userIndex !== -1) {
    return { status: 200, user: users[userIndex] };
  } else {
    return { status: 404, user: { error: "User not found" } };
  }
};

const findUserByEmail = async (emailID) => {
  let user = await UserModel.findOne({email: emailID})

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

const isEmailExists = (email) => {
  const result =  findUserByEmail(email);
  return result.status === 200;
};

module.exports = {
  addUser,
  deleteUser,
  findUserByName,
  postObject,
  getObjectUrl,
  addImageUrl,
  getUserFromDB
};
