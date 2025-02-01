const express = require("express");
const FAQ = require("../models/postModel");
const userRouter = express.Router();
const { translateText } = require("../utils/translate");
const cacheMiddleware = require("../middlewares/cacheMiddleware");
const redisClient = require("../configure/redisClient");


userRouter.get("/faqs", cacheMiddleware, async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const cacheKey = `faqs:${lang}`;

    const cachedFAQs = await redisClient.get(cacheKey);
    if (cachedFAQs) {
      return res.json(JSON.parse(cachedFAQs));
    }

    const faqs = await FAQ.find();

    const faqsWithTranslations = faqs.map((faq) => {
      const translation = faq.translations.get(lang) || {
        question: faq.question,
        answer: faq.answer,
      };
      return {
        question: translation.question,
        answer: translation.answer,
      };
    });

   
    await redisClient.setEx(
      cacheKey,
      3600, 
      JSON.stringify(faqsWithTranslations)
    );

    res.json(faqsWithTranslations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching FAQs", error: error.message });
  }
});


module.exports = userRouter;
