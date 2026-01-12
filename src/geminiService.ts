import { GoogleGenerativeAI } from "@google/generative-ai";

// بەکارهێنانی کلیلەکە بە شێوەی ڕاستەوخۆ بۆ دڵنیابوون لە کارکردنی
const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // لێرەدا بەشە زیادەکانی base64 لادەبەین
    const imageData = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    const prompts: any = {
      ku_so: "تۆ پسپۆڕی ڕووەکیت. وێنەکە بپشکنە و بە کوردیی سۆرانی وەڵام بدەرەوە: ناوی ڕووەک، نەخۆشی، و چارەسەر.",
      ku_km: "Tu pisporê riwekan î. Vê wêneyê kontrol bike û bi Kurmancî bersiv bide: Navê riwekê, nexweşî û çareserî.",
      ar: "أنت خبير نباتات. افحص الصورة وأجب باللغة العربية: اسم النبات، المرض، والعلاج.",
      en: "You are a plant expert. Analyze this image and respond in English: Plant name, disease, and treatment."
    };

    const result = await model.generateContent([
      prompts[lang] || prompts['en'],
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);
    
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "هەڵەیەک لە پەیوەندی دروست بوو");
  }
}
