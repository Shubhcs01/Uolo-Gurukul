const express = require("express");
const { checkServerHealth } = require("../controllers/healthController");

const healthRouter = express.Router();

healthRouter.get("/", checkServerHealth);

module.exports = healthRouter;
