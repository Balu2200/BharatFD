const express = require("express");
const FAQ = require("../models/postModel");
const { adminMiddleware } = require("../middlewares/checkadmin");
const { translateText } = require("../utils/translate");

const adminRouter = express.Router();


adminRouter.post("/faqs", adminMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const language = req.query.lang || "en";

    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const translatedQuestion = await translateText(question, language);
    const translatedAnswer = await translateText(answer, language);

    const newFAQ = new FAQ({
      question: translatedQuestion,
      answer: translatedAnswer,
      language,
    });

    await newFAQ.save();
    res
      .status(201)
      .json({ message: "FAQ added with translation", faq: newFAQ });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



adminRouter.get("/faqs", async (req, res) => {
  try {
    const { lang = "en" } = req.query.lang;
    const faqs = await FAQ.find();

    const translatedFAQs = await Promise.all(
      faqs.map(async (faq) => ({
        _id: faq._id,
        question: await translateText(faq.question, lang),
        answer: await translateText(faq.answer, lang),
        language: lang,
      }))
    );
    res.json(translatedFAQs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

adminRouter.put("/faqs/:id", adminMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const language = req.query.language || "en";

    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const translatedQuestion = await translateText(question, language);
    const translatedAnswer = await translateText(answer, language);

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question: translatedQuestion, answer: translatedAnswer, language },
      { new: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ updated with translation", faq: updatedFAQ });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

adminRouter.delete("/faqs/:id", adminMiddleware, async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);

    if (!deletedFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = adminRouter;
