import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    // گۆڕینی ناوی مۆدێل بۆ وەشانی جێگیر
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imageData = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    const month = new Date().getMonth();
    let season = "Winter";
    if (month >= 2 && month <= 4) season = "Spring";
    else if (month >= 5 && month <= 7) season = "Summer";
    else if (month >= 8 && month <= 10) season = "Autumn";

    const prompts: any = {
      ku_so: `تۆ پسپۆڕی ڕووەکیت. وێنەکە بپشکنە و بەم شێوەیە بە کوردیی سۆرانی وەڵام بدەرەوە:
      ١- ناوی ڕووەکەکە.
      ٢- کێشە و نەخۆشییەکەی.
      ٣- چارەسەر بە خاڵبەندی.
      ٤- ڕێنمایی ئاڵتونی بۆ ئەم وەرزی ئێستایە (${season}).`,
      ku_km: `Navê riwekê, nexweşî û çareserî bi Kurmancî ji bo demsala (${season}).`,
      ar: `اسم النبات، المرض، والحل باللغة العربية لموسم (${season}).`,
      en: `Plant name, disease, and treatment for (${season}) season in English.`
    };

    const result = await model.generateContent([
      { text: prompts[lang] || prompts['en'] },
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error Detail:", error);
    // ئەگەر کێشەی 404 مابوو، دەقی هەڵەکە ڕوونتر دەکەینەوە
    return "سەرچاوەی هەڵە: " + (error.message || "کێشەیەک لە دۆزینەوەی مۆدێل هەیە");
  }
}
