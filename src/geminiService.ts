import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const imageData = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    const month = new Date().getMonth();
    let season = "Winter";
    if (month >= 2 && month <= 4) season = "Spring";
    else if (month >= 5 && month <= 7) season = "Summer";
    else if (month >= 8 && month <= 10) season = "Autumn";

    const prompts: any = {
      ku_so: `تۆ پسپۆڕی ڕووەکیت. وێنەکە بپشکنە و بەم شێوەیە وەڵام بدەرەوە:
      ١- ناوی ڕووەکەکە.
      ٢- کێشە و نەخۆشییەکەی.
      ٣- چارەسەر بە خاڵبەندی.
      ٤- ڕێنمایی ئاڵتونی بۆ ئەم وەرزی ئێستایە (${season}).
      وەڵامەکان بە کوردیی سۆرانی بن.`,
      // ... (باقی زمانەکان وەک خۆی)
      ku_km: `Navê riwekê, Nexweşî, Çareserî û Şîreta zêrîn ji bo (${season}) bi Kurmancî.`,
      ar: `اسم النبات، المرض، الحل، ونصيحة ذهبية لموسم (${season}) بالعربية.`,
      en: `Plant Name, Disease, Treatment, and Golden advice for (${season}) in English.`
    };

    const result = await model.generateContent([
      { text: prompts[lang] || prompts['en'] },
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // لێرەدا هەڵە ڕاستەقینەکە دەردەخەین بۆ دۆزینەوەی کێشەکە
    console.error("Detailed Gemini Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) return "کلیلەکە (API Key) کار ناکات یان هەڵەیە.";
    if (error.message?.includes("403")) return "گوگل ڕێگری لەم کلیلە دەکات. دڵنیابەرەوە لە ڕێکخستنی کلیلەکە.";
    if (error.message?.includes("location")) return "ببورە، ئەم خزمەتگوزارییەی گوگل لەم ناوچەیە کار ناکات بەبێ VPN.";
    throw new Error(error.message || "کێشەیەک لە پەیوەندی دروست بوو");
  }
}
