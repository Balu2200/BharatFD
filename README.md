# FAQ Management System with Express.js, MongoDB, Redis, and WYSIWYG Editor

## Overview

-The FAQ Management System is a powerful, scalable, and multilingual solution built with Express.js, MongoDB, Redis, and integrated with a WYSIWYG Editor for rich-text formatting. Key features of the system include:

- CRUD Operations for FAQ management:
    - Integration of a WYSIWYG editor for easy rich-text content creation
    - Multilingual support with automatic translation of questions and answers
    - Redis caching for improved performance
    - Role-Based Access Control (RBAC) for secure and flexible user management
    - Admin panel for managing FAQs and translations

## Installation steps

Here's the step-by-step setup for the Express backend with the required libraries and corresponding npm commands:

    -Initialize a new Node.js project
        - npm init 

    -Install Express for creating the server
        - npm install express

    -Install Mongoose for MongoDB integration
        - npm install mongoose

    - Install CORS to enable cross-origin requests
        - npm install cors
    
    - Install cookie-parser for cookies parsing 
        - npm install cookie-parser

    -Install googletrans library for multilingual support
        - npm install @google-cloud/translate

    -Install Redis and ioredis for caching FAQs
        - npm install redis ioredis

    -Install dotenv for managing environment variables
        - npm install dotenv

    -Install bcrypt for bcryption of the passwords
        - npm install passport bcryptjs

    -Install JSON Web Token (JWT) for handling user authentication and authorization
        - npm install jsonwebtoken

    -Install jest or mocha for unit testing
        - npm install jest 

Create a .env file to store sensitive configurations like DB URL, JWT secret, etc

## Features

- CRUD Operations for FAQs
    - Create: Add new FAQs with questions and answers.
    - Read  : Retrieve a list of all FAQs.
    - Update: Modify existing FAQs.
    - Delete: Remove FAQs from the system.


- WYSIWYG Editor Integration

Integrating a WYSIWYG (What You See Is What You Get) editor enhances the user experience by allowing users to format FAQ answers with rich text. This integration improves readability and presentation, making the content more engaging and accessible.

-How a WYSIWYG Editor Works Internally:

    - Retrieve content from WYSIWYG Editor:
        - The content from the WYSIWYG editor is typically sent from the frontend as an HTML string.
        - The HTML content contains user input (question, answer, etc.) wrapped in HTML tags like <body>, <p>, <strong>, etc.

    - Extract Text Using Cheerio:
        - The cheerio library is used to load and parse the HTML content on the server.
        - We extract the plain text from the HTML tags by selecting the <body> tag and calling the .text() method.

    - Translate Using Google Translate API:
        - The extracted text is sent to Google Translate API using the translate.translate() method.
        - The target language for translation is provided as an argument.

    - Replace Translated Text in HTML:
        - After translation, we replace the original text within the <body> tag with the translated content.
        - The updated HTML content is generated and returned.

    - Store Translated Content:
        - The translated HTML content is then stored in the database in HTML format.
        - This allows the content to be properly rendered on the frontend with all necessary HTML tags intact.


    - For Our Project we can use QuillJs for the frontend React.


- Redis Caching

To enhance application performance, Redis is utilized to cache frequently accessed FAQ data. This approach reduces database load and accelerates response times.

- Libraries and Tools:
   - Redis Server: An in-memory data structure store used as a cache.
   - Node.js Redis Client: A library to interface with the Redis server from a Node.js application.

    - Installation Steps:

       - Install Redis Server:
            - Windows: Use the Windows Subsystem for Linux (WSL) to install Redis.
                    - npm install redis

        - Install Node.js Redis Client:
            - Use npm to install the Redis client library 
                    - const { createClient } = require("redis");
        - Provide your Redis configuration details in .env file
                - Host
                - Port
                - Username
                - Password
    - create a middleware cacheMiddleware for fetching FAQs fastly  from Redis . If cache not found then store the caching with FAQs to retrive the information next quickly


