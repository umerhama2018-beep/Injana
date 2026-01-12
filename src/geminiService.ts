import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    // تاقیکردنەوەی مۆدێلی Pro کە زۆر جێگیرترە
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const imageData = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    const result = await model.generateContent([
      { text: "Identify this plant and describe its health/disease in Kurdish Sorani." },
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error(error);
    // ئەگەر Pro کاری نەکرد، مۆدێلی Flash بە ناوێکی تر تاقی دەکەینەوە
    return "هەڵەی سێرڤەر: " + (error.message || "404");
  }
}
