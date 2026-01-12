import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
      ku_km: `Tu pisporê riwekan î. Bi vî rengî bersiv bide:
      1- Navê riwekê.
      2- Nexweşî û pirsgirêk.
      3- Çareserî.
      4- Şîreta zêrîn ji bo vê demsalê (${season}).
      Bi Kurmancî bersiv bide.`,
      ar: `أنت خبير نباتات. أجب بالتنسيق التالي:
      1- اسم النبات.
      2- المشكلة أو المرض.
      3- الحلول المقترحة.
      4- نصيحة ذهبية لهذا الموسم (${season}).
      باللغة العربية.`,
      en: `You are a plant expert. Respond in this format:
      1- Plant Name.
      2- Disease or Problem.
      3- Treatment steps.
      4- Golden advice for current season (${season}).`
    };

    const result = await model.generateContent([
      { text: prompts[lang] || prompts['en'] },
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);
    
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Error");
  }
}