- Role-Based Access Control (RBAC) Integration

    - User Roles Definition:
        - The application defines multiple user roles with varying levels of access. Each role (e.g., Admin, User) has specific permissions assigned to it. The roles control who can post, read, update, or delete FAQs through the admin panel and API. Admins have full access, and users can only view FAQs and get FAQs.

    - Access Management for API Routes:
        - API routes are protected using role-based authentication, ensuring that users can only access the endpoints allowed for their assigned role. For instance, only users with the "Admin" or "User" roles can update or delete FAQ entries, while "User" role users are restricted to read-only access and get-FAQs.

    - Authorization Middleware:
        - Authorization middleware is implemented to check the user's role before granting access to specific API routes. This middleware verifies the role of the authenticated user and ensures that their permissions align with the requested operation, such as updating or deleting FAQs. This prevents unauthorized actions and enforces secure role-based access control across the application.


            -Admin's Capabilities:

                - Post FAQs:
                    - The admin can add a new FAQ (question and answer) in the desired language. When posting a question, the admin  can specify the language in which they want to add the FAQ.
                    - The question and answer will be translated into the selected language before saving to the database.

                - Get FAQs:
                    - The admin can retrieve all FAQs in a specific language. If the FAQs for that language are cached in Redis, the data will be served from the cache. If not, the FAQs will be translated and then cached for subsequent requests.

                - Delete FAQs:
                    - The admin can delete an FAQ by specifying the FAQ ID. Once deleted, the corresponding cached FAQ (if it exists) will also be removed from Redis.

            - How it Works:

                - Post FAQs (POST /faqs):
                    - Admin posts a question and answer along with the language.
                    - The question and answer are translated into the specified language.
                    - The FAQ is saved to the database with the translated content and language.

                - Get FAQs (GET /faqs):
                    - Admin or users can view the FAQs in the language of their choice.
                    - The system checks Redis for cached FAQs for the selected language. If not found, it fetches the FAQs from the database and translates them.

                - Delete FAQs (DELETE /faqs/:id):
                    - Admin deletes an FAQ by ID.
                    - The FAQ is removed from the database and its corresponding cache in Redis is deleted.

                - Update FAQs (PUT /faqs/:id)"
                    - Admin can update the question and answers .
                    - This updation of content will reflect to change all the translations.


            - User's Capabilities :

                - Get FAQs:
                    - The user can retrieve all FAQs in a specific language. If the FAQs for that language are cached in Redis, the data will be served from the cache. If not, the FAQs will be translated and then cached for subsequent requests. User can only get question and answers , he is not allowed to post question and answers.
                    

            - AdminRoutes
                - adminRouter.post("/faqs", adminMiddleware, async (req, res) => {})
                - adminRouter.get("/faqs",   redisMiddleware, async (req, res) => {})
                - adminRouter.put("/faqs/:id", adminMiddleware, async (req, res) => {})
                - adminRouter.delete("/faqs/:id", adminMiddleware, async (req, res) => {})

            - UserRoutes
                - userRouter.get("/faqs", cacheMiddleware, async (req, res) => {})

- Multilingual Support

FAQs can be managed in multiple languages. The system allows for translations of questions and answers, enabling users to access content in their preferred language.

  - Translations for Questions and Answers:
        - Each FAQ entry supports multiple languages, including translations for the question and answer fields. Translations are stored in the database and are dynamically fetched based on the user's language preference

  - Language Selection:
        - The API provides a ?lang=<language_code> query parameter to fetch FAQs in the selected language. If no translation is available for a particular language, the system falls back to the default language (English)

  - Automatic Translations:
        - Translations for questions and answers can be automatically generated using third-party translation services like Google Translate. This feature ensures that the FAQs are available in multiple languages without manual translation work. For this we have use Goole-cloud/translate.v2 model
                
                - const { Translate } = require("@google-cloud/translate").v2;
                - Provide your API key in .env file 
                    -const translate = new Translate({key: process.env.GOOGLE_TRANSLATE_API_KEY});

- Unit Testing with Jest

Here are the steps for unit testing using Jest, including libraries and a small example :


  - Install Jest, Supertest, Mongoose, and Mockingoose: Install dependencies for testing:
      - npm install --save-dev jest supertest mongoose mockingoose

  - Set up Jest configuration: Add a script in package.json to run tests:

        "scripts":  {
                    "test": "jest"
                    }

  - Write Model Tests: Create a test file faqModel.test.js and test the model methods:
     
        - Example :

                -const FAQ = require("./faqModel");
                describe("FAQ Model", () => {
                    it("should return the correct translation", () => {
                        const faq = new FAQ({ question: "What is Node?", translations: { en: "What is Node?", es: "¿Qué es Node?" } });
                        expect(faq.getTranslation("es")).toBe("¿Qué es Node?");
                    });
                });

   - Write API Tests: Use Supertest to test the API endpoints, e.g., POST /faqs:

        - Example :

                - const request = require("supertest");
                  const app = require("./app");

                  describe("Admin API", () => {
                  it("should create a new FAQ", async () => {
                        const res = await request(app)
                        .post("/admin/faqs")
                        .send({ question: "What is Node?", answer: "Node.js is a JavaScript runtime." })
                        .query({ lang: "en" });
                        expect(res.status).toBe(201);
                    });
                });

    - Mock Mongoose Models: Use mockingoose to mock Mongoose methods:

        - const mockingoose = require("mockingoose");
            mockingoose(FAQ).toReturn({ question: "What is Node?" }, "findOne");   

    - Run Tests: Run the tests using the command:
        - npm run test

These steps summarize how to set up and perform unit testing with Jest in the project, using mock data for models and testing your API endpoints with Supertest. 


                    
                  

           

    

