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
      setResult("هەڵەیەک ڕوویدا لە کاتی پەیوەندی بە ژیری دەستکرد: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f8f4', direction: t.direction as any, fontFamily: 'Arial, sans-serif', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        {!preview && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {Object.keys(translations).map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 14px', borderRadius: '20px', border: lang === l ? '2px solid #2e7d32' : '1px solid #ccc', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                {l === 'ku_so' ? 'سۆرانی' : l === 'ku_km' ? 'Kurmancî' : l === 'ar' ? 'عربي' : 'EN'}
              </button>
            ))}
          </div>
        )}

        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <InjanaLogo />
          <h1 style={{ color: '#1b5e20', fontSize: '2.8rem', margin: '0', fontWeight: 'bold' }}>{t.title}</h1>
          <p style={{ color: '#4caf50', margin: '5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{t.subtitle}</p>
        </header>

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
          )}
          {result && (
            <button onClick={resetApp} style={{ backgroundColor: '#f0f0f0', color: '#333', padding: '12px 25px', borderRadius: '50px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
              <Home size={20} /> {t.reset}
            </button>
          )}
        </div>

        {result && (
          <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '25px', borderRight: t.direction === 'rtl' ? '12px solid #2e7d32' : 'none', borderLeft: t.direction === 'ltr' ? '12px solid #2e7d32' : 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
            <h3 style={{ color: '#1b5e20', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Megaphone size={22} /> {t.result}:
            </h3>
            <div style={{ lineHeight: '1.9', whiteSpace: 'pre-line', fontSize: '1.15rem', color: '#333' }}>{result}</div>
          </div>
        )}

        <div style={{ marginTop: '50px' }}>
          <h3 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <ShoppingBag size={20} /> {t.adsTitle}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: 'white', padding: '10px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
                <div style={{ height: '80px', background: '#f9f9f9', borderRadius: '15px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   <img src="logo.png" alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/100?text=Ad'; }} />
                </div>
                <p style={{ margin: '0', fontWeight: 'bold', fontSize: '0.8rem', color: '#666' }}>
                  {lang === 'ku_so' ? 'فرۆشیار ' + i : 'Seller ' + i}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
