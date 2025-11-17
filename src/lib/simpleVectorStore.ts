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
    // Enhanced search untuk TOON chunks dengan semantic keywords
    const queryWords = query.toLowerCase().split(/\s+/);
    
    // Define schema-specific keywords untuk better matching
    const schemaKeywords = {
      'personal_info': ['nama', 'kontak', 'email', 'phone', 'lokasi', 'website', 'linkedin'],
      'summary': ['deskripsi', 'pengalaman', 'keahlian', 'background', 'profil', 'dirimu'],
      'education': ['pendidikan', 'sekolah', 'kuliah', 'universitas', 'kampus', 'jurusan'],
      'organization': ['kerja', 'organisasi', 'tim', 'perusahaan', 'pengalaman'],
      'skills': ['skill', 'keahlian', 'programming', 'bahasa', 'tools', 'teknologi'],
      'projects': ['proyek', 'project', 'game', 'aplikasi', 'development'],
      'freelance_projects': ['freelance', 'klien', 'kontrak'],
      'personal_projects': ['personal', 'pribadi', 'side project'],
      'awards': ['award', 'juara', 'prestasi', 'penghargaan', 'kompetisi'],
      'publications': ['publikasi', 'paper', 'jurnal', 'penelitian'],
      'courses': ['kursus', 'sertifikat', 'training', 'belajar', 'pelatihan']
    };
    
    const scoredDocs = this.documents.map(doc => {
      const content = doc.content.toLowerCase();
      let score = 0;
      
      // Basic keyword matching
      queryWords.forEach(word => {
        if (content.includes(word)) {
          score += 1;
        }
        // Partial matching untuk kata yang mirip
        if (word.length > 3) {
          const regex = new RegExp(word.substring(0, word.length - 1), 'i');
          if (regex.test(content)) {
            score += 0.5;
          }
        }
      });
      
      // Schema-based boosting - prioritas berdasarkan jenis pertanyaan
      Object.entries(schemaKeywords).forEach(([schema, keywords]) => {
        if (content.includes(`#schema=${schema}`)) {
          keywords.forEach(keyword => {
            queryWords.forEach(queryWord => {
              if (queryWord.includes(keyword) || keyword.includes(queryWord)) {
                score += 2; // Boost untuk schema yang relevan
              }
            });
          });
        }
      });
      
      // Extra boost for exact TOON field matches
      if (content.includes('#schema=') && content.includes('#data')) {
        queryWords.forEach(word => {
          // Match field names dalam TOON structure
          if (['name', 'title', 'skills', 'projects', 'awards'].includes(word)) {
            score += 1.5;
          }
        });
      }
      
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