import './style.css';
import confetti from 'canvas-confetti';
import { initLiveGuide, updateLiveGuideStage, guideSpeakDirect, guideLookAt, guideSetOffset, guideSetSide } from './guide.js';
import {
  isSoundEnabled,
  setSoundEnabled,
  playStageWhoosh,
  playMilestoneSound,
  playBubblePop,
  playClickSound,
  playModalOpenSound,
  playModalCloseSound,
  playTrickSound,
  playSuccessSound,
  playHoverTick,
  playSwissChime
} from './sound.js';

// Toast Notification Manager
export function showToast(message, duration = 3200) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="width:7px;height:7px;border-radius:50%;background:#2261e9;box-shadow:0 0 8px #2261e9;display:inline-block;"></span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

window.showToast = showToast;

// Sound engine is imported from ./sound.js (playStageWhoosh, playMilestoneSound, playClickSound, etc.)
export { playSwissChime };

// Hero Dynamic Typographic Word Rotator
function initHeroWordCycle() {
  const wordEl = document.getElementById('hero-dynamic-word');
  if (!wordEl) return;

  const words = [
    { text: 'think.', color: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)' }, // Electric Violet (AI & Logic)
    { text: 'move.', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)' },   // Radiant Cyan (Kinetic Web)
    { text: 'scale.', color: '#34d399', glow: 'rgba(52, 211, 153, 0.45)' },  // Emerald Mint (Infrastructure)
    { text: 'ship.', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)' }    // Rocket Amber (Commercial Production)
  ];
  let idx = 0;

  // Set initial word styling
  wordEl.textContent = words[0].text;
  wordEl.style.color = words[0].color;
  wordEl.style.textShadow = `0 0 35px ${words[0].glow}`;

  setInterval(() => {
    idx = (idx + 1) % words.length;
    wordEl.style.opacity = '0';
    wordEl.style.transform = 'translateY(10px)';
    wordEl.style.transition = 'opacity 0.28s ease, transform 0.28s ease, color 0.4s ease, text-shadow 0.4s ease';

    setTimeout(() => {
      wordEl.textContent = words[idx].text;
      wordEl.style.color = words[idx].color;
      wordEl.style.textShadow = `0 0 35px ${words[idx].glow}`;
      wordEl.style.opacity = '1';
      wordEl.style.transform = 'translateY(0)';
    }, 280);
  }, 3200);
}

