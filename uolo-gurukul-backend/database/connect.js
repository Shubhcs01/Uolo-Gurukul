require('dotenv').config();
const mongoose = require("mongoose");
const logger = require('../config/logger');

const ConnectDB = async () => {

    return await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then((db) => {
        logger.info("✅ Database Connected");
    }).catch((err) => {
        logger.error("🚀 MongoDB Connection Error: ", {err})
    });
}

module.exports = ConnectDB; // ConnectDB return promise, so use async/awaits
