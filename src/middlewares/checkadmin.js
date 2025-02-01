const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "BharatFD@22");

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access Denied. Admins only." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { adminMiddleware };
