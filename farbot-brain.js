/* ==========================================================
   Farbot brain — keyword-matched answers about Farhan Sargath
   (shared by the chat widget and the terminal)
   ========================================================== */
window.FARBOT = (function () {

  const ANSWERS = [
    {
      keys: ['built', 'build', 'project', 'work', 'portfolio', 'made'],
      text: "He builds things people actually use. The highlights:\n\n• Cognify (EngageAI) — real-time classroom engagement analytics with PyTorch computer vision, live WebSocket dashboards, role-based access.\n• Court Summarizer — full-stack NLP platform that turns hours of legal document review into seconds.\n• generalbrassind.com — a live client site for a brass components manufacturer.\n• Schedulify — conflict-free college timetables, generated in minutes.\n• CompareKart — price-trend prediction with Random Forest models.\n• Employee & Payroll Management Systems — C#/.NET + SQL.\n\nType /work or ask about any of them."
    },
    {
      keys: ['cognify', 'engage', 'classroom', 'vision', 'engagement'],
      text: "Cognify (EngageAI) is his flagship. A teacher can't watch every student at once — so this platform turns ordinary webcams into engagement sensors. PyTorch computer vision scores attention in real time (~1s intervals), Socket.io streams it to live teacher dashboards, and anomaly detection flags no-face / multiple-faces / camera-blackout. Full stack: React + Vite frontend, Express + MongoDB backend, FastAPI ML microservice. It also backs his research paper on learning-aware dashboarding."
    },
    {
      keys: ['court', 'legal', 'summariz', 'nlp', 'judgment', 'spacy'],
      text: "Court Summarizer: legal professionals spend hours digging through lengthy judgments for a handful of key facts. His platform uploads a PDF, runs multiple summarization strategies (semantic chunking, token-wise, recursive), and extracts parties, judges, citations and dates — hours of review compressed into seconds. Stack: FastAPI + Transformers for the NLP, Node/Express + MongoDB for auth and records, React frontend. There's an unpublished paper behind it too."
    },
    {
      keys: ['brass', 'client', 'freelance', 'general', 'live site'],
      text: "General Brass Industries (Jamnagar) — his first live client deployment, 2026. Brass manufacturers usually rely on referrals and offline networks; he built and deployed generalbrassind.com so the company can showcase products and reach buyers beyond local markets. Real business, real users."
    },
    {
      keys: ['schedulify', 'timetable', 'schedule'],
      text: "Schedulify — academic coordinators burn countless hours resolving timetable clashes. His generator produces conflict-free timetables in minutes: no overlapping classes, no double-booked faculty or rooms, with full generation history. Python scheduling algorithms + a React/Vite front."
    },
    {
      keys: ['comparekart', 'price', 'shopping', 'compare'],
      text: "CompareKart answers one question for online shoppers: buy now or wait? It analyzes historical pricing patterns with Random Forest models (scikit-learn) and predicts where prices are headed. React.js frontend, Pandas underneath."
    },
    {
      keys: ['payroll', 'employee', 'hr', '.net', 'dotnet', 'c#'],
      text: "Two enterprise builds in C#/.NET + SQL:\n\n• Employee Management System — records, departments, roles and HR workflows from one dashboard.\n• Payroll Management System — automated salary processing, tax calculation and reporting, because payroll errors cost trust, not just time."
    },
    {
      keys: ['achievement', 'hackathon', 'award', 'win', 'finalist', 'sih', 'biggest', 'impact'],
      text: "His trophy shelf so far:\n\n• Smart India Hackathon — Grand Finalist (India's biggest hackathon)\n• Intellify 4.0 — Finalist\n• Project Morpheus 2026 — Finalist\n• Shipped a live client website in 2026\n• 5 Cisco Networking Academy certifications (CCNA ×2, Cybersecurity, Linux Essentials, Packet Tracer)"
    },
    {
      keys: ['skill', 'stack', 'tech', 'language', 'tool', 'know'],
      text: "The stack he actually uses:\n\n• Languages — Python, Java, C, JavaScript, SQL, HTML5/CSS3\n• AI/ML — PyTorch, OpenCV, scikit-learn, spaCy, computer vision, NLP\n• Web — React.js, FastAPI, Flask, Node.js, REST APIs\n• Data — Pandas, NumPy, Power BI, dashboards, KPI analysis\n• DB & tools — MySQL, SQLite, MongoDB, Git/GitHub\n• Networking — Cisco CCNA (×2), Linux Essentials, Cybersecurity"
    },
    {
      keys: ['research', 'paper', 'publication', 'ip'],
      text: "Two papers in the pipeline (not published yet):\n\n1. Classroom Engagement Analytics Using Real-Time Vision Inference and Learning-Aware Dashboarding — the science behind Cognify.\n2. Multi-Strategy Text Preprocessing for Improved Abstractive Summarization of Legal Documents — the science behind Court Summarizer."
    },
    {
      keys: ['education', 'university', 'degree', 'study', 'college', 'marwadi', 'btech'],
      text: "B.Tech in Computer Science Engineering at Marwadi University, Rajkot (2022–2026). But honestly? Most of what he knows was learned shipping projects and surviving hackathon finals."
    },
    {
      keys: ['cert', 'cisco', 'ccna', 'network'],
      text: "Cisco Networking Academy, five certificates in 2025:\n\n• CCNA: Introduction to Networks\n• CCNA: Switching, Routing & Wireless Essentials\n• Introduction to Cybersecurity\n• Linux Essentials\n• Cisco Packet Tracer"
    },
    {
      keys: ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'call'],
      text: "Reaching him is easy:\n\n• Email — fsargath@gmail.com\n• Phone — +91 88496 57513\n• GitHub — github.com/Hyphenat\n• LinkedIn — linkedin.com/in/farhan-sargath\n\nHe replies within ~6 hours. Or use /contact."
    },
    {
      keys: ['hire', 'job', 'intern', 'available', 'open to', 'role', 'position'],
      text: "Good news: he's open to internships, freelance and full-time roles. He's strongest where AI/ML meets full-stack — vision systems, NLP platforms, dashboards, automation. Email fsargath@gmail.com with what you're building and he'll get back within ~6 hours."
    },
    {
      keys: ['who is', 'about', 'farhan', 'himself', 'who'],
      text: "Farhan Sargath — full-stack developer and AI/ML engineer from Rajkot, Gujarat. Smart India Hackathon Grand Finalist. He turns messy real-world problems — distracted classrooms, 200-page judgments, timetable chaos, payroll errors — into software that runs itself. I'm Farbot, the AI he built to keep his archive. Most of what I know, I learned from watching him work."
    },
    {
      keys: ['you', 'farbot', 'robot', 'ai are'],
      text: "I'm Farbot — the resident AI of this site. Farhan built me to translate his work for whoever wanders in. I follow your cursor because I was trained on curiosity."
    },
    {
      keys: ['hi', 'hello', 'hey', 'yo', 'sup'],
      text: "Hey — welcome in. I'm Farbot, Farhan's resident AI. Ask me what he's built, what he's good at, or how to hire him. Or type /work to jump straight to the archive."
    },
    {
      keys: ['project world', 'world', 'idea52', 'game', '52'],
      text: "WORLD52 is the playable part of this site — Farhan's projects, hackathon finals and certifications scattered across a walkable 3D world as glowing beacons. WASD to move, Shift to run, walk into a beacon to unlock it. It's a world, not a test. Head to the WORLD52 tab."
    },
    {
      keys: ['cv', 'resume', 'download'],
      text: "Grab the PDF here: assets/Farhan_Sargath_Resume.pdf — or hit the document icon in the nav for the live resume page."
    }
  ];

  const FALLBACK = "Hmm — that one's outside my archive. Try asking about his projects, skills, achievements, research, education, or how to contact him. Or type /work.";

  function answer(q) {
    const s = q.toLowerCase();
    let best = null, bestScore = 0;
    for (const a of ANSWERS) {
      let score = 0;
      for (const k of a.keys) if (s.includes(k)) score += k.length;
      if (score > bestScore) { bestScore = score; best = a; }
    }
    return best ? best.text : FALLBACK;
  }

  return { answer };
})();
