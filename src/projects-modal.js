export const PROJECT_DETAILS = {
  kabir_bazaar: {
    title: 'Kabir Bazaar &bull; FMCG Retail E-Commerce Platform',
    subtitle: 'Production Online Store with Next.js 16, Prisma, PostgreSQL, MeiliSearch &amp; Redis',
    challenge: 'Architecting a high-speed, mobile-first FMCG retail storefront for a supermarket chain in Ludhiana capable of handling dynamic grocery catalogs, sub-second category filtering across 100+ SKUs, and persistent real-time cart state with instant checkout.',
    solution: 'Engineered with Next.js 16 App Router and React 19, utilizing Prisma ORM with PostgreSQL. Integrated MeiliSearch for zero-latency (< 40ms) catalog search and ioredis for caching. Implemented Zustand for conflict-free local cart hydration, Razorpay payment processing, and AWS S3 presigned asset uploads.',
    metrics: [
      { label: 'Search Latency', value: '< 40ms MeiliSearch' },
      { label: 'Catalog Capacity', value: '100+ Live SKUs' },
      { label: 'Lighthouse Score', value: '94+ Performance' },
      { label: 'State Sync', value: '100% Conflict-Free' }
    ],
    architectureHighlights: [
      '<strong>Instant Search &amp; Indexing:</strong> Integrated MeiliSearch engine with typo-tolerance and faceted category filtering across spices, grains, and essentials.',
      '<strong>Redis Caching Layer:</strong> Leveraged ioredis for API query caching and checkout endpoint rate-limiting, preventing server exhaustion.',
      '<strong>Lightweight Client State:</strong> Implemented Zustand for zero-overhead cart state management with automatic localStorage hydration and optimistic UI updates.',
      '<strong>Type-Safe Data Access:</strong> Normalized PostgreSQL relational schemas using Prisma ORM with foreign key cascades and indexed category slugs.',
      '<strong>Commercial Integrations:</strong> Seamless Razorpay payment gateway integration, NextAuth (Auth.js) credential sessions, and automated order notifications via WhatsApp.'
    ],
    techStack: ['Next.js 16', 'React 19', 'Prisma 5', 'PostgreSQL', 'MeiliSearch', 'Redis', 'Razorpay', 'AWS S3', 'Tailwind CSS']
  },

  fluxrip: {
    title: 'FluxRip.online &bull; High-Throughput Media Downloader &amp; Transcoder',
    subtitle: 'Async Media Extraction Pipeline with Python &amp; Native FFmpeg CLI Workers',
    challenge: 'Engineering a resilient media extraction and conversion utility capable of fetching multi-gigabyte video streams from social platforms and transcoding them on-the-fly into multiple formats (1080p, 4K, 320kbps MP3) without CPU spikes or memory leaks.',
    solution: 'Developed a decoupled full-stack platform using React.js and Node.js with Express. Integrated an asynchronous worker pipeline utilizing native FFmpeg CLI processes to transcode streams in background memory buffers. Deployed behind Cloudflare for DDoS protection and global edge caching.',
    metrics: [
      { label: 'Transcode Engine', value: 'FFmpeg Core CLI' },
      { label: 'Avg Extraction', value: '< 3.2s Sub-Second' },
      { label: 'CDN Acceleration', value: 'Cloudflare Edge' },
      { label: 'User Flow', value: '0 Intrusive Ads' }
    ],
    architectureHighlights: [
      '<strong>Asynchronous Stream Pipeline:</strong> Node.js and Python worker processes transcoding live video and audio buffers without blocking the main event loop.',
      '<strong>Resource Management:</strong> Worker throttling queues that prevent disk thrashing and memory exhaustion during concurrent download spikes.',
      '<strong>Cloudflare Edge Optimization:</strong> Protected with Cloudflare WAF, edge SSL termination, and aggressive asset caching reducing origin bandwidth by 65%.',
      '<strong>Cross-Browser Compatibility:</strong> Verified video decoding and audio extraction playback across mobile Safari, Chrome, Edge, and Firefox.'
    ],
    techStack: ['Next.js', 'React.js', 'Node.js', 'Express.js', 'Python', 'FFmpeg', 'Cloudflare Edge']
  },

  cleanvid: {
    title: 'CleanVid &bull; AI Watermark Remover &amp; Canvas Editor',
    subtitle: 'AI Computer Vision Media Restoration with HTML5 Canvas &amp; OpenCV Inpainting',
    challenge: 'Creating an intuitive in-browser editing tool allowing users to pinpoint and brush-mask watermarks on images and video frames, then executing computationally intensive computer vision inpainting algorithms with real-time feedback and zero privacy leakage.',
    solution: 'Engineered a full-stack AI media restoration suite. The client features an interactive HTML5 Canvas brush editor operating at butter-smooth 60 FPS with Bezier smoothing. The backend is a containerized Python Flask microservice utilizing OpenCV Telea and Navier-Stokes inpainting algorithms, deployed via Docker and Gunicorn.',
    metrics: [
      { label: 'Canvas Frame Rate', value: '60 FPS Smooth' },
      { label: 'AI Inpainting Model', value: 'OpenCV Telea / NS' },
      { label: 'Privacy Standard', value: '100% In-Memory' },
      { label: 'Containerization', value: 'Docker & Gunicorn' }
    ],
    architectureHighlights: [
      '<strong>60 FPS In-Browser Canvas Masking:</strong> High-performance HTML5 Canvas with sub-pixel Bezier curve smoothing, dynamic brush radius controls, and undo/redo state stacks.',
      '<strong>Computer Vision Inpainting Algorithms:</strong> Python service powered by OpenCV Telea and Navier-Stokes mathematical partial differential equations that reconstruct masked background pixels.',
      '<strong>Containerized Production Microservice:</strong> Packaged in a lightweight Docker image running Gunicorn with Flask-Limiter rate control to handle concurrent restoration requests.',
      '<strong>Interactive Before/After Slider:</strong> Custom comparison slider allowing users to scrub between original and watermark-removed previews in real time.'
    ],
    techStack: ['Next.js', 'HTML5 Canvas API', 'Python', 'OpenCV', 'Flask', 'Docker', 'Gunicorn', 'NumPy']
  },

  gharwaala: {
    title: 'Gharwaala &bull; Modular Kitchen Architectural Platform',
    subtitle: 'High-Performance Commercial Platform with Supabase PostgreSQL &amp; Automated WebP Pipeline',
    challenge: 'Delivering rich, high-resolution interior architectural photography and dynamic price estimation for a modular kitchen brand in Delhi NCR without compromising Core Web Vitals or mobile speed.',
    solution: 'Built with Vite, React.js, and Supabase PostgreSQL with strict Row Level Security. Implemented an automated WebP image optimization pipeline and edge caching, cutting average page load times by 40% and achieving a 96+ Lighthouse performance score.',
    metrics: [
      { label: 'Lighthouse Score', value: '96+ Performance' },
      { label: 'Load Time Cut', value: '40% WebP Pipeline' },
      { label: 'Database', value: 'Supabase PostgreSQL' },
      { label: 'Lead Funnel', value: 'Dynamic Estimator' }
    ],
    architectureHighlights: [
      '<strong>Dynamic Cost Calculator:</strong> Interactive client estimator calculating real-time modular kitchen quotes based on dimensions, materials, and IS:710 Marine Ply specs.',
      '<strong>Automated WebP Asset Pipeline:</strong> Responsive srcset picture tags delivering WebP image variants tailored to screen resolution, eliminating bandwidth waste.',
      '<strong>Supabase PostgreSQL Integration:</strong> Secure database queries utilizing Row Level Security (RLS) policies for lead submissions and catalog management.',
      '<strong>Zero Layout Shift:</strong> Strict aspect-ratio containers and image placeholders preventing Cumulative Layout Shift (CLS) on mobile devices.'
    ],
    techStack: ['Vite', 'React.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'WebP Pipeline']
  },

  will_tech: {
    title: 'Will Tech &bull; Enterprise Cloud &amp; Software Solutions Platform',
    subtitle: 'Enterprise IT Consultancy Portal Engineered with Strict TypeScript &amp; 99.9% Uptime',
    challenge: 'Providing corporate enterprise clients with transparent project milestones, real-time infrastructure performance telemetry, and automated service health probes in a clean dashboard interface.',
    solution: 'Architected with Next.js, Node.js, and strict TypeScript typing (100% type coverage, zero `any` types). Integrated automated health check endpoints and an interactive project visualization matrix that models delivery velocity.',
    metrics: [
      { label: 'TypeScript Typing', value: '100% Strict Types' },
      { label: 'Monitored Uptime', value: '99.9% SLA' },
      { label: 'Health Probes', value: 'Automated Status' },
      { label: 'Design System', value: 'Enterprise UI' }
    ],
    architectureHighlights: [
      '<strong>Strict Type Safety:</strong> Comprehensive TypeScript interface contracts spanning client and server, preventing data mutation errors.',
      '<strong>Interactive Project Visualizer:</strong> Dynamic milestone tracker modeling project deliverables, sprint velocity, and SLA commitments.',
      '<strong>Automated Service Health Probes:</strong> Lightweight Node.js ping endpoints verifying cloud service availability and response latency.',
      '<strong>Enterprise Security Standards:</strong> Strict Content Security Policy (CSP), sanitized input validation, and optimized production bundle splits.'
    ],
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'RESTful APIs', 'Vercel Edge']
  }
};

