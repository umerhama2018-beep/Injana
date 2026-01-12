import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    // بەکارهێنانی ناوی مۆدێل بەبێ پاشگر
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imageData = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    const result = await model.generateContent([
      { text: "Identify this plant and its disease in one paragraph." },
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // گۆڕینی دەقی هەڵەکە بۆ ئەوەی بزانین کۆدەکە نوێ بووەتەوە
    return "هەڵەی وەشانی نوێ: " + (error.message || "404");
  }
}
