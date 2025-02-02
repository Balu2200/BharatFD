const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { connectDb, disconnectDb } = require("../configure/database");

jest.mock("../middlewares/checkadmin", () => ({
  adminMiddleware: (req, res, next) => next(),
}));


const testData = {
  question: "What is Node.js?",
  answer:
    "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
  translations: {
    en: {
      question: "What is Node.js?",
      answer:
        "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    },
  },
};

beforeAll(async () => {
  await connectDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe("FAQ API tests", () => {
  it("Should create an FAQ", async () => {
    const response = await request(app)
      .post("/admin/faqs?lang=ml") 
      .send(testData);

    expect(response.status).toBe(201);

    expect(response.body.faq.question).toBe(testData.question);
    expect(response.body.faq.translations.ml.question).toBe(
      "<html><head></head><body>എന്താണ് Node.js?</body></html>"
    );
  });

  it("Should retrieve all FAQs", async () => {
    const response = await request(app).get("/admin/faqs?lang=ml"); 

    expect(response.status).toBe(200);

   
    expect(response.body.length).toBeGreaterThan(0);

    // Check if the question in the first FAQ matches the expected translated question in Malayalam
    expect(response.body[0].question).toBe(
      "<html><head></head><body>എന്താണ് Node.js?</body></html>"
    );
  });
});
