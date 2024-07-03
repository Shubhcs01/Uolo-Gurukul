require('dotenv').config();
const mongoose = require("mongoose");

const ConnectDB = async () => {

    return await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then((db) => {
        console.log("**************************");
        console.log("Database Connected");
        console.log("**************************");
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = ConnectDB; // ConnectDB return promise, so use async/awaits
