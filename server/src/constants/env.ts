import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const PORT = process.env.PORT || 5000;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

export {
  GEMINI_API_KEY,
  PORT,
  GMAIL_APP_PASSWORD,
  SENDER_EMAIL,
  APP_BASE_URL,
  NODE_ENV,
};
