const express = require("express");
const app = express();
const user_routes = require('./routes/usersRoutes');
const ConnectDB = require('./database/connect');

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/images", express.static("./images"));
app.use("/v1/users", user_routes);

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  ConnectDB(); 
});
