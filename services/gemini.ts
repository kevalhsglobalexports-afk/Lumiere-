
import { GoogleGenAI } from "@google/genai";

// Skincare advisor service using Gemini API
export const getSkinAdvice = async (userConcerns: string) => {
  // Always use process.env.API_KEY directly when initializing GoogleGenAI as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Expert skincare advice for the following concerns: ${userConcerns}`,
      config: {
        // Using systemInstruction for role definition as per guidelines
        systemInstruction: "You are a luxury beauty consultant for Lumière Essence. Provide expert skincare advice that is professional, empathetic, and aesthetic. Mention that our Silk Radiance Serum or Velvet Midnight Cream might help if applicable. Keep the response under 150 words.",
        temperature: 0.7,
        topP: 0.9,
      }
    });
    
    // Access response.text directly (property access, not a function call)
    return response.text || "I'm sorry, I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my beauty wisdom right now. Please try again later.";
  }
};
