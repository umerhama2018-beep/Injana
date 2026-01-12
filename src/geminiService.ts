import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCjnAeqoceIepwGY-5CuC55zXCwrzgFSEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzePlantImage(base64Image: string, lang: string) {
  try {
    // بەکارهێنانی مۆدێلی جێگیر
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imageData = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;

    const month = new Date().getMonth();
    let season = "Winter";
    if (month >= 2 && month <= 4) season = "Spring";
    else if (month >= 5 && month <= 7) season = "Summer";
    else if (month >= 8 && month <= 10) season = "Autumn";

    const prompts: any = {
      ku_so: `تۆ پسپۆڕی ڕووەکیت. بە کوردیی سۆرانی وەڵام بدەرەوە: ١- ناوی ڕووەک. ٢- نەخۆشی. ٣- چارەسەر. ٤- ڕێنمایی ئاڵتونی بۆ وەرزی (${season}).`,
      ku_km: `Bi Kurmancî bersiv bide: 1- Navê riwekê. 2- Nexweşî. 3- Çareserî. 4- Şîreta zêrîn ji bo demsala (${season}).`,
      ar: `أجب بالعربية: ١- اسم النبات. ٢- المرض. ٣- الحل. ٤- نصيحة ذهبية لموسم (${season}).`,
      en: `Respond in English: 1- Plant Name. 2- Disease. 3- Treatment. 4- Golden advice for (${season}).`
    };

    const result = await model.generateContent([
      { text: prompts[lang] || prompts['en'] },
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    if (error.message.includes("404")) return "هەڵەی 404: گوگل مۆدێلەکەی نەدۆزیەوە. تکایە VPN چالاک بکە و دووبارە تاقیبکەرەوە.";
    return "سەرچاوەی هەڵە: " + (error.message || "404");
  }
}
