require("dotenv").config();
const sharp = require('sharp');
const logger = require("../config/logger");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const addImageUrl = async (users) => {
  logger.info("🚀 addImageUrl called!");
  await Promise.all(
    users.map(async (user) => {
      const url = await getObjectUrl(user.key);
      user["imageUrl"] = url;
    })
  );

  return users;
};

const getObjectUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (err) {
    logger.error("Error in getting image:", err);
    throw err;
  }
};

const postObject = async (filename, contentType, buffer) => {
  const imageName = `${Date.now()}_${filename}`;
  const key = `shubham/uploads/team-uploads/${imageName}`;

  try {

    const processedImageBuffer = await sharp(buffer)
    .resize(400, 400, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .webp()
    .toBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: processedImageBuffer,
      contentType: contentType,
    });
    const data = await s3Client.send(command);
    if (data.$metadata.httpStatusCode === 200) {
      return { status: 200, Key: key, msg: "Successfully Uploaded Image" };
    } else {
      return { status: 400, msg: "Upload Failed!" };
    }
  } catch (err) {
    logger.error("Error uploading image:", err);
    throw err;
  }
};

module.exports = { addImageUrl, getObjectUrl, postObject };
