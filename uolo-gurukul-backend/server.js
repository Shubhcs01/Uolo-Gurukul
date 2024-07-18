require("dotenv").config();
const express = require("express");
const app = express();
const user_routes = require('./routes/usersRoutes');
const health_routes = require('./routes/healthRoute');
const auth_routes = require('./routes/authRoute');
const ConnectDB = require('./database/connect');
const ElasticSearchService= require('./service/elasticService');
const logger = require('./config/logger');
const compression = require('compression');
const cookieParser = require('cookie-parser');

app.use(compression());
app.use(express.json());
app.use(cookieParser());


// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/v1/users", user_routes);
app.use("/healthcheck", health_routes);
app.use("/v1/auth", auth_routes);

async function setUpElasticIndex(){
  await ElasticSearchService.pingElasticsearch();
  await ElasticSearchService.createIndex(process.env.ELASTIC_INDEX_NAME);
}

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  logger.info(`✅ Server is running on http://localhost:${port}`);
  await ConnectDB(); 
  await setUpElasticIndex();
});