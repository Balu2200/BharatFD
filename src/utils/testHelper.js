const jwt = require("jsonwebtoken");


const generateTestToken = (userId, role = "admin") => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = {
  generateTestToken,
};
