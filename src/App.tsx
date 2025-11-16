import React, { useEffect, useState } from 'react';
import { Chat } from './components/Chat';
import { RAGPipeline } from './lib/rag';

const App: React.FC = () => {
  const [ragPipeline, setRagPipeline] = useState<RAGPipeline | null>(null);

  useEffect(() => {
    const initializeRAG = async () => {
      const pipeline = new RAGPipeline();

      const cvToon = `#schema=personal_info
                      |name:str|title:str|location:str|phone:str|email:str|linkedin:str|website:str|
                      #data
                      |Hatfan Sahrul Ramadhan|Junior Game Programmer & Computer Vision Engineer|Surabaya, Jawa Timur|+6281216152587|hatfansahrul@gmail.com|linkedin.com/in/hatfansahrul|hatfansahrul1.github.io|

                      #schema=summary
                      |description:str|
                      #data
                      |Game Programmer dan Robotic Programmer dengan keahlian inti di Computer Vision. Berpengalaman dalam membangun algoritma segmentasi warna dan model deteksi objek berbasis CNN YOLO untuk sistem robotika. Familiar dengan NLP dan berbagai pendekatan machine learning. Memiliki kemampuan problem solving yang kuat untuk solusi inovatif dan efisien pada tantangan teknis lintas bidang.|

                      #schema=education
                      |institution:str|degree:str|period:str|achievements:str|
                      #data
                      |PENS Politeknik Elektronika Negeri Surabaya|Sarjana Terapan Teknologi Game|2023-Sekarang|Juara 2 KRI Humanoid Regional 2024;Juara 4 & Technical Challenge KRI Humanoid Nasional 2024;Juara 2 Local Selection Game Solo Techverse Nasional 2025|
                      |SMA Negeri 1 Kendal|MIPA|2020-2023|Juara 1 SMA Awards Technopreneur Provinsi 2021;Juara 2 OSN-K Informatika Kabupaten 2022;Terbaik 1 Procommit V12 ITS;Terbaik 2 Lulusan PRODISTIK ITS 2023|

                      #schema=organization
                      |organization:str|role:str|period:str|responsibilities:str|
                      #data
                      |EEPIS Robot Soccer Team|Computer Vision Engineer|Desember 2023-sekarang|Mendesain algoritma segmentasi warna robust;Mengembangkan model deteksi objek CNN YOLO akurasi 85%;Optimasi model ML kecepatan inferensi 40%;Integrasi Computer Vision dengan ROS untuk navigasi otonom|

                      #schema=skills
                      |category:str|items:str|
                      #data
                      |Programming Languages|C;C++;C#;Python;SQL|
                      |Tools & Software|Unity Game Development;OpenCV;Robot Operating System ROS;Bootstrap;Tailwind|
                      |Technical Skills|Perancangan Kecerdasan Buatan;Computer Vision;Machine Learning;Natural Language Processing NLP;Web Development|
                      |Soft Skills|Problem Solving;Kolaborasi Tim;Komunikasi;Pemikiran Analitis & Logis|`;

      const portoToon = `#schema=portfolio_info
                        |name:str|title:str|website:str|linkedin:str|email:str|github:str|instagram:str|
                        #data
                        |Hatfan Sahrul Ramadhan|Game Programmer|hatfansahrul.netlify.app|linkedin.com/in/hatfansahrul|hatfansahrul@gmail.com|github.com/HatfanSahrull|instagram.com/hatfansahrul|

                        #schema=about
                        |description:str|
                        #data
                        |Game Programmer dengan pengalaman dalam game development lebih dari 3 tahun, computer vision, dan kecerdasan buatan. Aktif mengerjakan proyek lintas bidang seperti robotika berbasis ROS, machine learning, serta game interaktif menggunakan Unity. Terbiasa bekerja dalam tim, memiliki kemampuan problem solving yang kuat, dan berfokus pada solusi inovatif serta efisien di bidang teknologi interaktif.|

                        #schema=projects
                        |year:uint|title:str|achievements:str|links:str|
                        #data
                        |2025|Kala the Dark Ritual|Juara 2 Local Game Selection Surakarta 2025|https://cihuy-games.itch.io/kala-the-dark-ritual|
                        |2025|Selamatkan Babu||https://paduranta.itch.io/selamatkan-babu|
                        |2025|Shutter Spirit||https://growbyte.itch.io/shutter-spirit|
                        |2025|Cloud Farer|TOP 60 Student Best Game Category GAMESEED 2025|https://growbyte.itch.io/cloud-farer|
                        |2024|D Scroll Inspector||https://github.com/HatfanSahrul1/Catch-the-Oligarks|
                        |2025|UpperCup Raylib||https://github.com/HatfanSahrul1/Upper-Cup|
                        |2025|Catch the Oligarks Embedded System||https://github.com/HatfanSahrull/Catch-the-Oligarks|
                        |2023|Si-ABaS Aplikasi Apotek Bank Sampah|Juara 1 EMWEEK 11 2024;Best Presentation BIZMART PPNS 2024;Semifinal Samsung Solve for Tomorrow 2023||
                        |2022|EDUCELLS DUNGEON Game Edukasi Sel|Terbaik 1 Apresisasi 3 Menit Karya Akhir PROCOMMIT ITS 2022||
                        |2021|ARKISAH Buku Cerita Rakyat AR|Juara 1 SMA AWARDS 2021 Kategori Technopreneur||

                        #schema=freelance_projects
                        |title:str|description:str|links:str|
                        #data
                        |Vision-Based Vital Signs Detection YOLOv8|Labelling dataset 1000+ gambar;Training model YOLOv8n;Fine-Tuning akurasi 80%;Membuat algoritma inference;Optimasi model Quantization|https://github.com/sultansyahputray/yolov8-project-HR|
                        |Animasi Simulasi Perlombaan JRC|Membuat animasi simulasi perlombaan robot transporter dan line-follower SD SMP SMA|https://instagram.com/reel/DBaYEU4MxAL/;https://instagram.com/reel/DBaX2c6tgw9/;https://instagram.com/reel/DBaXif_MBIB/|

                        #schema=personal_projects
                        |title:str|description:str|links:str|
                        #data
                        |YoloDoLabel|Tool sederhana memanfaatkan model YOLO kurang robust untuk membantu labeling dataset|https://github.com/HatfanSahrull/YoloDoLabel|
                        |Unity Local Backend Docker|Template REST API sederhana siap pakai untuk Unity local dan docker Typescript ExpressJS|https://github.com/HatfanSahrull/unity-backend-docker-local|

                        #schema=awards
                        |year:uint|title:str|
                        #data
                        |2021|Juara 1 SMA AWARDS Kategori Technopreneur|
                        |2022|Terbaik 1 Apresisasi 3 Menit Karya Akhir Siswa PROCOMMIT ITS|
                        |2024|Juara 2 Kontes Robot Sepak Bola Indonesia Humanoid Wilayah|
                        |2024|Juara Harapan Kontes Robot Sepak Bola Indonesia Humanoid Nasional|
                        |2024|Pemenang Technical Challenge KRI Humanoid|
                        |2024|Desain Terbaik KRI Humanoid|
                        |2025|Juara 2 Local Game Selection Surakarta|
                        |2025|TOP 60 Student Best Game Category GAMESEED 2025|

                        #schema=publications
                        |title:str|link:str|
                        #data
                        |Peningkatan Kesadaran Kebersihan Melalui Game Habertan Pada Siswa Pesantren Muhyiddin Gebang Putih|https://doi.org/10.37339/jurpikat.v5i4.2032|

                        #schema=courses
                        |year:uint|title:str|issuer:str|status:str|
                        #data
                        |2023|Introduction to C++|Sololearn|Completed|
                        |2023|Introduction to SQL|Sololearn|Completed|
                        |2025|Micro Skill: Konsep Pemrograman|Digitalent KOMDIGI|Completed|
                        |2025|VSGA: Fundamental Junior Web Developer|Digitalent KOMDIGI|Completed|
                        |2025|VSGA: Intermediate Junior Web Developer|Digitalent KOMDIGI|Completed|
                        |2025|Data Science: Complete Data Science & Machine Learning|Udemy|On-going|
                        |2025|Robotics & Mechatronics 3: Digital Twin Machines Unity|Udemy|On-going|
                        |2025|Docker & Kubernetes: The Practical Guide|Udemy|On-going|`;
      
      // Gunakan CV dan Porto TOON sebagai documents utama
      const documents = [
        cvToon,
        portoToon,
        "Informasi tambahan: Hatfan Sahrul Ramadhan adalah Game Programmer dan Computer Vision Engineer yang berpengalaman di robotika dan AI.",
        "Keahlian utama: Unity Game Development, Computer Vision, YOLO, ROS, Machine Learning, dan Web Development."
      ];
      
      await pipeline.initializeWithDocuments(documents);
      setRagPipeline(pipeline);
      console.log('RAG system initialized with CV and Portfolio data!');
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
        <p>Menginisialisasi AI Chatbot dengan data CV Hatfan...</p>
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
        <h1>🤖 RAG Chatbot - Hatfan Portfolio</h1>
        <p>Tanya apapun tentang CV, skills, projects, dan pengalaman Hatfan</p>
      </header>
      
      <main style={{ padding: '20px 0' }}>
        <Chat onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default App;