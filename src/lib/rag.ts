import { GeminiClient } from './gemini';
import { SimpleVectorStore } from './simpleVectorStore';

export class RAGPipeline {
  private vectorStore: SimpleVectorStore;
  private geminiClient: GeminiClient;

  constructor() {
    this.vectorStore = new SimpleVectorStore();
    this.geminiClient = new GeminiClient();
  }

  async initializeWithDocuments(documents: string[]) {
    const docs = documents.map(content => ({
      content,
      metadata: { source: 'upload', timestamp: Date.now() }
    }));
    
    await this.vectorStore.addDocuments(docs);
    console.log(`RAG system initialized with ${documents.length} documents`);
  }

  async query(question: string): Promise<{ answer: string; sources: string[] }> {
    try {
      // 1. Search relevant documents
      const relevantDocs = await this.vectorStore.search(question, 3);
      
      if (relevantDocs.length === 0) {
        const answer = await this.geminiClient.generateResponse(question);
        return { answer, sources: [] };
      }

      // 2. Build context from CV/Portfolio data
      const context = relevantDocs
        .map(doc => doc.content)
        .join('\n\n---\n\n');

      // 3. Generate answer with CV/Portfolio context
      const prompt = `
      Berdasarkan konteks CV dan Portfolio berikut, jawab pertanyaan tentang Hatfan Sahrul Ramadhan dengan jelas dan informatif.

KONTEKS CV & PORTOFOLIO:
${context}

PERTANYAAN: ${question}

JAWABAN (jelaskan berdasarkan data di konteks, berpura-puralah menjadi Hatfan, dan jawab seolah-olah Anda adalah dia, jadi ketika ditanya "Kamu", maka kamu seolah-olah adalah Hatfan):`;

      const answer = await this.geminiClient.generateResponse(prompt);

      return {
        answer,
        sources: relevantDocs.map(doc => doc.id)
      };
    } catch (error) {
      console.error('RAG Pipeline Error:', error);
      return { 
        answer: "Maaf, terjadi kesalahan saat memproses pertanyaan Anda.", 
        sources: [] 
      };
    }
  }
}