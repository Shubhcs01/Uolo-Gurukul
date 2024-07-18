const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const validateBearerToken = (req, res, next) => {

  const token = req.cookies.token;
  console.log("🚀 Auth Middleware called!");

  if (!token) {
    return res.status(401).json({ status:401, message: "No token, authorization denied" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, authData) => {
    if (err) {
      console.log("❌ Invalid/Expired Token!")
      res.status(401).json({ status:401, msg: `Invalid/Expired Token!` });
    } else {
      console.info(`✅ Token verified! : ${token}`);
      req.authData = authData;
      next();
    }
  });
};

module.exports = { validateBearerToken };
