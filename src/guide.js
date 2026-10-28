// src/guide.js - Interactive Live Guide Companion System for Mohd Khalid
// Features: Dynamic SVG Character Rig with talking mouth lip-sync, gaze tracking, stage narration, and drag physics.

import confetti from 'canvas-confetti';
import { KhalidCharacterRig } from './character-rig.js';
import { playStageWhoosh, playBubblePop, playTrickSound } from './sound.js';

// Stage Narrative Script across all 9 portfolio stages
const STAGE_SCRIPTS = [
  {
    stageId: 'hero',
    gesture: 'wave',
    side: 'right',
    badge: '👋 Guided Tour',
    speech: `Welcome! <span class="bubble-bold">Click or drag</span> me to interact, or scroll down to explore my work!`
  },
  {
    stageId: 'bio',
    gesture: 'think',
    side: 'left',
    badge: '💡 About &amp; Focus',
    speech: `I focus on writing <span class="bubble-bold">clean code</span>, building responsive web apps, and exploring applied AI.`
  },
  {
    stageId: 'experience',
    gesture: 'think',
    side: 'right', // Stands on the right, looking across at the editorial index rows
    badge: '🎓 Academic &amp; Studio Trajectory',
    speech: `Explore my journey in order: starting from my <span class="bubble-bold">Schooling &amp; Sciences</span> (2016), through my <span class="bubble-bold">B.E. in Computer Science</span>, to my <span class="bubble-bold">Khalid Builds</span> studio!`
  },
  {
    stageId: 'cleanvid',
    gesture: 'point',
    side: 'left',
    badge: '✨ CleanVid AI',
    speech: `Meet <span class="bubble-bold">CleanVid</span>! AI client-side video watermark inpainting with OpenCV. <a href="https://cleanvid.site" target="_blank" rel="noopener noreferrer" class="bubble-link">Live Site ↗</a>`
  },
  {
    stageId: 'kabir-bazaar',
    gesture: 'point',
    side: 'right',
    badge: '🛍️ Kabir Bazaar',
    speech: `<span class="bubble-bold">Kabir Bazaar</span>: Multi-vendor marketplace with &lt;40ms instant catalog search! <a href="https://kabirbazaar.site" target="_blank" rel="noopener noreferrer" class="bubble-link">Live Site ↗</a>`
  },
  {
    stageId: 'fluxrip',
    gesture: 'point',
    side: 'left',
    badge: '⚡ FluxRip Cloud',
    speech: `<span class="bubble-bold">FluxRip</span>: High-speed cloud media engine powered by async FFmpeg workers! <a href="https://fluxrip.online" target="_blank" rel="noopener noreferrer" class="bubble-link">Live Site ↗</a>`
  },
  {
    stageId: 'selected-works',
    gesture: 'point',
    side: 'right',
    badge: '📂 Commercial Ships',
    speech: `Explore our full platform launches: <span class="bubble-bold">Gharwaala</span>, <span class="bubble-bold">Will Tech</span>, and Nexora Cloud.`
  },
  {
    stageId: 'skills',
    gesture: 'think',
    side: 'right',
    badge: '🛠️ Technical Arsenal',
    speech: `My core stack: <span class="bubble-bold">React 19</span>, <span class="bubble-bold">Next.js</span>, <span class="bubble-bold">Node.js</span>, OpenCV, &amp; Cloud Architectures.`
  },
  {
    stageId: 'contact',
    gesture: 'wave',
    side: 'right',
    badge: '🚀 Let’s Collaborate',
    speech: `Ready to build something high-impact? <span class="bubble-bold">Drop me a line below</span>!`
  }
];

class LiveGuideCompanion {
  constructor() {
    this.container = null;
    this.speechEl = null;
    this.badgeEl = null;
    this.bubbleEl = null;
    this.tiltLayer = null;
    this.mascotBox = null;
    this.rig = null;

    this.currentStageIdx = 0;
    this.currentSide = 'right';

    // Parallax tracking
    this.mouseX = window.innerWidth * 0.5;
    this.mouseY = window.innerHeight * 0.5;
    this.curRotX = 0;
    this.curRotY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.scrollTilt = 0;
    this.lastScrollY = window.scrollY;
    this.scrollStopTimer = null;

    // Drag physics
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.hasMoved = false;
    this.idleResetTimer = null;

    this.hasInitialized = false;
    this.init();
  }

