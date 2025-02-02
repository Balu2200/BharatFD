const express = require("express");
const FAQ = require("../models/postModel");
const { adminMiddleware } = require("../middlewares/checkadmin");
const { translateText } = require("../utils/translate");
const redisMiddleware = require("../middlewares/cacheMiddleware"); 
const client = require("../configure/redisClient"); 

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


    let faq = await FAQ.findOne({ question });

    let translatedQuestion = question;
    let translatedAnswer = answer;

    if (language !== "en") {
      translatedQuestion = await translateText(question, language);
      translatedAnswer = await translateText(answer, language);
    }

    if (!faq) {
      faq = new FAQ({
        question,
        answer,
        translations: {
          [language]: {
            question: translatedQuestion,
            answer: translatedAnswer,
          },
        },
      });
    } else {
      if (!faq.translations.has(language)) {
        faq.translations.set(language, {
          question: translatedQuestion,
          answer: translatedAnswer,
        });
      } else {
        return res
          .status(400)
          .json({ message: `Translation for ${language} already exists` });
      }
    }

    await faq.save();
    res
      .status(201)
      .json({ message: "FAQ added/updated with translation", faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




adminRouter.get("/faqs", redisMiddleware, async (req, res) => {
  try {
    const { lang = "en" } = req.query;
    const redisKey = `faqs:${lang}`;

    
    const cachedFAQs = await client.get(redisKey);
    if (cachedFAQs) {
      return res.json(JSON.parse(cachedFAQs));
    }

    const faqs = await FAQ.find();

    const translatedFAQs = await Promise.all(
      faqs.map(async (faq) => {
        if (lang === "en") {
          return {
            _id: faq._id,
            question: faq.question,
            answer: faq.answer,
            language: "en",
          };
        }

        const existingTranslation = faq.translations.get(lang);
        if (existingTranslation) {
          return {
            _id: faq._id,
            question: existingTranslation.question,
            answer: existingTranslation.answer,
            language: lang,
          };
        }

       
        const translatedQuestion = await translateText(faq.question, lang);
        const translatedAnswer = await translateText(faq.answer, lang);

       
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer,
        });
        await faq.save();

        return {
          _id: faq._id,
          question: translatedQuestion,
          answer: translatedAnswer,
          language: lang,
        };
      })
    );

    await client.set(redisKey, JSON.stringify(translatedFAQs), "EX", 3600);

    res.json(translatedFAQs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



adminRouter.put("/faqs/:id", adminMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    faq.question = question;
    faq.answer = answer;

    const allLanguages = ["en", "hi", "bn", "te","ta","ar","kn","pa","ur","ml"]; 
    for (const lang of allLanguages) {
      if (lang !== "en") {
        const translatedQuestion = await translateText(question, lang);
        const translatedAnswer = await translateText(answer, lang);
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer,
        });
      }
    }

    await faq.save();

    
    const redisKey = `faq:${faq._id}`;
    await client.del(redisKey);

    const keys = await client.keys("faqs:*");
    if (keys.length) {
      await client.del(keys);
    }

    res.json({ message: "FAQ updated successfully", faq });
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

  
    const redisKey = `faq:${deletedFAQ._id}`;
    await client.del(redisKey);

    const keys = await client.keys("faqs:*");
    if (keys.length) {
      await client.del(keys);
    }

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res
      .status(500)
      .json({ message: "Error deleting FAQ", error: error.message });
  }
});


module.exports = adminRouter;
