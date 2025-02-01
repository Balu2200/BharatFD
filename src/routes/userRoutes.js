const express = require("express");
const FAQ = require("../models/postModel");
const userRouter = express.Router();
const { translateText } = require("../utils/translate");



userRouter.post("/faqs", async (req, res) => {
  try {
    const { question, answer } = req.body;
    const lang = req.query.lang || "en";

    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const languages = ["fr", "es", "de", "hi", lang];
    const translations = {};

    for (const language of languages) {
      translations[language] = await translateText(question, language);
    }

    const faq = new FAQ({
      question,
      answer,
      translations,
    });

    await faq.save();
    res.status(201).json({ message: "FAQ added successfully", faq });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating FAQ", error: error.message });
  }
});



userRouter.get("/faqs", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqs = await FAQ.find();

    const faqsWithTranslations = faqs.map((faq) => ({
      question: faq.translations[lang] || faq.question,
      answer: faq.answer,
    }));

    res.json(faqsWithTranslations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching FAQs", error: error.message });
  }
});

module.exports = userRouter;
