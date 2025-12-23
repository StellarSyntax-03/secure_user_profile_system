Project Documentation: SecureID
1. Project Overview
SecureID is a robust Identity Management Dashboard designed to demonstrate secure handling of sensitive personal data (PII) within a web application context. The assignment focuses on the "Secure by Design" principle, specifically implementing encryption-at-rest for sensitive fields (National ID/Aadhaar) and secure authentication flows.
Implementation Approach:
•	Architecture: The application follows a MERN (MongoDB, Express, React, Node.js) architectural pattern.
•	Simulation: For the purpose of this portable submission, the backend logic and database layer are simulated securely within the client-side (mockServer.ts) using localStorage as the data store and the browser's native Web Crypto API for AES-GCM encryption. This ensures the app functions immediately without complex environment setup while proving the logic works.
•	Security:
o	Encryption: Sensitive data (Aadhaar numbers) is encrypted using AES-256-GCM before it is ever "saved" to the database.
o	Authentication: Stateless authentication is simulated using JSON Web Tokens (JWT).
o	UI/UX: Built with React 18 and Tailwind CSS, featuring a "Glassmorphism" design language to convey a modern, high-security aesthetic.
2. Setup/Run Instructions
Since this project simulates the full stack within a React environment for demonstration, you only need to run the frontend client.
Prerequisites
•	Node.js (v16.0.0 or higher)
•	npm (v7.0.0 or higher)
Installation & Execution
1.	Unzip/Navigate to the project directory.
2.	Install Dependencies:
Open your terminal in the project folder and run:
codeBash
npm install
(Key dependencies: react, react-dom, react-router-dom, tailwindcss)
1.	npm start
Start the Application:
codeBash
npm start
Or if using Vite:
codeBash
npm run dev
2.	Access the App:
Open your browser and navigate to http://localhost:3000 (or the port shown in your terminal).
How to Test
1.	Click "Get Started" to go to the Register page.
2.	Create an account (The Aadhaar ID you enter is encrypted immediately).
3.	You will be redirected to the Dashboard.
4.	Try the "Decrypt & Reveal" button to see the secure data retrieval in action.
5.	Use "Quick Actions" to change your password or revoke tokens.
3. API Documentation
Although simulated in services/mockServer.ts, the application is structured to consume the following RESTful endpoints
Auth Routes
Method	Endpoint	Description	Request Body
POST	/api/auth/register	Registers a new user and encrypts sensitive data.	{ name, email, aadhaar, password }
POST	/api/auth/login	Authenticates user and returns JWT.	{ email, password }
POST	/api/auth/revoke	(Protected) Invalidates the current user token.	{ token }
User Routes
Method	Endpoint	Description	Request Body
GET	/api/user/profile	(Protected) Fetches user profile. Server decrypts data before sending (or sends encrypted based on config).	Headers: Authorization: Bearer <token>
PUT	/api/user/password	(Protected) Updates the user's password.	{ userId, newPassword }
4. Database Schema
The application models a NoSQL Document structure (MongoDB style).
Collection: Users
{
  "_id": {
    "type": "UUID",
    "required": true,
    "description": "Unique system identifier"
  },
  "name": {
    "type": "String",
    "required": true
  },
  "email": {
    "type": "String",
    "required": true,
    "unique": true
  },
  "aadhaarEncrypted": {
    "type": "String",
    "required": true,
    "description": "AES-256-GCM Ciphertext containing the IV and Encrypted Data"
  },
  "createdAt": {
    "type": "ISODate",
    "default": "Date.now"
  }
}

Note: The aadhaarDecrypted field seen in the frontend types is a virtual field and is never stored in the database.
5. AI Tool Usage Log 

Phase	Task Description	AI Tool Used	Prompt / Interaction Summary	Outcome/Contribution
Encryption Logic	Implementing AES-GCM encryption using Web Crypto API.	Gemini / ChatGPT	"How to implement AES-GCM encryption/decryption using native window.crypto.subtle in TypeScript?"	AI provided the specific syntax for generating IVs (Initialization Vectors) and deriving keys using PBKDF2, ensuring the encryption implementation was cryptographically sound.
UI Design	Styling the dashboard with a specific aesthetic.	Gemini / ChatGPT	"Generate Tailwind CSS classes for a dark-mode glassmorphism card effect with blur and semi-transparent borders."	Generated the glass-panel and glass-input utility classes used throughout the app for a modern security-dashboard look.
Debugging	Fixing race conditions in React state.	Gemini / ChatGPT	"useEffect hook running twice causing notification to dismiss too early."	AI suggested using a cleanup function in useEffect and clarified React 18 Strict Mode behavior, helping stabilize the notification system.
Data Simulation	Creating a mock backend service.	Gemini / ChatGPT	"How to simulate async API calls with latency using Promises in TypeScript?"	Helped structure the mockServer.ts file to mimic network delay (setTimeout) and Promise-based responses, making the frontend behave as if connected to a real API.
________________________________________
Declaration:
The core logic, architecture, and component structure were designed by Chatgpt and Gemini and some part of it was done by me aswell. AI tools were utilized primarily as a reference for complex syntax and to accelerate the styling of UI components.

