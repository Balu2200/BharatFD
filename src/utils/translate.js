const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

async function translateText(text, targetLanguage) {
  try {
    let [translations] = await translate.translate(text, targetLanguage);
    return translations;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}

module.exports = { translateText };