export class ProjectModalManager {
  constructor() {
    this.modal = document.getElementById('project-modal');
    this.titleEl = document.getElementById('project-modal-title');
    this.subtitleEl = document.getElementById('project-modal-subtitle');
    this.bodyEl = document.getElementById('project-modal-body');
    this.closeBtn = document.getElementById('btn-close-project-modal');

    this.setupEvents();
  }

  setupEvents() {
    document.querySelectorAll('.btn-open-deepdive, .btn-case-deepdive, .btn-project-deepdive').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projId = btn.getAttribute('data-project-id');
        this.openProject(projId);
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  openProject(projId) {
    const data = PROJECT_DETAILS[projId];
    if (!data || !this.modal) return;

    this.titleEl.innerHTML = data.title;
    this.subtitleEl.innerHTML = data.subtitle;

    this.bodyEl.innerHTML = `
      <div class="modal-deepdive-editorial">
        <div class="modal-spec-block">
          <h4 class="modal-spec-heading">Engineering Challenge</h4>
          <p class="modal-spec-content">${data.challenge}</p>
        </div>

        <div class="modal-spec-block">
          <h4 class="modal-spec-heading">Architectural Solution</h4>
          <p class="modal-spec-content">${data.solution}</p>
        </div>

        <div class="modal-metrics-strip">
          ${data.metrics.map(m => `
            <div class="modal-metric-cell">
              <span class="val">${m.value}</span>
              <span class="lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>

        <div class="modal-spec-block">
          <h4 class="modal-spec-heading">Key Technical Decisions &amp; Real Codebase Implementation</h4>
          <ul class="modal-highlights-list">
            ${data.architectureHighlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>

        <div class="modal-spec-block" style="margin-bottom:0;">
          <h4 class="modal-spec-heading">Verified Tech Stack</h4>
          <div class="project-tags-row" style="margin-top:10px;">
            ${data.techStack.map(t => `<span class="project-tech-chip">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }
}
