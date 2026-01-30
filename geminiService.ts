
import { GoogleGenAI, Type } from "@google/genai";
import { ObservationInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateGlobalInsight = async (topic: string): Promise<ObservationInsight> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the current global satellite observation data for ${topic}. Provide a realistic, professional intelligence report.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          region: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          threatLevel: { type: Type.STRING },
          details: { type: Type.STRING }
        },
        required: ["category", "region", "confidence", "summary", "threatLevel", "details"]
      }
    }
  });

  return JSON.parse(response.text) as ObservationInsight;
};
