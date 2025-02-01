const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);


postSchema.methods.getTranslation = function (lang) {
  return this.translations[`${lang}`] || this.question;
};

const FAQ = mongoose.model("FAQ", postSchema);
module.exports = FAQ;
