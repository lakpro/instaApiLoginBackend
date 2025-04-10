const jwt = require("jsonwebtoken");

exports.generateJWT = (accessToken, userId) => {
  return jwt.sign({ accessToken, userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
