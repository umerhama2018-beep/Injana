import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Loader2, RefreshCw } from 'lucide-react';
import { analyzePlantImage } from './geminiService';

// ١. وەرگێڕانی زمانەکان
const translations: any = {
  ku_so: { title: "ئینجانە", subtitle: "پزیشکی ڕووەکەکانت", btn: "وێنە بگرە", loading: "خەریکی پشکنینە...", result: "ئەنجامی پشکنین", direction: 'rtl' },
  ku_km: { title: "Injana", subtitle: "Bijîşkê riwekên te", btn: "Wêne bikişîne", loading: "Kontrol dike...", result: "Encama kontrolê", direction: 'rtl' },
  ar: { title: "إنـجـانـة", subtitle: "طبيب نباتاتك الشخصي", btn: "التقط صورة", loading: "جاري الفحص...", result: "نتيجة الفحص", direction: 'rtl' },
  en: { title: "Injana", subtitle: "Your Plant Doctor", btn: "Take a Photo", loading: "Analyzing...", result: "Analysis Result", direction: 'ltr' }
};

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

  // فەنکشنێک بۆ بچووککردنەوەی وێنە (زۆر گرنگە بۆ مۆبایل)
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // قەبارەی وێنەکە زۆر بچووک دەکەینەوە
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // کوالێتی دەکەینە ٧٠٪
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
      setResult("هەڵەیەک ڕوویدا: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f7f0', direction: t.direction as any, fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {Object.keys(translations).map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 12px', borderRadius: '20px', border: lang === l ? '2px solid #2e7d32' : '1px solid #ccc', background: 'white' }}>
              {l === 'ku_so' ? 'سۆرانی' : l === 'ku_km' ? 'Kurmancî' : l === 'ar' ? 'عربي' : 'EN'}
            </button>
          ))}
        </div>

        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <InjanaLogo />
          <h1 style={{ color: '#1b5e20', fontSize: '2.8rem', margin: '0' }}>{t.title}</h1>
          <p style={{ color: '#4caf50', fontWeight: 'bold' }}>{t.subtitle}</p>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          {preview && <img src={preview} alt="Plant" style={{ width: '100%', borderRadius: '20px', marginBottom: '20px' }} />}
          <input type="file" accept="image/*" onChange={handleImage} id="injana-upload" hidden />
          <label htmlFor="injana-upload" style={{ backgroundColor: '#2e7d32', color: 'white', padding: '15px 30px', borderRadius: '50px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', fontWeight: 'bold', width: '80%', justifyContent: 'center' }}>
            {loading ? <Loader2 style={{ animation: 'spin 2s linear infinite' }} /> : <Camera />}
            {loading ? t.loading : t.btn}
          </label>
        </div>

        {result && (
          <div style={{ marginTop: '25px', backgroundColor: 'white', borderRadius: '25px', padding: '25px', borderRight: t.direction === 'rtl' ? '10px solid #2e7d32' : 'none', borderLeft: t.direction === 'ltr' ? '10px solid #2e7d32' : 'none', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#1b5e20' }}>{t.result}:</h3>
            <p style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>{result}</p>
            <button onClick={() => {setPreview(null); setResult("");}} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <RefreshCw size={14} /> پشکنینێکی نوێ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
