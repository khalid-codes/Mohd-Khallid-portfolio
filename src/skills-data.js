// Verified Technical Skills strictly from Mohd Khalid's Resume
// Focused on Software Developer role, Core CS, and Applied AI Product Engineering

export const SKILLS_DATA = [
  // 1. FRONTEND
  {
    id: 'react-next',
    name: 'React.js & Next.js',
    category: 'frontend',
    level: 'Expert',
    icon: '⚛️',
    tags: ['Next.js 16', 'React 19', 'App Router', 'SSR / SSG'],
    highlight: 'Built commercial web platforms at Khalid Builds. Engineered modular component architectures and sub-second rendering.'
  },
  {
    id: 'tailwind-css',
    name: 'Tailwind CSS & CSS3',
    category: 'frontend',
    level: 'Expert',
    icon: '🎨',
    tags: ['Tailwind CSS', 'Responsive UI', 'CSS Grid', 'Motion'],
    highlight: 'Crafted modern, accessible UIs, cutting page load times by 40% and achieving 90+ Lighthouse performance scores.'
  },
  {
    id: 'typescript-js',
    name: 'TypeScript & JavaScript',
    category: 'frontend',
    level: 'Expert',
    icon: '⚡',
    tags: ['TypeScript (Strict)', 'ESNext', 'DOM APIs', 'Async/Await'],
    highlight: 'Strict type safety across client and server boundaries, eliminating runtime regressions across production ships.'
  },
  {
    id: 'redux-state',
    name: 'Redux & State Management',
    category: 'frontend',
    level: 'Advanced',
    icon: '🔄',
    tags: ['Redux Toolkit', 'Zustand', 'Context API', 'Local Hydration'],
    highlight: 'Architected real-time cart state synchronization and category filtering in e-commerce apps like Kabir Bazaar.'
  },

  // 2. BACKEND & APIS
  {
    id: 'nodejs-express',
    name: 'Node.js & Express.js',
    category: 'backend',
    level: 'Expert',
    icon: '🟢',
    tags: ['Node.js', 'Express.js', 'RESTful APIs', 'Middleware'],
    highlight: 'Engineered high-throughput backend services, asynchronous worker pipelines, and secure authentication flows.'
  },
  {
    id: 'python-flask',
    name: 'Python, Flask & Fastify',
    category: 'backend',
    level: 'Advanced',
    icon: '🐍',
    tags: ['Python 3', 'Flask', 'Fastify', 'REST APIs'],
    highlight: 'Developed AI computer vision microservices (CleanVid) and high-speed data extraction endpoints in Python.'
  },
  {
    id: 'rest-architecture',
    name: 'RESTful API Engineering',
    category: 'backend',
    level: 'Expert',
    icon: '📡',
    tags: ['RESTful Contracts', 'DTO Validation', 'Zod', 'Postman'],
    highlight: 'Designed normalized RESTful endpoints connecting client applications with microservices and third-party gateways.'
  },

  // 3. DATABASES
  {
    id: 'postgresql-mysql',
    name: 'PostgreSQL & MySQL',
    category: 'databases',
    level: 'Expert',
    icon: '🐘',
    tags: ['PostgreSQL', 'MySQL', 'Prisma ORM', 'Indexing'],
    highlight: 'Engineered normalized relational schemas, foreign key relationships, and query indexing for low-latency lookups.'
  },
  {
    id: 'supabase-db',
    name: 'Supabase',
    category: 'databases',
    level: 'Advanced',
    icon: '⚡',
    tags: ['Postgres BaaS', 'Row-Level Security', 'Storage', 'Realtime'],
    highlight: 'Integrated Supabase PostgreSQL with automated migrations and secure row-level security in client platforms like Gharwaala.'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'databases',
    level: 'Advanced',
    icon: '🍃',
    tags: ['MongoDB', 'Mongoose', 'Document Aggregation', 'JSON'],
    highlight: 'Designed flexible NoSQL document schemas for dynamic catalog caching and session persistence.'
  },

  // 4. CLOUD & DEVOPS
  {
    id: 'docker-linux',
    name: 'Docker & Linux',
    category: 'cloud',
    level: 'Advanced',
    icon: '🐳',
    tags: ['Docker', 'Linux CLI', 'Containerization', 'Gunicorn'],
    highlight: 'Containerized AI restoration engines and Node.js microservices into isolated Docker containers for reproducible deploys.'
  },
  {
    id: 'vercel-cloudflare',
    name: 'Vercel & Cloudflare',
    category: 'cloud',
    level: 'Expert',
    icon: '☁️',
    tags: ['Cloudflare Edge', 'Vercel CDN', 'DNS', 'WAF Security'],
    highlight: 'Enforced edge network caching and DDoS protection, ensuring 99.9% SLA uptime and global sub-second delivery.'
  },
  {
    id: 'git-tools',
    name: 'Git, GitHub & Postman',
    category: 'cloud',
    level: 'Expert',
    icon: '🐙',
    tags: ['Git Workflows', 'CI/CD Builds', 'Postman Testing', 'SLA'],
    highlight: 'Disciplined version control across all projects with automated lint checks and comprehensive API test suites.'
  },

  // 5. APPLIED AI & PRODUCT ENGINEERING
  {
    id: 'generative-ai',
    name: 'Generative AI & Prompt Engineering',
    category: 'ai',
    level: 'Certified',
    icon: '🤖',
    tags: ['Certified GenAI', 'Prompt Engineering', 'LLM Workflows', 'Automation'],
    highlight: 'Formally certified in Generative AI and Prompt Engineering Basics. Built production products leveraging modern AI.'
  },
  {
    id: 'cv-inpainting',
    name: 'Computer Vision AI & Inpainting',
    category: 'ai',
    level: 'Advanced',
    icon: '👁️',
    tags: ['OpenCV', 'Telea / Navier-Stokes', 'NumPy', 'Canvas Inpainting'],
    highlight: 'Engineered CleanVid: an AI media restoration platform utilizing OpenCV computer vision inpainting to remove watermarks.'
  },
  {
    id: 'ffmpeg-media',
    name: 'FFmpeg Media Pipeline',
    category: 'ai',
    level: 'Advanced',
    icon: '🎬',
    tags: ['FFmpeg Core', 'Video Transcoding', 'Audio Slicing', 'Streams'],
    highlight: 'Architected async video transcoding and extraction pipelines in FluxRip.online and CleanVid without disk thrashing.'
  },

  // 6. CORE CS FUNDAMENTALS
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    category: 'fundamentals',
    level: 'Expert',
    icon: '🧠',
    tags: ['DSA', 'Arrays & Trees', 'Graphs', 'Time Complexity'],
    highlight: 'B.E. Computer Science degree foundations applied daily to optimize rendering loops and search complexity.'
  },
  {
    id: 'oop-dbms',
    name: 'OOP, DBMS & SDLC',
    category: 'fundamentals',
    level: 'Expert',
    icon: '📐',
    tags: ['OOP Principles', 'DBMS Rigor', 'ACID Rules', 'Clean Code'],
    highlight: 'Adheres to strict separation of concerns, DRY patterns, and normalized schema design across every project.'
  },
  {
    id: 'os-networks',
    name: 'Operating Systems & Networks',
    category: 'fundamentals',
    level: 'Advanced',
    icon: '💻',
    tags: ['TCP/IP', 'HTTP/3', 'Concurrency', 'Process Lifecycle'],
    highlight: 'Deep understanding of network request lifecycles, browser caching protocols, and system threading.'
  }
];
