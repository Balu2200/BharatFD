const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const FAQ = require("../models/postModel");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await FAQ.deleteMany();
});

describe("FAQ Model Tests", () => {
  test("Should create an FAQ with English and Hindi translations", async () => {
    const faq = new FAQ({
      question: "What is your name?",
      answer: "My name is Alekehya Varanasi. I am a Java developer.",
      translations: {
        hi: {
          question: "<html><head></head><body>आपका क्या नाम है?</body></html>",
          answer:
            "<html><head></head><body>मेरा नाम अलेकेया वाराणसी है। मैं एक जावा डेवलपर हूँ।</body></html>",
        },
      },
    });

    const savedFAQ = await faq.save();
    expect(savedFAQ._id).toBeDefined();
    expect(savedFAQ.question).toBe("What is your name?");
    expect(savedFAQ.translations.get("hi").question).toBe(
      "<html><head></head><body>आपका क्या नाम है?</body></html>"
    );
  });

  test("Should retrieve the correct FAQ and Hindi translation", async () => {
    const faq = new FAQ({
      question: "What is your name?",
      answer: "My name is Alekehya Varanasi. I am a Java developer.",
      translations: {
        hi: {
          question: "<html><head></head><body>आपका क्या नाम है?</body></html>",
          answer:
            "<html><head></head><body>मेरा नाम अलेकेया वाराणसी है। मैं एक जावा डेवलपर हूँ।</body></html>",
        },
      },
    });

    await faq.save();

    const fetchedFAQ = await FAQ.findOne({
      question: "What is your name?",
    });

    expect(fetchedFAQ).not.toBeNull();
    expect(fetchedFAQ.answer).toBe(
      "My name is Alekehya Varanasi. I am a Java developer."
    );
    
    expect(fetchedFAQ.getTranslation("hi").question).toBe(
      "<html><head></head><body>आपका क्या नाम है?</body></html>"
    );
  });

  test("Should return the original question when Hindi translation is missing", async () => {
    const faq = new FAQ({
      question: "What is your name?",
      answer: "My name is Alekehya Varanasi. I am a Java developer.",
    });

    await faq.save();

    const fetchedFAQ = await FAQ.findOne({
      question: "What is your name?",
    });

    expect(fetchedFAQ.getTranslation("hi").question).toBe("What is your name?");
  });
});
