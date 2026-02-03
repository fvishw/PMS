import { GEMINI_API_KEY } from "@/constants/env.js";
import type { IUserPerformance } from "@/models/userPerformance.model.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  geminiResponseSchema,
  geminiResponseSchemaFormat,
} from "./geminiResponseSchema.js";
import { ApiError } from "@/utils/ApiError.js";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

async function generateReport(performance: IUserPerformance) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
              You are an HR performance evaluation assistant.

              Rules:
              - Use ONLY the provided data.
              - Do NOT assume or invent information.
              - If data is missing, say so explicitly.
              - Evaluate objectively and professionally.
              - Output MUST be valid JSON that strictly matches the given schema.
              - Do NOT include any text outside JSON.
              - At then end provide Score out of 100 based on the data.
                `,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: JSON.stringify(performance),
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: geminiResponseSchemaFormat,
      },
    });
    const parsedResponse = geminiResponseSchema.parse(
      JSON.parse(response.text!),
    );
    const parsedFormattedResponse =
      geminiResponseSchema.safeParse(parsedResponse);
    if (!parsedFormattedResponse.success) {
      console.error("Parsed response does not match schema");
      throw new Error("Invalid response format from AI model");
    }
    return parsedFormattedResponse.data;
  } catch (error) {
    throw new ApiError(500, `AI Generation Error: ${(error as Error).message}`);
  }
}
export default generateReport;
