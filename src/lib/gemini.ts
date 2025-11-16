import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export class GeminiClient {
  private model;
  
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      // Check API key
      console.log("API Key exists:", !!import.meta.env.VITE_GEMINI_API_KEY);
      console.log("API Key prefix:", import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 5));
      
      console.log("Sending prompt:", prompt);
      const result = await this.model.generateContent(prompt);
      console.log("Result received:", result);
      
      const response = await result.response;
      console.log("Response object:", response);
      console.log("Response candidates:", response.candidates);
      console.log("Response text method available:", typeof response.text === 'function');
      
      // Check if response was blocked
      if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0];
        console.log("Candidate finish reason:", candidate.finishReason);
        console.log("Candidate safety ratings:", candidate.safetyRatings);
        
        if (candidate.finishReason === 'SAFETY') {
          return "Maaf, response diblokir karena safety filter. Coba ubah pertanyaan Anda.";
        }
      }
      
      const responseText = response.text();
      console.log("Response text:", responseText);
      console.log("Response text length:", responseText?.length);
      
      if (!responseText || responseText.trim() === '') {
        return "Maaf, tidak ada response dari AI. Coba lagi dengan pertanyaan yang berbeda.";
      }
      
      return responseText;
    } catch (error) {
      console.error("Gemini API Error Details:", {
        message: (error as any)?.message,
        status: (error as any)?.status,
        statusText: (error as any)?.statusText,
        details: (error as any)?.details,
        fullError: error
      });
      return "Maaf, terjadi error saat memproses permintaan Anda.";
    }
  }
}