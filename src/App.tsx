import React, { useEffect, useState } from 'react';
import { Chat } from './components/Chat';
import { RAGPipeline } from './lib/rag';

const App: React.FC = () => {
  const [ragPipeline, setRagPipeline] = useState<RAGPipeline | null>(null);

  useEffect(() => {
    const initializeRAG = async () => {
      const pipeline = new RAGPipeline();
      
      // Sample documents - bisa diganti dengan data Anda
      const sampleDocs = [
        "Perusahaan kami menyediakan layanan customer service 24/7 yang excellent.",
        "Fitur produk termasuk analytics powered AI dan real-time reporting.",
        "Harga mulai dari $29/bulan untuk plan basic dan $99/bulan untuk premium.",
        "Kami menawarkan garansi uang kembali 30 hari untuk semua produk.",
        "Technical support bisa dihubungi di support@company.com atau +1-555-0123.",
        "Produk kami memiliki rating 4.8/5 dari lebih 1000 review customer.",
        "Kami mendukung integrasi dengan Slack, Google Workspace, dan Microsoft Teams."
      ];
      
      await pipeline.initializeWithDocuments(sampleDocs);
      setRagPipeline(pipeline);
      console.log('RAG system initialized!');
    };

    initializeRAG();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!ragPipeline) {
      return { answer: "System sedang loading...", sources: [] };
    }
    return await ragPipeline.query(message);
  };

  if (!ragPipeline) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>Loading RAG System...</h1>
        <p>Menginisialisasi AI Chatbot...</p>
      </div>
    );
  }

  return (
    <div>
      <header style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>🤖 RAG Chatbot Simple</h1>
        <p>Powered by Gemini API + TypeScript</p>
      </header>
      
      <main style={{ padding: '20px 0' }}>
        <Chat onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default App;