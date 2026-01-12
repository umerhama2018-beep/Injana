import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageData = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    const result = await model.generateContent([
      { text: "Analyze this plant image and identify the disease." },
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // ئەم دێڕەی خوارەوە گرنگترین شتە، هەڵە ڕاستەقینەکە پیشان دەدات
    console.error(error);
    return "سەرچاوەی هەڵە: " + (error.message || "کێشەی نەزانراو");
  }
}
