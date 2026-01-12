import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Loader2, Home } from 'lucide-react';
import { analyzePlantImage } from './geminiService';

function App() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImage = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      try {
        const response = await analyzePlantImage(base64, "ku_so");
        setResult(response);
      } catch (err: any) {
        setResult("Error: " + err.message);
      }
      setLoading(false);
    };
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>ئینجانە - وەشانی نوێ</h2>
      {preview && <img src={preview} style={{ width: '100%', borderRadius: '10px' }} />}
      <br /><br />
      {!result && (
        <label style={{ background: '#007bff', color: 'white', padding: '15px 30px', borderRadius: '50px', cursor: 'pointer', display: 'inline-block' }}>
          <input type="file" accept="image/*" onChange={handleImage} hidden />
          {loading ? "خەریکی پشکنینە..." : "وێنە بگرە (تاقیکردنەوە)"}
        </label>
      )}
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <p>{result}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px' }}>دووبارە</button>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
