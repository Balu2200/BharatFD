const redisClient = require("../configure/redisClient");

const cacheMiddleware = async (req, res, next) => {
  const lang = req.query.lang || "en"; 
  const cacheKey = `faqs:${lang}`; 
  const cacheExpiryTime = 3600; 

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`Serving ${cacheKey} from cache`);
      return res.json(JSON.parse(cachedData)); 
    }

    console.log(`Cache miss for ${cacheKey}`);
    next(); 
  } catch (error) {
    console.error("Redis Cache Error:", error);
    res
      .status(500)
      .json({ message: "Cache service unavailable, please try again later" });
  }
};

module.exports = cacheMiddleware;
