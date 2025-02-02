const redis = require("../configure/redisClient");

const testData = {
  question: "What is Node.js?",
  answer:
    "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
  translations: {
    en: {
      question: "What is Node.js?",
      answer:
        "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    },
  },
};

describe("Redis tests", () => {
  beforeAll(async () => {
   
    if (!redis.isOpen) {
      await redis.connect(); 
    }
  });

  afterAll(async () => {
    
    await redis.quit();
  });

  test("Should write and read FAQs from Redis", async () => {
    try {
      const reply = await redis.lPush("faqs", JSON.stringify(testData));
      console.log("Data successfully written to Redis:", reply);

      const faqs = await redis.lRange("faqs", 0, -1);
      console.log("FAQs retrieved from Redis:", faqs);

      const parsedFaqs = faqs.map((faq) => JSON.parse(faq));
      console.log("Parsed FAQs:", parsedFaqs);
    } catch (err) {
      console.error("Redis error:", err);
    }
  });
});
