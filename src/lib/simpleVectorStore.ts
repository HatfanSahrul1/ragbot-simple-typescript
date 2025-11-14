interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

export class SimpleVectorStore {
  private documents: Document[] = [];

  async addDocuments(docs: { content: string; metadata?: Record<string, any> }[]) {
    for (const doc of docs) {
      const document: Document = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: doc.content,
        metadata: doc.metadata || {}
      };
      this.documents.push(document);
    }
    console.log(`Added ${docs.length} documents to store`);
  }

  async search(query: string, k: number = 3): Promise<Document[]> {
    // Simple keyword-based search untuk demo
    const queryWords = query.toLowerCase().split(/\s+/);
    
    const scoredDocs = this.documents.map(doc => {
      const content = doc.content.toLowerCase();
      let score = 0;
      
      queryWords.forEach(word => {
        if (content.includes(word)) {
          score += 1;
        }
      });
      
      return { doc, score };
    });

    return scoredDocs
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(item => item.doc);
  }

  getDocumentCount(): number {
    return this.documents.length;
  }
}