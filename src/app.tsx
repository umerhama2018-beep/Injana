import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Loader2, Home, ShoppingBag, Megaphone } from 'lucide-react';
import { analyzePlantImage } from './geminiService';

const translations: any = {
  ku_so: { title: "ئینجانە", subtitle: "پزیشکی ڕووەکەکانت", btn: "وێنە بگرە", loading: "خەریکی پشکنینە...", result: "ئەنجامی پشکنین", reset: "گەڕانەوە بۆ سەرەتا", adsTitle: "فرۆشیارانی گوڵ و نەمام", direction: 'rtl' },
  ku_km: { title: "Injana", subtitle: "Bijîşkê riwekên te", btn: "Wêne bikişîne", loading: "Kontrol dike...", result: "Encama kontrolê", reset: "Vegere serê", adsTitle: "Firoşkarên Gulan", direction: 'rtl' },
  ar: { title: "إنـجـانـة", subtitle: "طبيب نباتاتك الشخصي", btn: "التقط صورة", loading: "جاري الفحص...", result: "نتيجة الفحص", reset: "العودة للرئيسية", adsTitle: "بائعي الزهور", direction: 'rtl' },
  en: { title: "Injana", subtitle: "Your Plant Doctor", btn: "Take a Photo", loading: "Analyzing...", result: "Result", reset: "Start Over", adsTitle: "Plant Stores", direction: 'ltr' }
};

// لۆگۆی گرافیکی ئینجانە (بۆ هێدەر)
const InjanaLogo = () => (
  <div style={{ width: '80px', height: '80px', margin: '0 auto 10px' }}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10L5 4H19L17 10" stroke="#2e7d32" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M5 10H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V10Z" fill="#a1887f" stroke="#5d4037" strokeWidth="1.5"/>
      <path d="M12 10V4M12 4L10 6M12 4L14 6" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

function App() {
  const [lang, setLang] = useState('ku_so');
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const t = translations[lang];

  const resetApp = () => {
    setResult("");
    setPreview(null);
    setLoading(false);
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setResult("");
    try {
      const resizedBase64 = await resizeImage(file);
      setPreview(resizedBase64);
      const response = await analyzePlantImage(resizedBase64, lang);
      setResult(response);
    } catch (err: any) {
      setResult("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f8f4', direction: t.direction as any, fontFamily: 'Arial, sans-serif', paddingBottom: '60px' }}>
      
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        
        {/* Language Selection */}
        {!preview && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {Object.keys(translations).map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 14px', borderRadius: '20px', border: lang === l ? '2px solid #2e7d32' : '1px solid #ccc', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                {l === 'ku_so' ? 'سۆرانی' : l === 'ku_km' ? 'Kurmancî' : l === 'ar' ? 'عربي' : 'EN'}
              </button>
            ))}
          </div>
        )}

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <InjanaLogo />
          <h1 style={{ color: '#1b5e20', fontSize: '2.8rem', margin: '0', fontWeight: 'bold' }}>{t.title}</h1>
          <p style={{ color: '#4caf50', margin: '5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{t.subtitle}</p>
        </header>

        {/* Main Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '35px', padding: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', textAlign: 'center', marginBottom: '30px' }}>
          {preview && <img src={preview} alt="Plant" style={{ width: '100%', borderRadius: '25px', marginBottom: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />}
          
          {!result && (
            <>
              <input type="file" accept="image/*" onChange={handleImage} id="injana-upload" hidden />
              <label htmlFor="injana-upload" style={{ backgroundColor: '#2e7d32', color: 'white', padding: '18px 35px', borderRadius: '50px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '15px', fontSize: '1.3rem', fontWeight: 'bold', width: '90%', justifyContent: 'center' }}>
                {loading ? <Loader2 style={{ animation: 'spin 2s linear infinite' }} size={28} /> : <Camera size={28} />}
                {loading ? t.loading : t.btn}
              </label>
            </>