  init() {
    this.createDom();
    this.bindEvents();
    this.startParallaxLoop();
    this.updateForStage(0, false);
  }

  createDom() {
    // Create persistent live-guide container if not present
    let guide = document.getElementById('live-guide-companion');
    if (!guide) {
      guide = document.createElement('aside');
      guide.id = 'live-guide-companion';
      guide.className = 'live-guide-companion guide-side-right';
      guide.setAttribute('aria-label', 'Interactive Portfolio Live Guide');
      guide.innerHTML = `
        <div id="live-guide-bubble" class="live-guide-bubble bubble-left">
          <div class="bubble-badge" id="live-guide-badge">👋 Guided Tour</div>
          <p class="bubble-text" id="live-guide-text">Welcome! <span class="bubble-bold">Click or drag</span> me to interact, or scroll down to explore my work!</p>
          <div class="bubble-pointer"></div>
        </div>
        
        <div id="live-guide-mascot-box" class="live-guide-mascot-box" title="Drag me anywhere or click me to do a trick!">
          <div class="mascot-tilt-layer" id="live-guide-tilt-layer"></div>
          <div class="guide-live-indicator" title="Live Companion Active">
            <span class="live-pulse"></span>
          </div>
        </div>
      `;
      document.body.appendChild(guide);
    }

    this.container = guide;
    this.speechEl = document.getElementById('live-guide-text');
    this.badgeEl = document.getElementById('live-guide-badge');
    this.bubbleEl = document.getElementById('live-guide-bubble');
    this.tiltLayer = document.getElementById('live-guide-tilt-layer');
    this.mascotBox = document.getElementById('live-guide-mascot-box');

    // Instantiate vector Character Rig inside tiltLayer
    if (this.tiltLayer) {
      this.rig = new KhalidCharacterRig(this.tiltLayer);
    }
  }

