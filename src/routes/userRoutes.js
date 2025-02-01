const express = require("express");
const FAQ = require("../models/postModel");
const userRouter = express.Router();
const { translateText } = require("../utils/translate");
const cacheMiddleware = require("../middlewares/cacheMiddleware");
const redisClient = require("../configure/redisClient");


userRouter.post("/faqs", async (req, res) => {
  try {
    const { question, answer } = req.body;
    const lang = req.query.lang || "en";

    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const translatedQuestion = await translateText(question, lang);
    const translatedAnswer = await translateText(answer, lang);

    const faq = new FAQ({
      question: translatedQuestion,
      answer: translatedAnswer,
      language: lang,
    });

    await faq.save();
    await redisClient.del(`faqs:${lang}`);

    res.status(201).json({ message: "FAQ added successfully", faq });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating FAQ", error: error.message });
  }
});


userRouter.get("/faqs", cacheMiddleware, async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const cacheKey = `faqs:${lang}`;

    const cachedFAQs = await redisClient.get(cacheKey);
    if (cachedFAQs) {
      return res.json(JSON.parse(cachedFAQs)); 
    }

    const faqs = await FAQ.find();

    const faqsWithTranslations = await Promise.all(
      faqs.map(async (faq) => ({
        question: await translateText(faq.question, lang),
        answer: await translateText(faq.answer, lang),
      }))
    );

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
