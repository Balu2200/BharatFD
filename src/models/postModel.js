const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
      type: Map,
      of: {
        question: String,
        answer: String,
      },
    },
  },
  { timestamps: true }
);

postSchema.methods.getTranslation = function (lang) {
  if (this.translations && this.translations.has(lang)) {
    return this.translations.get(lang);
  }
  return { question: this.question, answer: this.answer };
};


const FAQ = mongoose.model("FAQ", postSchema);
module.exports = FAQ;
