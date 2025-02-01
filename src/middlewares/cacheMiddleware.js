const redisClient = require("../configure/redisClient");

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl;

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Serving from cache");
      return res.json(JSON.parse(cachedData));
    }

    next();
  } catch (error) {
    console.error("Redis Cache Error:", error);
    next();
  }
};

module.exports = cacheMiddleware;
