import React, { useState } from 'react';
import { Camera, Loader2, RefreshCw, Megaphone } from 'lucide-react';
import { analyzePlantImage } from './geminiService';

const translations: any = {
  ku_so: { title: "ئینجانە", subtitle: "پزیشکی ڕووەکەکانت", btn: "وێنە بگرە", loading: "خەریکی پشکنینە...", result: "ئەنجامی پشکنین", adLabel: "ڕیکلام", direction: 'rtl' },
  ku_km: { title: "Injana", subtitle: "Bijîşkê riwekên te", btn: "Wêne bikişîne", loading: "Kontrol dike...", result: "Encama kontrolê", adLabel: "Reklam", direction: 'rtl' },
  ar: { title: "إنـجـانـة", subtitle: "طبيب نباتاتك الشخصي", btn: "التقط صورة", loading: "جاري الفحص...", result: "نتيجة الفحص", adLabel: "إعلان", direction: 'rtl' },
  en: { title: "Injana", subtitle: "Your Plant Doctor", btn: "Take a Photo", loading: "Analyzing...", result: "Analysis Result", adLabel: "Ad", direction: 'ltr' }
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

export default function App() {
  const [lang, setLang] = useState('ku_so');
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const t = translations[lang];

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setLoading(true);
      try {
        const response = await analyzePlantImage(base64, lang);
        setResult(response);
      } catch (err) {
        setResult("Error / هەڵە");
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f7f0', direction: t.direction as any, fontFamily: 'Arial, sans-serif' }}>
      
      {/* Ad Section */}
      <div style={{ background: '#2e7d32', color: 'white', padding: '10px', textAlign: 'center', fontSize: '0.9rem' }}>
        <marquee scrollamount="5">{t.adLabel}: شوێنی ڕیکلامی تۆ لێرەیە - پەیوەندی بکە بۆ ڕیکلام: 0750XXXXXXX</marquee>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {Object.keys(translations).map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 12px', borderRadius: '20px', border: lang === l ? '2px solid #2e7d32' : '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
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
          <label htmlFor="injana-upload" style={{ backgroundColor: '#2e7d32', color: 'white', padding: '15px 30px', borderRadius: '50px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {loading ? <Loader2 className="animate-spin" /> : <Camera />}
            {loading ? t.loading : t.btn}
          </label>
        </div>

        {result && (
          <div style={{ marginTop: '25px', backgroundColor: 'white', borderRadius: '25px', padding: '25px', borderRight: t.direction === 'rtl' ? '10px solid #2e7d32' : '', borderLeft: t.direction === 'ltr' ? '10px solid #2e7d32' : '', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
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
