const { Translate } = require("@google-cloud/translate").v2;
const cheerio = require("cheerio");
require("dotenv").config();

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});


async function translateText(text, targetLanguage) {
  try {
 
    const $ = cheerio.load(text); 
    const textToTranslate = $("body").text(); 

    const [translations] = await translate.translate(
      textToTranslate,
      targetLanguage
    );

    let translatedHTML = text; 

    $("body").text(translations); 
    translatedHTML = $.html(); 

    return translatedHTML; 
  } catch (error) {
    console.error("Translation Error:", error);
    return text; 
  }
}

module.exports = { translateText };