  bindEvents() {
    // Real-time mouse gaze tracking for character eyes
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (this.rig) {
        this.rig.updateGaze(e.clientX, e.clientY);
      }
    }, { passive: true });

    // Dynamic scroll-momentum tracking: character leans subtly with scroll velocity
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - this.lastScrollY;
      this.lastScrollY = currentScrollY;

      // Clamped subtle vertical & rotational tilt from scroll momentum
      this.scrollTilt = Math.max(-5, Math.min(5, delta * 0.08));

      clearTimeout(this.scrollStopTimer);
      this.scrollStopTimer = setTimeout(() => {
        this.scrollTilt = 0;
      }, 140);
    }, { passive: true });

    // Drag & Drop Physics
    if (this.mascotBox) {
      this.mascotBox.addEventListener('mousedown', (e) => this.onDragStart(e));
      this.mascotBox.addEventListener('touchstart', (e) => this.onDragStart(e), { passive: false });

      // Hover feedback: Friendly smile
      this.mascotBox.addEventListener('mouseenter', () => {
        if (this.rig && !this.rig.isTalking) {
          this.rig.setMouthShape('laugh');
        }
      });

      this.mascotBox.addEventListener('mouseleave', () => {
        if (this.rig && !this.rig.isTalking) {
          this.rig.setMouthShape('smile');
        }
      });
    }

    window.addEventListener('mousemove', (e) => this.onDragMove(e));
    window.addEventListener('touchmove', (e) => this.onDragMove(e), { passive: false });

    window.addEventListener('mouseup', (e) => this.onDragEnd(e));
    window.addEventListener('touchend', (e) => this.onDragEnd(e));

    // Easter egg trick buttons in footer
    const trickBtn = document.getElementById('btn-mascot-trick');
    if (trickBtn) {
      trickBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.doBackflipTrick();
      });
    }

    window.addEventListener('resize', () => {
      this.syncMobileCompactState(this.currentStageIdx);
    }, { passive: true });
  }

  syncMobileCompactState(stageIdx) {
    if (!this.container) return;
    const isMobile = window.innerWidth <= 900;
    if (isMobile && stageIdx > 0) {
      this.container.classList.add('guide-mobile-minimized');
    } else {
      this.container.classList.remove('guide-mobile-minimized', 'guide-mobile-bubble-peek');
    }
  }

  updateForStage(stageIdx, triggerSound = true) {
    if (stageIdx < 0 || stageIdx >= STAGE_SCRIPTS.length) return;
    const script = STAGE_SCRIPTS[stageIdx];
    const isMobile = window.innerWidth <= 900;
    // On mobile, keep the minimized badge anchored on the right so it never jumps across content
    const targetSide = (isMobile && stageIdx > 0) ? 'right' : script.side;
    const currentSide = this.container ? (this.container.classList.contains('guide-side-left') ? 'left' : 'right') : this.currentSide;

    const isInitialLoad = !this.hasInitialized;
    const isChangingSides = !isInitialLoad && currentSide !== targetSide;
    const direction = stageIdx >= this.currentStageIdx ? 'down' : 'up';

    this.syncMobileCompactState(stageIdx);

    if (this.currentStageIdx === stageIdx && currentSide === targetSide && this.hasInitialized) return;
    this.hasInitialized = true;
    this.currentStageIdx = stageIdx;

    // Play page transition Whoosh sound immediately when moving between stages
    if (!isInitialLoad && triggerSound) {
      playStageWhoosh(direction, isChangingSides);
    }

    // If dragged away, gently reset position when moving between stages
    if (this.hasMoved && !this.isDragging) {
      this.resetDragPosition();
    }

    // 1. Update Position Side (Smooth Gliding sprint across stage in both forward and reverse)
    this.setSide(targetSide);

    clearTimeout(this.arrivalSpeechTimer);

    if (isChangingSides) {
      // sebg.ch choreography: tuck speech bubble & turn head in walking direction during cross-screen walk,
      // then face forward and pop speech bubble upon arriving at the opposite side!
      if (this.bubbleEl) {
        this.bubbleEl.classList.remove('bubble-pop');
        this.bubbleEl.classList.add('bubble-walking-hide');
      }
      if (this.rig) {
        this.rig.stopSpeaking();
        this.rig.setWalkingTurn(targetSide);
      }

      this.arrivalSpeechTimer = setTimeout(() => {
        if (this.rig) {
          this.rig.setWalkingTurn(null);
          this.rig.setGesture(script.gesture, script.side);
          this.rig.speak(2800);
          if (stageIdx >= 3 && stageIdx <= 6) {
            const gazeX = targetSide === 'left' ? 5.5 : -5.5;
            this.rig.lockGaze(gazeX, -4.5, 1800);
          }
        }
        if (this.speechEl && this.bubbleEl) {
          if (this.badgeEl) this.badgeEl.innerHTML = script.badge;
          this.speechEl.innerHTML = script.speech;
          this.bubbleEl.classList.remove('bubble-walking-hide', 'bubble-pop');
          void this.bubbleEl.offsetWidth;
          this.bubbleEl.classList.add('bubble-pop');
          if (triggerSound) {
            playBubblePop();
          }
        }
      }, 460);
    } else {
      // Same side or initial load: immediate perk, gesture, and bubble pop
      if (this.rig) {
        this.rig.setWalkingTurn(null);
        this.rig.setGesture(script.gesture, script.side);
        this.rig.speak(2800);

        if (stageIdx >= 3 && stageIdx <= 6) {
          const gazeX = targetSide === 'left' ? 5.5 : -5.5;
          this.rig.lockGaze(gazeX, -4.5, 1800);
        }
      }

      if (this.mascotBox && !this.isDragging) {
        this.mascotBox.classList.remove('mascot-glide-step');
        void this.mascotBox.offsetWidth;
        this.mascotBox.classList.add('mascot-glide-step');
      }

      if (this.speechEl && this.bubbleEl) {
        this.bubbleEl.classList.remove('bubble-walking-hide', 'bubble-pop');
        void this.bubbleEl.offsetWidth; // Trigger reflow
        this.bubbleEl.classList.add('bubble-pop');

        if (this.badgeEl) this.badgeEl.innerHTML = script.badge;
        this.speechEl.innerHTML = script.speech;
      }
    }
  }

  startParallaxLoop() {
    const loop = () => {
      if (this.tiltLayer && !this.isDragging) {
        const rect = this.mascotBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (this.mouseX - centerX) / (window.innerWidth / 2);
        const deltaY = (this.mouseY - centerY) / (window.innerHeight / 2);

        // Clamped subtle 3D tilt angles, incorporating dynamic scroll momentum
        this.targetRotY = Math.max(-14, Math.min(14, deltaX * 12));
        this.targetRotX = Math.max(-10, Math.min(10, -deltaY * 8 + (this.scrollTilt || 0)));

        // Smooth damping (lerp)
        this.curRotX += (this.targetRotX - this.curRotX) * 0.08;
        this.curRotY += (this.targetRotY - this.curRotY) * 0.08;

        this.tiltLayer.style.transform = `perspective(750px) rotateX(${this.curRotX.toFixed(2)}deg) rotateY(${this.curRotY.toFixed(2)}deg)`;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  onDragStart(e) {
    this.isDragging = true;
    this.hasMoved = false;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

    const rect = this.container.getBoundingClientRect();
    this.dragStartX = clientX - rect.left;
    this.dragStartY = clientY - rect.top;

    this.container.classList.add('is-dragging');
    if (this.bubbleEl) {
      this.bubbleEl.style.opacity = '0.35';
      this.bubbleEl.style.transform = 'scale(0.92)';
    }

    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }
  }

  onDragMove(e) {
    if (!this.isDragging) return;
    this.hasMoved = true;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

    const newLeft = clientX - this.dragStartX;
    const newTop = clientY - this.dragStartY;

    this.container.style.left = `${Math.max(10, Math.min(window.innerWidth - 240, newLeft))}px`;
    this.container.style.top = `${Math.max(10, Math.min(window.innerHeight - 320, newTop))}px`;
    this.container.style.right = 'auto';
    this.container.style.bottom = 'auto';
    this.container.style.transform = 'scale(1.04) rotate(3deg)';
  }

  onDragEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.classList.remove('is-dragging');

    if (this.bubbleEl) {
      this.bubbleEl.style.opacity = '1';
      this.bubbleEl.style.transform = 'scale(1)';
    }

    // If movement was negligible, treat as a direct CLICK -> Trigger Trick!
    if (!this.hasMoved) {
      this.container.style.transform = '';
      this.doBackflipTrick();
    } else {
      this.container.style.transform = 'scale(1) rotate(0deg)';
      // Auto-snap back to stage anchor after 4 seconds of idle
      clearTimeout(this.idleResetTimer);
      this.idleResetTimer = setTimeout(() => {
        this.resetDragPosition();
      }, 4000);
    }
  }

  resetDragPosition() {
    this.hasMoved = false;
    this.container.style.left = '';
    this.container.style.top = '';
    this.container.style.right = '';
    this.container.style.bottom = '';
    this.container.style.transform = '';
  }

  doBackflipTrick() {
    if (!this.mascotBox) return;

    // Trigger 360-degree backflip trick animation
    this.mascotBox.classList.remove('mascot-do-trick');
    void this.mascotBox.offsetWidth; // Force reflow
    this.mascotBox.classList.add('mascot-do-trick');

    if (this.rig) {
      this.rig.triggerTrick();
    }

    // Confetti burst from character position
    const rect = this.mascotBox.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#2261e9', '#60a5fa', '#f59e0b', '#10b981', '#a855f7'],
      disableForReducedMotion: true
    });

    playTrickSound();

    // Witty reaction speech
    const quips = [
      `Wheeee! 🚀 60 FPS live vector motion!`,
      `Whoa! Nice flip! Need a high-performance developer?`,
      `Haha, you found the trick! ⚡`,
      `Always engineering websites that move &amp; scale!`
    ];
    const pick = quips[Math.floor(Math.random() * quips.length)];
    if (this.speechEl) {
      this.speechEl.innerHTML = pick;
      this.bubbleEl.classList.remove('bubble-pop');
      void this.bubbleEl.offsetWidth;
      this.bubbleEl.classList.add('bubble-pop');
    }

    if (this.container && this.container.classList.contains('guide-mobile-minimized')) {
      this.container.classList.add('guide-mobile-bubble-peek');
      clearTimeout(this.mobilePeekTimer);
      this.mobilePeekTimer = setTimeout(() => {
        if (this.container) this.container.classList.remove('guide-mobile-bubble-peek');
      }, 3200);
    }
  }

  speakDirect(speechText, badgeText = '💡 Tour Guide', duration = 3200) {
    if (this.speechEl && this.bubbleEl) {
      this.bubbleEl.classList.remove('bubble-pop');
      void this.bubbleEl.offsetWidth;
      this.bubbleEl.classList.add('bubble-pop');
      if (this.badgeEl && badgeText) this.badgeEl.innerHTML = badgeText;
      this.speechEl.innerHTML = speechText;
      if (this.rig) {
        this.rig.speak(duration);
      }
    }
  }

  lookAt(targetX, targetY, duration = 0) {
    if (this.rig) {
      if (duration > 0) {
        this.rig.lockGaze(targetX, targetY, duration);
      } else {
        this.rig.targetGazeX = targetX;
        this.rig.targetGazeY = targetY;
      }
    }
  }

  setSide(side) {
    if (!this.container) return;
    const prevSide = this.container.classList.contains('guide-side-left') ? 'left' : 'right';
    this.currentSide = side;

    // Trigger physical sprint/running animation when changing sides across sections
    if (prevSide !== side && this.mascotBox && !this.isDragging) {
      this.mascotBox.classList.remove('mascot-walking-across', 'mascot-heading-left', 'mascot-heading-right');
      void this.mascotBox.offsetWidth; // Force reflow
      
      const dirClass = side === 'left' ? 'mascot-heading-left' : 'mascot-heading-right';
      this.mascotBox.classList.add('mascot-walking-across', dirClass);

      // Direct gaze dynamically in the direction of running
      if (this.rig) {
        const gazeX = side === 'left' ? -3.5 : 3.5;
        this.lookAt(gazeX, 0.4);
      }

      clearTimeout(this.walkingTimer);
      this.walkingTimer = setTimeout(() => {
        if (this.mascotBox) {
          this.mascotBox.classList.remove('mascot-walking-across', 'mascot-heading-left', 'mascot-heading-right');
        }
      }, 920);
    }

    if (side === 'left') {
      this.container.classList.remove('guide-side-right');
      this.container.classList.add('guide-side-left');
      if (this.bubbleEl) {
        this.bubbleEl.classList.remove('bubble-left');
        this.bubbleEl.classList.add('bubble-right');
      }
    } else {
      this.container.classList.remove('guide-side-left');
      this.container.classList.add('guide-side-right');
      if (this.bubbleEl) {
        this.bubbleEl.classList.remove('bubble-right');
        this.bubbleEl.classList.add('bubble-left');
      }
    }
  }

  setCompanionOffset(offsetX = 0, offsetY = 0, rot = 0) {
    if (this.mascotBox && !this.isDragging) {
      if (offsetX === 0 && offsetY === 0 && rot === 0) {
        this.mascotBox.style.transform = '';
      } else {
        this.mascotBox.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${rot}deg)`;
      }

      if (!this.mascotBox.classList.contains('mascot-do-trick') && !this.mascotBox.classList.contains('mascot-walking-across')) {
        this.mascotBox.classList.remove('mascot-glide-step');
        void this.mascotBox.offsetWidth; // Force reflow
        this.mascotBox.classList.add('mascot-glide-step');
      }
    }
  }
}

// Global Singleton Instance
let guideInstance = null;

export function initLiveGuide(stageIndex = 0) {
  if (!guideInstance) {
    guideInstance = new LiveGuideCompanion();
  }
  return guideInstance;
}

export function updateLiveGuideStage(stageIndex, triggerSound = true) {
  if (guideInstance) {
    guideInstance.updateForStage(stageIndex, triggerSound);
  }
}

export function triggerGuideTrick() {
  if (guideInstance) {
    guideInstance.doBackflipTrick();
  }
}

export function guideSpeakDirect(speechText, badgeText, duration) {
  if (guideInstance) {
    guideInstance.speakDirect(speechText, badgeText, duration);
  }
}

export function guideLookAt(targetX, targetY) {
  if (guideInstance) {
    guideInstance.lookAt(targetX, targetY);
  }
}

export function guideSetOffset(offsetX, offsetY, rot) {
  if (guideInstance) {
    guideInstance.setCompanionOffset(offsetX, offsetY, rot);
  }
}

export function guideSetSide(side) {
  if (guideInstance) {
    guideInstance.setSide(side);
  }
}

window.initLiveGuide = initLiveGuide;
window.updateLiveGuideStage = updateLiveGuideStage;
window.triggerGuideTrick = triggerGuideTrick;
window.guideSpeakDirect = guideSpeakDirect;
window.guideLookAt = guideLookAt;
window.guideSetOffset = guideSetOffset;
window.guideSetSide = guideSetSide;