// Project Details Data (Sourced directly from live production codebases & git remotes)
const PROJECTS_DATA = {
  cleanvid: {
    title: 'CleanVid',
    subtitle: 'AI Video Watermark Remover &bull; OpenCV &bull; Next.js 15',
    badge: 'Production AI SaaS &bull; 60 FPS HTML5 Canvas',
    description: 'Production AI-driven video watermark inpainting platform. Combines an ultra-responsive 60 FPS HTML5 Canvas keyframe mask brush with an asynchronous Python 3.14 (FastAPI, Gunicorn, OpenCV Telea & Navier-Stokes) computer vision inpainting worker pipeline and Cloudflare R2 object storage.',
    challenge: 'Video watermark inpainting requires temporal frame consistency without flickering, while handling heavy video frame extraction without lagging the client browser.',
    solution: 'Engineered in-browser mask keyframing on HTML5 Canvas, streaming serial coordinate paths to a containerized OpenCV worker pool that inpaints video frames asynchronously.',
    metrics: [
      { label: 'Brush Velocity', val: '60 FPS' },
      { label: 'Temporal Consistency', val: '100% Inpaint' },
      { label: 'Cloud Storage', val: 'Cloudflare R2' }
    ],
    tech: ['Next.js 15', 'React 19', 'HTML5 Canvas', 'Python 3.14', 'FastAPI', 'OpenCV (Inpaint)', 'Cloudflare R2', 'Docker'],
    liveUrl: 'https://cleanvid.site',
    github: 'https://github.com/khalidbuilds4u/clearvid'
  },
  kabir_bazaar: {
    title: 'Kabir Bazaar',
    subtitle: 'FMCG Supermarket E-Commerce Storefront &bull; Production Platform',
    badge: 'Next.js 15 &bull; PostgreSQL on VPS &bull; 30-Day Referral Engine',
    description: 'Live production e-commerce supermarket platform serving thousands of FMCG grocery items. Engineered with Next.js 15 App Router, React 19, a dedicated PostgreSQL instance on a self-hosted Linux VPS (187.126.112.56), NextAuth v5 + Google OAuth, Resend Email API, and a 30-day cookie referral attribution mechanism (kb_referral).',
    challenge: 'Massive grocery inventory search causes database query bloat, slow mobile catalog rendering, and lost affiliate attribution across multiple login flows.',
    solution: 'Implemented sub-40ms instant catalog search, client-side Zustand cart synchronization, and an HttpOnly 30-day persistent cookie engine preserving referral credit across Google OAuth sign-ins.',
    metrics: [
      { label: 'Search Latency', val: '< 40ms' },
      { label: 'Live Database', val: 'PostgreSQL VPS' },
      { label: 'Affiliate Cookie', val: '30-Day Attr' }
    ],
    tech: ['Next.js 15', 'React 19', 'PostgreSQL', 'NextAuth v5', 'Resend API', 'Zustand', 'TailwindCSS', 'Linux VPS'],
    liveUrl: 'https://kabirbazaar.site',
    github: 'https://github.com/kabirbazaarofficial/KabirBazaar'
  },
  fluxrip: {
    title: 'FluxRip',
    subtitle: 'High-Throughput 4K/1080p Media Extraction & Transcoding Pipeline',
    badge: 'Cloudflare Durable Objects &bull; FFmpeg 7 &bull; Zero Watermark',
    description: 'High-performance media extraction and transcoding platform for YouTube and Instagram links. Features React + Vite frontend, Node.js + Express backend containerized on Cloudflare Workers and Durable Objects (wrangler.jsonc), powered by @distube/ytdl-core, instagram-url-direct, and FFmpeg 7 pipelines for instant MP4 video and 320kbps MP3 audio conversion.',
    challenge: 'Handling simultaneous video download streams, rate limits, and format conversions without running out of server memory or crashing connections.',
    solution: 'Architected an asynchronous worker container pipeline isolating client requests from background FFmpeg child processes, streaming download progress seamlessly with zero watermarks and no required signup.',
    metrics: [
      { label: 'Quality', val: '4K / 1080p MP4' },
      { label: 'Audio Bitrate', val: '320 kbps MP3' },
      { label: 'Architecture', val: 'Cloudflare Containers' }
    ],
    tech: ['React', 'Vite', 'Node.js', 'Express', 'FFmpeg 7', 'Cloudflare Workers', 'Durable Objects', 'ytdl-core'],
    liveUrl: 'https://fluxrip.online',
    github: 'https://github.com/khalidbuilds4u/fluxrip'
  },
  gharwaala: {
    title: 'Gharwaala',
    subtitle: 'Architectural Modular Kitchen & Interior Platform',
    badge: 'Production Platform &bull; Supabase PostgreSQL &bull; GEO Optimized',
    description: 'Bespoke residential modular interior and kitchen planning platform. Built with Vite, React/Vanilla JS, and Supabase PostgreSQL (tfklsfyqrwpnewiieyxe.supabase.co). Features interactive modular kitchen cost calculators, Web3Forms instant quote notifications, an automated Python WebP optimization pipeline, and Generative Engine Optimization (GEO) indexable by OAI-SearchBot and ChatGPT.',
    challenge: 'High-resolution architectural photography causes massive mobile page load times and hurts SEO ranking across competitive Delhi NCR searches.',
    solution: 'Built an automated Python WebP image optimization pipeline and responsive srcsets alongside semantic city-level landing pages, yielding a 96+ Lighthouse score and instant sub-50ms database response.',
    metrics: [
      { label: 'Lighthouse Score', val: '96/100' },
      { label: 'Image Compression', val: '-65% WebP' },
      { label: 'Live Database', val: 'Supabase Cloud' }
    ],
    tech: ['Vite', 'React', 'Supabase PostgreSQL', 'Web3Forms API', 'Python Image Engine', 'TailwindCSS', 'GEO'],
    liveUrl: 'https://gharwaala.com',
    github: 'https://github.com/gharwaalahere/gharwaala'
  },
  khalidbuilds: {
    title: 'KhalidBuilds Studio',
    subtitle: 'Custom Web Development & Digital Product Engineering Agency',
    badge: 'Founder Studio &bull; Next.js 15 &bull; Vercel Edge',
    description: 'The official studio agency founded by Mohd Khalid. Delivers bespoke commercial web platforms, sub-second search engines, custom SaaS architectures, and high-performance client projects. Features Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS, and edge deployment.',
    challenge: 'Establishing a trustworthy, high-performance agency portal capable of demonstrating real technical depth, transparent legal terms, and client case studies.',
    solution: 'Constructed a modern dark-mode Swiss digital agency storefront with structured JSON-LD schemas, Google Publisher integration, client consultation flows, and portfolio showcase.',
    metrics: [
      { label: 'Platforms Shipped', val: '5+ Commercial' },
      { label: 'Uptime SLA', val: '99.9%' },
      { label: 'Framework', val: 'Next.js 15 Edge' }
    ],
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vercel Edge', 'JSON-LD Schema'],
    liveUrl: 'https://khalidbuilds.online',
    github: 'https://github.com/khalidbuilds4u/khalidbuilds'
  },
  will_tech: {
    title: 'KhalidBuilds Studio / WillTech',
    subtitle: 'Enterprise Cloud System &bull; Strict TypeScript Architecture',
    badge: 'Next.js 15 &bull; TypeScript &bull; Node.js &bull; 99.9% Uptime',
    description: 'Enterprise internal tooling and cloud infrastructure engineering case study deployed by KhalidBuilds Studio. Engineered with strict TypeScript, Node.js health probes, and granular role-based access control.',
    challenge: 'Enterprise workflows require zero type ambiguity and strict real-time telemetry.',
    solution: 'Implemented end-to-end type validation, automated health probe workers, and sub-100ms API response contracts.',
    metrics: [
      { label: 'Uptime SLA', val: '99.9%' },
      { label: 'Type Coverage', val: '100% Strict' },
      { label: 'Studio Base', val: 'KhalidBuilds' }
    ],
    tech: ['Next.js 15', 'Strict TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'JWT RBAC'],
    liveUrl: 'https://khalidbuilds.online',
    github: 'https://github.com/khalidbuilds4u/khalidbuilds'
  }
};

// Project Modal Controller
function openProjectModal(projectId) {
  const data = PROJECTS_DATA[projectId];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const kicker = document.getElementById('project-modal-kicker');
  const title = document.getElementById('project-modal-title');
  const subtitle = document.getElementById('project-modal-subtitle');
  const body = document.getElementById('project-modal-body');
  const footer = document.getElementById('project-modal-footer');

  if (!modal || !title || !body) return;

  kicker.textContent = 'Engineering Case Study';
  title.textContent = data.title;
  subtitle.innerHTML = data.subtitle;

  body.innerHTML = `
    <div class="dossier-section">
      <span class="project-tag-pill pill-dark" style="margin-bottom:12px;display:inline-block;">${data.badge}</span>
      <p class="dossier-para">${data.description}</p>
    </div>

    <div class="dossier-section">
      <h4 class="dossier-heading">Key Engineering Challenge &amp; Solution</h4>
      <div style="background:var(--color-stone);padding:14px;border-radius:var(--radius-sm);margin-bottom:10px;">
        <strong style="font-size:12px;color:var(--stage-blue);text-transform:uppercase;letter-spacing:0.04em;">Challenge</strong>
        <p style="font-size:13.5px;color:#3f3f46;margin-top:4px;">${data.challenge}</p>
      </div>
      <div style="background:var(--color-stone);padding:14px;border-radius:var(--radius-sm);">
        <strong style="font-size:12px;color:#059669;text-transform:uppercase;letter-spacing:0.04em;">Solution</strong>
        <p style="font-size:13.5px;color:#3f3f46;margin-top:4px;">${data.solution}</p>
      </div>
    </div>

    <div class="dossier-section">
      <h4 class="dossier-heading">Verified Metrics</h4>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        ${data.metrics.map(m => `
          <div style="background:#ffffff;border:1px solid rgba(11,11,12,0.08);padding:10px;border-radius:8px;text-align:center;">
            <div style="font-family:var(--font-display);font-size:16px;font-weight:700;">${m.val}</div>
            <div style="font-family:var(--font-mono);font-size:10px;color:var(--color-muted);text-transform:uppercase;margin-top:2px;">${m.label}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="dossier-section">
      <h4 class="dossier-heading">Technology Stack</h4>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${data.tech.map(t => `<span style="font-family:var(--font-mono);font-size:11.5px;background:var(--color-stone);padding:4px 10px;border-radius:4px;">${t}</span>`).join('')}
      </div>
    </div>
  `;

  footer.innerHTML = `
    ${data.liveUrl ? `
      <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="pill-btn pill-btn-live">
        <span class="live-beacon-dot"></span>
        <span>Visit Live Website ↗</span>
      </a>
    ` : ''}
    <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="pill-btn pill-btn-ink">
      <span>View GitHub Repo ↗</span>
    </a>
    <button class="pill-btn pill-btn-stone" onclick="document.getElementById('project-modal').classList.remove('modal-active'); if(window.playModalCloseSound) window.playModalCloseSound();">
      <span>Close</span>
    </button>
  `;

  modal.classList.add('modal-active');
  playModalOpenSound();
}

// Initialize Interactive Events
document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize Persistent Live Guide Companion
  initLiveGuide(0);

  // 1. Hero Dynamic Word Cycling
  initHeroWordCycle();

  // 2. Sound Toggle Button
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIconSvg = document.getElementById('sound-icon-svg');

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', () => {
      const enabled = setSoundEnabled(!isSoundEnabled());
      if (enabled) {
        playSuccessSound();
        soundIconSvg.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
        showToast('🔊 Sound enabled');
      } else {
        soundIconSvg.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        `;
        showToast('🔇 Sound muted');
      }
    });
  }

  // 3. Resume Modal Open / Close
  const resumeModal = document.getElementById('resume-modal');
  const btnNavResume = document.getElementById('btn-nav-resume');
  const btnFooterResume = document.getElementById('btn-footer-resume');
  const btnCloseResume = document.getElementById('btn-close-resume');
  const btnCloseResumeFooter = document.getElementById('btn-close-resume-footer');
  const resumeBackdrop = document.getElementById('resume-backdrop');

  const btnSkillsResume = document.getElementById('btn-skills-resume');
  const btnEduResume = document.getElementById('btn-edu-resume');
  const btnContactResume = document.getElementById('btn-contact-resume');

  const openResume = () => {
    resumeModal.classList.add('modal-active');
    playModalOpenSound();
  };

  const closeResume = () => {
    resumeModal.classList.remove('modal-active');
    playModalCloseSound();
  };

  if (btnNavResume) btnNavResume.addEventListener('click', openResume);
  if (btnFooterResume) btnFooterResume.addEventListener('click', openResume);
  if (btnSkillsResume) btnSkillsResume.addEventListener('click', openResume);
  if (btnEduResume) btnEduResume.addEventListener('click', openResume);
  if (btnContactResume) btnContactResume.addEventListener('click', openResume);
  if (btnCloseResume) btnCloseResume.addEventListener('click', closeResume);
  if (btnCloseResumeFooter) btnCloseResumeFooter.addEventListener('click', closeResume);
  if (resumeBackdrop) resumeBackdrop.addEventListener('click', closeResume);

  // Interactive AI & Tech Skill Pills
  document.querySelectorAll('.ai-pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => playHoverTick());
    pill.addEventListener('click', () => {
      const name = pill.textContent.trim();
      playClickSound();
      showToast(`🤖 ${name} &bull; Applied AI Stack`);
    });
  });

  document.querySelectorAll('.ai-cred-item').forEach(item => {
    item.addEventListener('mouseenter', () => playHoverTick());
    item.addEventListener('click', () => {
      const text = item.querySelector('strong')?.textContent.trim() || 'Verified';
      playClickSound();
      showToast(`🎓 ${text}`);
    });
  });

  // Interactive Panoramic Horizon Cards (College & School)
  const horizonCards = document.querySelectorAll('.horizon-card');
  const horizonNodes = document.querySelectorAll('.horizon-node');

  horizonCards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => {
      playHoverTick();
      horizonNodes.forEach((node, nIdx) => {
        if (nIdx === idx) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    });

    card.addEventListener('click', () => {
      const type = card.getAttribute('data-edu');
      playClickSound();
      if (type === 'clg') {
        showToast('🏛️ Chitkara University &bull; B.E. Computer Science & Engineering (2021–2025)');
      } else if (type === 'school-12') {
        showToast("🏫 St. John's Senior Secondary School &bull; Class 12 (Science / PCM, 2018–2019)");
      } else if (type === 'school-10') {
        showToast("🏫 St. John's Senior Secondary School &bull; Class 10 (Secondary Certificate, 2016–2017)");
      }
    });
  });

  // Unified Dossier Mode Filter Tabs (All / Studio / Academic)
  const dossierGrid = document.getElementById('unified-dossier-grid');
  const dossierTabs = document.querySelectorAll('.pill-btn-tab');

  dossierTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetMode = tab.getAttribute('data-tab');
      dossierTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (dossierGrid) {
        dossierGrid.setAttribute('data-active-tab', targetMode);
      }
      playClickSound();
    });
  });

  // 4. Project Modal Triggers
  document.querySelectorAll('.btn-open-project').forEach(btn => {
    btn.addEventListener('mouseenter', () => playHoverTick());
    btn.addEventListener('click', (e) => {
      const proj = e.currentTarget.getAttribute('data-project');
      openProjectModal(proj);
    });
  });

  document.querySelectorAll('.browser-window-mockup, .dual-browser-card').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', () => playHoverTick());
    el.addEventListener('click', (e) => {
      const proj = e.currentTarget.getAttribute('data-project');
      if (proj) openProjectModal(proj);
    });
  });

  const btnCloseProject = document.getElementById('btn-close-project');
  const projectBackdrop = document.getElementById('project-backdrop');
  const projectModal = document.getElementById('project-modal');

  const closeProjectModal = () => {
    projectModal.classList.remove('modal-active');
    playModalCloseSound();
  };

  if (btnCloseProject) btnCloseProject.addEventListener('click', closeProjectModal);
  if (projectBackdrop) projectBackdrop.addEventListener('click', closeProjectModal);

  // 5. "Do a trick" 360° Mascot Spin & Confetti (Connected to Live SVG Rig)
  const btnDoTrick = document.getElementById('btn-do-trick');
  const interactiveAvatar = document.getElementById('mascot-interactive-avatar');

  const triggerMascotTrick = () => {
    if (window.triggerGuideTrick) {
      window.triggerGuideTrick();
    } else {
      playTrickSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#2261e9', '#f59e0b', '#e11d48', '#ffffff']
      });
    }
    showToast('⚡ Khalid did a 360° flip!');
  };

  if (btnDoTrick) btnDoTrick.addEventListener('click', triggerMascotTrick);
  if (interactiveAvatar) interactiveAvatar.addEventListener('click', triggerMascotTrick);

  // Interactive Social Pill Cards Hover & Click Feedback
  document.querySelectorAll('.social-pill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      playHoverTick();
      guideLookAt(-5.5, 0.5);
    });
    card.addEventListener('click', () => {
      playClickSound();
    });
  });

  // 6. Direct Email Click-to-Copy
  const btnCopyEmail = document.getElementById('btn-copy-email');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      navigator.clipboard.writeText('mohdk6330@gmail.com').then(() => {
        playSuccessSound();
        showToast('📋 mohdk6330@gmail.com copied to clipboard!');
      }).catch(() => {
        window.location.href = 'mailto:mohdk6330@gmail.com';
      });
    });
  }

  // 7. Interactive Mascot Bubble Quips on Mascot Click
  const quips = [
    'Hey! Scroll down to see my production builds.',
    'I build websites that move and scale.',
    'B.E. Computer Science from Chitkara University (2021–2025).',
    'Certified in Generative AI & Prompt Engineering!',
    'CleanVid removes watermarks at 60 FPS with OpenCV!',
    'Kabir Bazaar runs MeiliSearch under 40ms.',
    'FluxRip extracts media with real-time FFmpeg pipelines.'
  ];

  document.querySelectorAll('.stage-mascot-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const bubble = wrapper.querySelector('.bubble-content');
      if (bubble) {
        const randomQuip = quips[Math.floor(Math.random() * quips.length)];
        bubble.innerHTML = randomQuip;
        playBubblePop();
      }
    });
  });

  // 8. Stage Scrollytelling, HUD Progress & Keyboard Navigation (Option 1)
  const stages = Array.from(document.querySelectorAll('.stage'));
  const hudDots = Array.from(document.querySelectorAll('.hud-dot'));
  const progressFill = document.getElementById('hud-progress-fill');
  let currentStageIndex = 0;

  // Ensure hero is visible on load
  if (stages[0]) stages[0].classList.add('stage-visible');

  // Viewport-Center Synced Active Stage Engine
  // Guarantees 100% symmetrical, race-condition-free detection in both forward & reverse scroll
  let activeStageIdx = -1;

  function syncActiveStage() {
    const centerY = window.innerHeight * 0.45;
    let currentIdx = 0;

    for (let i = 0; i < stages.length; i++) {
      const rect = stages[i].getBoundingClientRect();
      if (rect.top <= centerY && rect.bottom > centerY) {
        currentIdx = i;
        break;
      }
    }

    if (currentIdx !== activeStageIdx) {
      const prevStageIdx = activeStageIdx;
      activeStageIdx = currentIdx;
      currentStageIndex = currentIdx;

      // Mark stage visible for entrance animations
      stages[currentIdx].classList.add('stage-visible');

      // Manage stage-active for fast & snappy entrance animations on every visit (forward & backward)
      stages.forEach((st, idx) => {
        if (idx === currentIdx) {
          st.classList.remove('stage-active');
          void st.offsetWidth; // Force reflow to re-trigger CSS animations
          st.classList.add('stage-active');
        } else {
          st.classList.remove('stage-active');
        }
      });

      // Update character companion across all stages in both forward and reverse
      updateLiveGuideStage(currentIdx);

      if (stages[currentIdx].id === 'experience') {
        const fromBelow = prevStageIdx !== -1 && prevStageIdx > currentIdx;
        onEnterExperience(fromBelow ? 'up' : 'down');
      } else {
        onLeaveExperience();
        // Auto-reset education section to first milestone only when user is at the top (Hero or Bio)
        if (currentIdx <= 1) {
          savedExperienceMilestoneIdx = 0;
          if (activeMilestoneIdx !== 0) {
            goToMilestone(0);
          }
        }
      }

      // Update HUD active dot
      hudDots.forEach((dot, dIdx) => {
        if (dIdx === currentIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Update progress fill line
      if (progressFill && stages.length > 1) {
        const pct = (currentIdx / (stages.length - 1)) * 100;
        progressFill.style.height = `${pct}%`;
      }
    }
  }

  window.addEventListener('scroll', syncActiveStage, { passive: true });
  syncActiveStage(); // Synchronize on initial page load immediately

  // Continuous Fluid Mobile Reading Progress Bar (Top 2.5px Native HUD)
  const mobileProgressBar = document.getElementById('mobile-progress-bar');
  function updateMobileProgress() {
    if (!mobileProgressBar) return;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
    mobileProgressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }
  window.addEventListener('scroll', updateMobileProgress, { passive: true });
  updateMobileProgress();

  // Initialize Horizontal Scrollytelling Experience Stage Motion
  initHorizontalTimelineMotion();

  // Initialize Interactive Device Parallax & Floating 3D Depth
  initProjectDeviceParallax();

  // Keyboard Navigation: stage-by-stage + horizontal card scrubbing
  window.addEventListener('keydown', (e) => {
    if (document.querySelector('.swiss-modal.modal-active')) return;

    // If currently on Experience Stage, Arrow keys advance/reverse stations seamlessly
    if (currentStageIndex === 2) {
      if (e.key === 'ArrowRight') {
        if (activeMilestoneIdx < MILESTONES.length - 1) {
          e.preventDefault();
          navigateToMilestone(activeMilestoneIdx + 1);
          return;
        } else {
          e.preventDefault();
          const cleanvid = document.getElementById('cleanvid');
          if (cleanvid) cleanvid.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeMilestoneIdx > 0) {
          e.preventDefault();
          navigateToMilestone(activeMilestoneIdx - 1);
          return;
        } else {
          e.preventDefault();
          const bio = document.getElementById('bio');
          if (bio) bio.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const bio = document.getElementById('bio');
        if (bio) bio.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (currentStageIndex < stages.length - 1) {
        e.preventDefault();
        stages[currentStageIndex + 1].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentStageIndex > 0) {
        e.preventDefault();
        stages[currentStageIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // HUD Click Smooth Scrolling
  hudDots.forEach(dot => {
    dot.addEventListener('mouseenter', () => playHoverTick());
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      const targetId = dot.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// ============================================================================
// HORIZONTAL SCROLLYTELLING TIMELINE & MOVING MASCOT RIG ENGINE
// Chronological: 2016-17 School -> 2018-19 PCM -> 2021-25 Chitkara -> 2025-Pres Studio
// Forward-only advancement during downward scroll, clean upward escape to Bio, and reset at top
// ============================================================================

const MILESTONES = [
  {
    stnKey: 'school-10',
    badge: '📐 MILESTONE 01 / 04',
    title: 'St. Thomas’ School (ICSE Class X Matric)',
    speech: 'Starting with the foundation: Class 10th at <span class="bubble-bold">St. Thomas’ School (ICSE)</span> with <span class="bubble-bold">94% in Computer Applications</span>—early Java &amp; algorithmic logic!',
    mobileSpeech: '<span class="bubble-bold">St. Thomas’ School (ICSE)</span>: 94% in Computer Apps &amp; 85% Distinction!',
    mascotOffset: 0,
    mascotRot: 1.5,
    lookX: -5.2,
    lookY: -0.5,
    laserWidth: '0%',
    scrubberWidth: '25%'
  },
  {
    stnKey: 'school-12',
    badge: '⚡ MILESTONE 02 / 04',
    title: 'St. John’s Sr. Sec. School, Kota (Class XII PCM)',
    speech: 'Next: Class 12th in the <span class="bubble-bold">Science Stream (PCM)</span> at <span class="bubble-bold">St. John’s Sr. Sec. School, Kota, Rajasthan</span> (CBSE 2019)—solidifying calculus, mechanics, and rigorous analytical problem solving!',
    mobileSpeech: '<span class="bubble-bold">St. John’s, Kota (Class XII PCM)</span>: Calculus, Physics &amp; analytical discipline!',
    mascotOffset: 0,
    mascotRot: -1.5,
    lookX: -5.0,
    lookY: -0.8,
    laserWidth: '33.3%',
    scrubberWidth: '50%'
  },
  {
    stnKey: 'chitkara-be',
    badge: '🎓 MILESTONE 03 / 04',
    title: 'Chitkara University (B.E. CSE — 9.11 CGPA)',
    speech: 'Then, my B.E. in Computer Science &amp; Engineering at <span class="bubble-bold">Chitkara University</span> (2021–25), graduating with a stellar <span class="bubble-bold">9.11 CGPA Distinction</span>—mastering DSA, Systems Architecture, OS internals &amp; Certified in <span class="bubble-bold">Generative AI</span>!',
    mobileSpeech: '<span class="bubble-bold">Chitkara University (B.E. CSE)</span>: 9.11 CGPA Distinction &amp; GenAI Certified!',
    mascotOffset: 0,
    mascotRot: 0,
    lookX: -5.0,
    lookY: -1.0,
    laserWidth: '66.6%',
    scrubberWidth: '75%'
  },
  {
    stnKey: 'khalid-builds',
    badge: '🚀 MILESTONE 04 / 04',
    title: 'KhalidBuilds Studio (10+ Commercial Ships)',
    speech: 'And my studio: <span class="bubble-bold">KhalidBuilds Studio</span> (2025–Present)! "We Design • We Build • We Grow"—shipping 10+ commercial platforms with 95+ PageSpeed scores, Next.js 16, and sub-second load times! Click any platform to explore!',
    mobileSpeech: '<span class="bubble-bold">KhalidBuilds Studio</span>: 10+ commercial ships with 95+ PageSpeed! Tap any project!',
    mascotOffset: 0,
    mascotRot: 0,
    lookX: -4.5,
    lookY: 1.0,
    laserWidth: '100%',
    scrubberWidth: '100%'
  }
];

let activeMilestoneIdx = 0;
let savedExperienceMilestoneIdx = 0;
let isExperienceActive = false;
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
let scrollDir = 'down';
let experienceEnterTime = 0;

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (Math.abs(currentY - lastScrollY) > 2) {
      scrollDir = currentY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentY;
    }
  }, { passive: true });
}

export function goToMilestone(index) {
  if (index < 0) index = 0;
  if (index >= MILESTONES.length) index = MILESTONES.length - 1;
  activeMilestoneIdx = index;
  savedExperienceMilestoneIdx = index;

  const m = MILESTONES[index];
  const track = document.getElementById('horizontal-cards-track');
  const cards = document.querySelectorAll('.timeline-card');

  // 1. Horizontal Cards Translation (Both Desktop & Mobile!)
  if (cards.length && track) {
    const targetCard = cards[index];
    if (targetCard) {
      const cardLeft = targetCard.offsetLeft;
      track.style.transform = `translateX(-${cardLeft}px)`;
    }

    cards.forEach((c, i) => {
      if (i === index) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  // 2. Update Stepper Header Pills
  document.querySelectorAll('.step-pill').forEach((pill, i) => {
    if (i === index) {
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
    } else {
      pill.classList.remove('active');
      pill.setAttribute('aria-selected', 'false');
    }
  });

  // 3. Update Laser Rail & Stations
  document.querySelectorAll('.laser-station').forEach((stn, i) => {
    if (i <= index) {
      stn.classList.add('active');
    } else {
      stn.classList.remove('active');
    }
    if (i === index) {
      stn.classList.add('current');
      stn.setAttribute('aria-selected', 'true');
    } else {
      stn.classList.remove('current');
      stn.setAttribute('aria-selected', 'false');
    }
  });
  const laserFill = document.getElementById('timeline-laser-fill');
  if (laserFill) laserFill.style.width = m.laserWidth;

  // 4. Update Bottom Scrubber & Step Labels
  const scrubberFill = document.getElementById('track-scrubber-fill');
  if (scrubberFill) scrubberFill.style.width = m.scrubberWidth;

  const stepNumEl = document.getElementById('active-step-num');
  if (stepNumEl) stepNumEl.textContent = `0${index + 1}`;

  const stepTitleEl = document.getElementById('active-step-title');
  if (stepTitleEl) stepTitleEl.textContent = m.title;

  // 5. Update Arrow Controls with dynamic tooltips and accessible state
  const prevBtn = document.getElementById('btn-prev-milestone');
  const nextBtn = document.getElementById('btn-next-milestone');
  if (prevBtn) {
    prevBtn.disabled = index === 0;
    const prevTitle = index > 0 ? `Previous: Note 0${index} (${MILESTONES[index - 1].badge})` : 'At first milestone';
    prevBtn.setAttribute('title', prevTitle);
    prevBtn.setAttribute('aria-label', prevTitle);
  }
  if (nextBtn) {
    nextBtn.disabled = index === MILESTONES.length - 1;
    const nextTitle = index < MILESTONES.length - 1 ? `Next: Note 0${index + 2} (${MILESTONES[index + 1].badge})` : 'At latest milestone';
    nextBtn.setAttribute('title', nextTitle);
    nextBtn.setAttribute('aria-label', nextTitle);
  }

  // 6. Anchor character on right bezel and speak (only if user is actively in experience)
  if (isExperienceActive) {
    guideSetSide('right');
    guideSetOffset(m.mascotOffset, 0, m.mascotRot);
    guideLookAt(m.lookX, m.lookY);
    const activeSpeech = (typeof window !== 'undefined' && window.innerWidth <= 640 && m.mobileSpeech) ? m.mobileSpeech : m.speech;
    guideSpeakDirect(activeSpeech, m.badge, 3800);
  }
}

export function onEnterExperience(direction = 'down') {
  isExperienceActive = true;
  experienceEnterTime = Date.now();
  guideSetSide('right');

  if (direction === 'up') {
    // Entering from below (CleanVid / Projects):
    // Show the milestone the user left off on!
    goToMilestone(savedExperienceMilestoneIdx);
  } else {
    // Entering from above (Hero / Bio):
    // Start fresh at the first milestone (Note 01 - St. Thomas)
    goToMilestone(0);
  }
}

export function onLeaveExperience() {
  isExperienceActive = false;
  // Reset character offset smoothly so it aligns with other stages
  guideSetOffset(0, 0, 0);
}

function initHorizontalTimelineMotion() {
  const expSection = document.getElementById('experience');
  if (!expSection) return;

  const stations = Array.from(document.querySelectorAll('.experience-snap-station'));
  let isProgrammaticNavigation = false;
  let programmaticNavTimeout = null;
  let lastForwardStepTime = 0;

  /**
   * Universal Milestone Navigator:
   * Smoothly slides the horizontal carousel and updates UI pills, laser rail,
   * step labels, mascot, and arrow states, and aligns window scroll to the station.
   */
  const navigateToMilestone = (index, shouldScrollWindow = true) => {
    const targetIdx = Math.max(0, Math.min(MILESTONES.length - 1, index));
    goToMilestone(targetIdx);
    playMilestoneSound(targetIdx);
    lastForwardStepTime = Date.now();

    if (shouldScrollWindow) {
      isProgrammaticNavigation = true;
      if (programmaticNavTimeout) clearTimeout(programmaticNavTimeout);
      programmaticNavTimeout = setTimeout(() => {
        isProgrammaticNavigation = false;
      }, 750);

      const expTop = expSection.offsetTop;
      const targetScrollY = expTop + (targetIdx * window.innerHeight);
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  };

  // 1. Natural Vertical Scroll Forward Scrollytelling (Both PC & Mobile!)
  // Forward scroll DOWN advances: Note 01 -> Note 02 -> Note 03 -> Note 04 -> CleanVid.
  // Each milestone is strictly bound to its physical scroll station.
  // When the user stops scrolling, it remains completely stationary — ZERO automatic movement!
  // Upward scroll NEVER reverses milestones (reverse shifting is done via ←, swipe, and dots).
  const updateMilestonePosition = () => {
    const expRect = expSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (isProgrammaticNavigation) return;
    if (scrollDir === 'up') return; // NEVER reverse milestones on upward scroll!

    if (expRect.top <= 10 && expRect.bottom >= windowH * 0.4) {
      const scrolled = Math.max(0, -expRect.top);
      // Determine milestone strictly from physical scroll distance with balanced pacing:
      // Station 0 (Note 01: St. Thomas): 0 to 0.85H
      // Station 1 (Note 02: St. John's): 0.85H to 1.80H
      // Station 2 (Note 03: Chitkara):  1.80H to 2.75H
      // Station 3 (Note 04: Studio):    2.75H to 4.00H (1.25H = ~1,065px reading & interaction dwell runway!)
      let station = 0;
      if (scrolled >= windowH * 2.75) {
        station = 3;
      } else if (scrolled >= windowH * 1.8) {
        station = 2;
      } else if (scrolled >= windowH * 0.85) {
        station = 1;
      }

      // ONLY advance when the user has physically scrolled into a deeper station!
      if (station > activeMilestoneIdx) {
        goToMilestone(station);
        playMilestoneSound(station);
      }
    }
  };

  window.addEventListener('scroll', updateMilestonePosition, { passive: true });
  window.addEventListener('resize', () => {
    goToMilestone(activeMilestoneIdx);
  }, { passive: true });

  // 2. Stepper Pills Click -> Jump directly to milestone (forward or backward)
  document.querySelectorAll('.step-pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => playHoverTick());
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const step = parseInt(pill.getAttribute('data-step'), 10);
      if (!isNaN(step)) {
        navigateToMilestone(step);
      }
    });
  });

  // 3. Laser Stations Click -> Jump directly to milestone (forward or backward)
  document.querySelectorAll('.laser-station').forEach(stn => {
    stn.addEventListener('mouseenter', () => playHoverTick());
    stn.addEventListener('click', (e) => {
      e.preventDefault();
      const step = parseInt(stn.getAttribute('data-station'), 10);
      if (!isNaN(step)) {
        navigateToMilestone(step);
      }
    });
    stn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const step = parseInt(stn.getAttribute('data-station'), 10);
        if (!isNaN(step)) {
          navigateToMilestone(step);
        }
      }
    });
  });

  // 4. Arrow Buttons (Prev / Next)
  const prevBtn = document.getElementById('btn-prev-milestone');
  const nextBtn = document.getElementById('btn-next-milestone');
  if (prevBtn) {
    prevBtn.addEventListener('mouseenter', () => playHoverTick());
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeMilestoneIdx > 0) {
        navigateToMilestone(activeMilestoneIdx - 1);
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('mouseenter', () => playHoverTick());
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeMilestoneIdx < MILESTONES.length - 1) {
        navigateToMilestone(activeMilestoneIdx + 1);
      }
    });
  }

  // 5. Keyboard Arrow Navigation (Left / Right / Down / Up) while inside Experience
  window.addEventListener('keydown', (e) => {
    if (!isExperienceActive) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (activeMilestoneIdx < MILESTONES.length - 1) {
        e.preventDefault();
        navigateToMilestone(activeMilestoneIdx + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (activeMilestoneIdx > 0) {
        e.preventDefault();
        navigateToMilestone(activeMilestoneIdx - 1);
      }
    }
  });

  // 6. Click on Card Body to Jump to it
  document.querySelectorAll('.timeline-card').forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.ship-card-btn')) {
        if (idx !== activeMilestoneIdx) {
          navigateToMilestone(idx);
        }
      }
    });
  });

  // 7. Interactive Chimes on Platform Links
  document.querySelectorAll('.ship-card-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      playHoverTick();
      guideLookAt(-2.5, 2.0);
    });
    btn.addEventListener('click', () => {
      playClickSound();
    });
  });

  // 8. Touch Swipe Gesture Support for Mobile & Tablet on Conveyor Viewport
  const conveyorViewport = expSection.querySelector('.horizontal-conveyor-viewport') || document.getElementById('horizontal-conveyor-viewport');
  if (conveyorViewport) {
    let touchStartX = 0;
    let touchStartY = 0;

    conveyorViewport.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    conveyorViewport.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        // Trigger horizontal milestone swipe when horizontal delta dominates vertical scroll
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          if (dx < 0 && activeMilestoneIdx < MILESTONES.length - 1) {
            navigateToMilestone(activeMilestoneIdx + 1);
          } else if (dx > 0 && activeMilestoneIdx > 0) {
            navigateToMilestone(activeMilestoneIdx - 1);
          }
        }
      }
    }, { passive: true });
  }

  // Initial layout positioning
  setTimeout(() => {
    goToMilestone(0);
  }, 200);

  // Resize window recalculation
  window.addEventListener('resize', () => {
    goToMilestone(activeMilestoneIdx);
  });
}

