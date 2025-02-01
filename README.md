# FAQ Management System with Express.js, MongoDB, Redis, and WYSIWYG Editor

## Overview

-This project is an FAQ Management System built with Express.js, MongoDB, and Redis. It features:

    - CRUD operations for FAQs
    - WYSIWYG editor for rich-text formatting
    - Multilingual support
    - Redis caching for improved performance
    - Admin panel for managing FAQs

## Installation

Here's the step-by-step setup for the Express backend with the required libraries and corresponding npm commands:

    -Initialize a new Node.js project
        - npm init 

    -Install Express for creating the server
        - npm install express

    -Install Mongoose for MongoDB integration
        - npm install mongoose

    - Install CORS to enable cross-origin requests
        - npm install cors

    -Install body-parser to parse incoming request bodies
        - npm install body-parser

    -Install AdminBro for admin panel
        - npm install admin-bro

    -Install AdminBro Express Adapter for integrating AdminBro with Express
        - npm install @admin-bro/express

    -Install googletrans library for multilingual support
        - npm install googletrans

    -Install Redis and ioredis for caching FAQs
        - npm install redis ioredis

    -Install dotenv for managing environment variables
        - npm install dotenv

    -Install ckeditor and admin-bro-ckeditor for integrating a WYSIWYG editor in the admin panel
        - npm install @ckeditor/ckeditor5-build-classic admin-bro-ckeditor

    -Install passport and bcryptjs for authentication and role-based access management
        - npm install passport bcryptjs

    -Install JSON Web Token (JWT) for handling user authentication and authorization
        - npm install jsonwebtoken

    -Install jest or mocha for unit testing
        - npm install jest 

    -Install nodemon for auto-restarting the server during development
        - npm install --save-dev nodemon

Create a .env file to store sensitive configurations like DB URL, JWT secret, etc

## Features

- CRUD Operations for FAQs

    - Create: Add new FAQs with questions and answers.
    - Read: Retrieve a list of all FAQs.
    - Update: Modify existing FAQs.
    - Delete: Remove FAQs from the system.


-  WYSIWYG Editor Integration

Integrating a WYSIWYG (What You See Is What You Get) editor enhances the user experience by allowing users to format FAQ answers with rich text. This integration improves readability and presentation, making the content more engaging and accessible.

- Installation and Integration Steps:
            
    -For this implementation, we will use Quill.js, a free, open-source WYSIWYG editor built for the modern web.
    -If you're using npm, install Quill.js by running
            - npm install quill
    -Then, import Quill.js into your JavaScript file:
            - import Quill from 'quill'

    - Integrate with Backend:
            - When submitting the form, send the editor's content to your backend (e.g., Express.js) via an API endpoint.   Ensure that your backend is configured to handle HTML content appropriately.

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


- Role-Based Access Control (RBAC) Integration

    - User Roles Definition:

        - The application defines multiple user roles with varying levels of access. Each role (e.g., Admin, User) has specific permissions assigned to it. The roles control who can post, read, update, or delete FAQs through the admin panel and API. Admins have full access, and users can only view FAQs and get FAQs.

    - Access Management for API Routes:

        - API routes are protected using role-based authentication, ensuring that users can only access the endpoints allowed for their assigned role. For instance, only users with the "Admin" or "User" roles can update or delete FAQ entries, while "User" role users are restricted to read-only access and get-FAQs.

    - Authorization Middleware:

        - Authorization middleware is implemented to check the user's role before granting access to specific API routes. This middleware verifies the role of the authenticated user and ensures that their permissions align with the requested operation, such as updating or deleting FAQs. This prevents unauthorized actions and enforces secure role-based access control across the application.

                 - AdminRoutes
                    - adminRouter.post("/faqs", adminMiddleware, async (req, res) => {})
                    - adminRouter.get("/faqs", redisMiddleware, async (req, res) => {})
                    - adminRouter.put("/faqs/:id", adminMiddleware, async (req, res) => {})
                    - adminRouter.delete("/faqs/:id", adminMiddleware, async (req, res) => {})
                - UserRoutes
                    - userRouter.post("/faqs", async (req, res) => {})
                    - userRouter.get("/faqs", cacheMiddleware, async (req, res) => {})


                 - http://localhost:1234/admin/faqs
                 - http://localhost:1234/admin/faqs?lang=hi
                 - http://localhost:1234/user/faqs?lang=hi
                 - http://localhost:1234/user/faqs

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
                    -const translate = new Translate({
                                                        key: process.env.GOOGLE_TRANSLATE_API_KEY,
                                                    });
                    
                  

           

    

