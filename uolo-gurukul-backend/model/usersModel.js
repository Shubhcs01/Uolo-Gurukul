require("dotenv").config();
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const logger = require("../config/logger");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    key: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password
userSchema.pre("save", async function () {
  logger.info("Pre-save hook called...");
  const bytes = CryptoJS.AES.decrypt(
    this.password,
    process.env.SECRET_PASS_KEY
  );
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  const salt = await bcrypt.genSalt();
  const hashedString = await bcrypt.hash(originalPassword, salt);
  this.password = hashedString;
});

module.exports = mongoose.model("Team", userSchema);