window.goToMilestone = goToMilestone;
window.onEnterExperience = onEnterExperience;
window.onLeaveExperience = onLeaveExperience;

// Interactive 3D Depth & Mouse Parallax on Project Stages
function initProjectDeviceParallax() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let curBrowserX = 0, curBrowserY = 0;
  let curPhoneX = 0, curPhoneY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderParallax() {
    const activeStage = document.querySelector('.stage-project.stage-active');
    if (activeStage) {
      const showcase = activeStage.querySelector('.stage-device-showcase');
      if (showcase) {
        const rect = showcase.getBoundingClientRect();
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;

        const normX = Math.max(-1, Math.min(1, (mouseX - centerX) / (window.innerWidth * 0.5)));
        const normY = Math.max(-1, Math.min(1, (mouseY - centerY) / (window.innerHeight * 0.5)));

        // Target translations: phone moves 2.6x more than browser for authentic 3D physical depth
        const targetBrowserX = normX * 4;
        const targetBrowserY = normY * 3;
        const targetPhoneX = normX * 11;
        const targetPhoneY = normY * 9;

        curBrowserX += (targetBrowserX - curBrowserX) * 0.08;
        curBrowserY += (targetBrowserY - curBrowserY) * 0.08;
        curPhoneX += (targetPhoneX - curPhoneX) * 0.08;
        curPhoneY += (targetPhoneY - curPhoneY) * 0.08;

        const browser = showcase.querySelector('.browser-window-mockup');
        const phone = showcase.querySelector('.iphone-mockup-wrapper');

        if (browser) {
          browser.style.setProperty('--mouse-tx', `${curBrowserX.toFixed(1)}px`);
          browser.style.setProperty('--mouse-ty', `${curBrowserY.toFixed(1)}px`);
        }
        if (phone) {
          phone.style.setProperty('--mouse-tx', `${curPhoneX.toFixed(1)}px`);
          phone.style.setProperty('--mouse-ty', `${curPhoneY.toFixed(1)}px`);
        }
      }
    }
    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}




