// src/character-rig.js - Interactive SVG Character Rig of Mohd Khalid
// Features: Real-time talking mouth lip-sync, cursor gaze tracking, natural blinking, sleek double-bridge aviator glasses, Swiss halftone dither texture. Clean bust portrait (no awkward noodle arms).

export class KhalidCharacterRig {
  constructor(containerEl) {
    this.container = containerEl;
    this.svg = null;
    this.leftPupil = null;
    this.rightPupil = null;
    this.mouthCavity = null;
    this.mouthTeeth = null;
    this.mouthTongue = null;
    this.eyelids = [];
    this.headGroup = null;
    this.eyebrowLeft = null;
    this.eyebrowRight = null;
    
    // State
    this.isTalking = false;
    this.talkInterval = null;
    this.currentGesture = 'wave';
    this.currentMouth = 'smile';
    
    // Gaze tracking
    this.gazeX = 0;
    this.gazeY = 0;
    this.targetGazeX = 0;
    this.targetGazeY = 0;
    this.gazeLocked = false;
    this.gazeLockTimer = null;

    this.init();
  }

  init() {
    this.renderSvg();
    this.cacheElements();
    this.startBlinkLoop();
    this.startGazeLoop();
  }

  renderSvg() {
    // 500x580 viewBox with authentic Swiss dither textures & clean vector anatomy
    this.container.innerHTML = `
      <svg class="khalid-svg-rig" viewBox="0 0 500 580" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" aria-label="Mohd Khalid Interactive 3D Guide">
        <defs>
          <!-- Halftone Dither Pattern (sebg.ch aesthetic) -->
          <pattern id="halftone-dither" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.3" fill="#0b0b0c" opacity="0.28" />
          </pattern>

          <pattern id="dense-dither" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#0b0b0c" opacity="0.6" />
          </pattern>

          <!-- Drop Shadow Filter (Expanded bounds so outward waving/pointing arms never clip) -->
          <filter id="rig-shadow" x="-35%" y="-20%" width="170%" height="150%">
            <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.3" />
          </filter>

          <!-- Skin Gradients -->
          <linearGradient id="skin-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8dac3" />
            <stop offset="100%" stop-color="#dfb194" />
          </linearGradient>

          <!-- Volumetric 3D Hand & Finger Gradients (Zero-outline 3D shaded anatomy) -->
          <radialGradient id="palm-3d-grad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fce6d4" />
            <stop offset="52%" stop-color="#eabfa0" />
            <stop offset="85%" stop-color="#c99170" />
            <stop offset="100%" stop-color="#a87050" />
          </radialGradient>

          <radialGradient id="palm-hollow-ao" cx="50%" cy="52%" r="48%">
            <stop offset="0%" stop-color="#8c5438" stop-opacity="0.42" />
            <stop offset="65%" stop-color="#a86e4f" stop-opacity="0.14" />
            <stop offset="100%" stop-color="#eabfa0" stop-opacity="0" />
          </radialGradient>

          <radialGradient id="thenar-pad-grad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#fdebd9" />
            <stop offset="55%" stop-color="#ecc2a3" />
            <stop offset="100%" stop-color="#bd8463" />
          </radialGradient>

          <linearGradient id="finger-cyl-v" x1="0" y1="0" x2="1" y2="0.15">
            <stop offset="0%" stop-color="#fae3cf" />
            <stop offset="35%" stop-color="#f3ccb0" />
            <stop offset="78%" stop-color="#cf9776" />
            <stop offset="100%" stop-color="#a86f50" />
          </linearGradient>

          <linearGradient id="finger-cyl-h" x1="0.1" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fce7d6" />
            <stop offset="38%" stop-color="#f1c9ac" />
            <stop offset="80%" stop-color="#cb9271" />
            <stop offset="100%" stop-color="#9e6648" />
          </linearGradient>

          <linearGradient id="curled-finger-3d" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stop-color="#f5cfb3" />
            <stop offset="50%" stop-color="#d8a180" />
            <stop offset="100%" stop-color="#9a6244" />
          </linearGradient>

          <!-- 3D Cylindrical Sleeve & Rolled Cuff Gradients -->
          <linearGradient id="sleeve-cyl-left" x1="0" y1="0.2" x2="1" y2="0.8">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="45%" stop-color="#1e293b" />
            <stop offset="85%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>

          <linearGradient id="sleeve-cyl-right" x1="1" y1="0.2" x2="0" y2="0.8">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="45%" stop-color="#1e293b" />
            <stop offset="85%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>

          <linearGradient id="cuff-roll-3d" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="48%" stop-color="#e2e8f0" />
            <stop offset="82%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>

          <!-- Hoodie Gradient -->
          <linearGradient id="hoodie-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>

          <!-- Glass Lens Glare Gradient -->
          <linearGradient id="lens-glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32" />
            <stop offset="40%" stop-color="#ffffff" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Entire Mascot Group with Drop Shadow -->
        <g id="khalid-mascot-root" filter="url(#rig-shadow)">
          
          <!-- 1. TORSO / HOODIE (Clean broad shoulders anchored at bottom 580) -->
          <g id="mascot-torso">
            <!-- Hoodie Shoulders & Chest -->
            <path d="M 30 580 C 45 445, 130 395, 250 395 C 370 395, 455 445, 470 580 Z" fill="url(#hoodie-grad)" />
            <!-- Dither Texture over Torso -->
            <path d="M 30 580 C 45 445, 130 395, 250 395 C 370 395, 455 445, 470 580 Z" fill="url(#halftone-dither)" opacity="0.65" />
            
            <!-- Hoodie Inner Neck Opening -->
            <path d="M 195 398 C 195 455, 305 455, 305 398 Z" fill="#0b1120" />
            
            <!-- Drawstrings -->
            <path d="M 222 410 Q 218 470 214 495" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85" />
            <path d="M 278 410 Q 282 470 286 495" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85" />
            
            <!-- Developer Insignia </ > -->
            <text x="250" y="525" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#2261e9" letter-spacing="3">&lt;/&gt;</text>
          </g>

          <!-- 2. NECK -->
          <path id="mascot-neck" d="M 206 345 L 206 415 C 226 430, 274 430, 294 415 L 294 345 Z" fill="url(#skin-gradient)" />
          <path d="M 206 345 L 206 415 C 226 430, 274 430, 294 415 L 294 345 Z" fill="url(#halftone-dither)" opacity="0.35" />

          <!-- 3. HEAD GROUP (Rotates and tilts smoothly based on expression) -->
          <g id="mascot-head" class="mascot-head-group" style="transform-origin: 250px 360px; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
            
            <!-- Ears -->
            <ellipse cx="148" cy="245" rx="16" ry="22" fill="url(#skin-gradient)" />
            <ellipse cx="148" cy="245" rx="16" ry="22" fill="url(#halftone-dither)" opacity="0.4" />
            <ellipse cx="352" cy="245" rx="16" ry="22" fill="url(#skin-gradient)" />
            <ellipse cx="352" cy="245" rx="16" ry="22" fill="url(#halftone-dither)" opacity="0.4" />

            <!-- Face Shape Base -->
            <path id="mascot-face-skin" d="M 160 195 C 160 125, 340 125, 340 195 C 340 295, 320 370, 250 375 C 180 370, 160 295, 160 195 Z" fill="url(#skin-gradient)" />
            <path d="M 160 195 C 160 125, 340 125, 340 195 C 340 295, 320 370, 250 375 C 180 370, 160 295, 160 195 Z" fill="url(#halftone-dither)" opacity="0.35" />

            <!-- Hair (Textured Modern Quiff with Fade) -->
            <path id="mascot-hair" d="M 148 215 C 144 140, 172 85, 250 82 C 322 78, 356 125, 352 215 C 334 175, 312 155, 280 155 C 235 155, 210 180, 148 215 Z" fill="#18181b" />
            <path d="M 148 215 C 144 140, 172 85, 250 82 C 322 78, 356 125, 352 215 C 334 175, 312 155, 280 155 C 235 155, 210 180, 148 215 Z" fill="url(#dense-dither)" opacity="0.65" />

            <!-- Eyebrows -->
            <path id="eyebrow-left" d="M 190 200 Q 215 192 235 202" stroke="#18181b" stroke-width="6.5" stroke-linecap="round" fill="none" style="transition: transform 0.3s ease;" />
            <path id="eyebrow-right" d="M 265 202 Q 285 192 310 200" stroke="#18181b" stroke-width="6.5" stroke-linecap="round" fill="none" style="transition: transform 0.3s ease;" />

            <!-- 4. EYES (Clean Friendly Almond/Pill Eyes with Pupil Gaze & Blinking) -->
            <g id="mascot-eyes">
              <!-- Left Eye Socket -->
              <ellipse id="eye-white-left" cx="212" cy="235" rx="20" ry="22" fill="#ffffff" stroke="#18181b" stroke-width="1.8" />
              <!-- Right Eye Socket -->
              <ellipse id="eye-white-right" cx="288" cy="235" rx="20" ry="22" fill="#ffffff" stroke="#18181b" stroke-width="1.8" />

              <!-- Left Pupil -->
              <g id="left-pupil" class="pupil-group">
                <circle cx="212" cy="236" r="13.5" fill="#0f172a" />
                <!-- Catchlights -->
                <circle cx="208" cy="231" r="4.2" fill="#ffffff" />
                <circle cx="216" cy="240" r="2" fill="#ffffff" />
              </g>

              <!-- Right Pupil -->
              <g id="right-pupil" class="pupil-group">
                <circle cx="288" cy="236" r="13.5" fill="#0f172a" />
                <!-- Catchlights -->
                <circle cx="284" cy="231" r="4.2" fill="#ffffff" />
                <circle cx="292" cy="240" r="2" fill="#ffffff" />
              </g>

              <!-- Eyelids for Natural Blinking -->
              <ellipse id="eyelid-left" class="mascot-eyelid" cx="212" cy="235" rx="21" ry="23" fill="url(#skin-gradient)" style="transform-origin: 212px 235px; transform: scaleY(0);" />
              <ellipse id="eyelid-right" class="mascot-eyelid" cx="288" cy="235" rx="21" ry="23" fill="url(#skin-gradient)" style="transform-origin: 288px 235px; transform: scaleY(0);" />
            </g>

            <!-- 5. KHALID'S SIGNATURE SLEEK DOUBLE-BRIDGE AVIATOR GLASSES -->
            <g id="mascot-glasses" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.3))">
              <!-- Left Rim (Sleek Aviator Squarish-Round) -->
              <rect x="178" y="206" width="68" height="60" rx="17" fill="none" stroke="#09090b" stroke-width="3.5" />
              <!-- Left Lens Glare Reflection -->
              <rect x="180" y="208" width="64" height="56" rx="15" fill="url(#lens-glare)" />

              <!-- Right Rim -->
              <rect x="254" y="206" width="68" height="60" rx="17" fill="none" stroke="#09090b" stroke-width="3.5" />
              <!-- Right Lens Glare Reflection -->
              <rect x="256" y="208" width="64" height="56" rx="15" fill="url(#lens-glare)" />

              <!-- Center Nose Bridge -->
              <path d="M 246 234 Q 250 230 254 234" stroke="#09090b" stroke-width="3.5" stroke-linecap="round" fill="none" />
              <!-- Top Aviator Brow Bar (Double Bridge) -->
              <line x1="190" y1="206" x2="310" y2="206" stroke="#09090b" stroke-width="3.5" stroke-linecap="round" />
              <!-- Temple arms extending to ears -->
              <line x1="178" y1="228" x2="152" y2="242" stroke="#09090b" stroke-width="3" stroke-linecap="round" />
              <line x1="322" y1="228" x2="348" y2="242" stroke="#09090b" stroke-width="3" stroke-linecap="round" />
            </g>

            <!-- Nose -->
            <path d="M 247 258 Q 250 274 253 274 Q 256 274 256 266" stroke="#c49070" stroke-width="3.5" stroke-linecap="round" fill="none" />

            <!-- 6. KHALID'S GROOMED BEARD & MUSTACHE (Halftone Swiss Dither) -->
            <g id="mascot-beard">
              <!-- Full Beard outline covering jawline & chin -->
              <path d="M 160 250 C 158 335, 185 375, 250 378 C 315 375, 342 335, 340 250 C 330 295, 305 330, 250 332 C 195 330, 170 295, 160 250 Z" fill="#18181b" />
              <path d="M 160 250 C 158 335, 185 375, 250 378 C 315 375, 342 335, 340 250 C 330 295, 305 330, 250 332 C 195 330, 170 295, 160 250 Z" fill="url(#dense-dither)" opacity="0.75" />

              <!-- Sculpted Mustache -->
              <path d="M 220 294 Q 250 286 280 294 Q 250 307 220 294 Z" fill="#18181b" />
              <path d="M 220 294 Q 250 286 280 294 Q 250 307 220 294 Z" fill="url(#dense-dither)" opacity="0.7" />
              
              <!-- Soul Patch -->
              <ellipse cx="250" cy="336" rx="5" ry="4" fill="#18181b" />
            </g>

            <!-- 7. TALKING MOUTH (Real-Time Animated Lip-Sync with Teeth & Tongue) -->
            <g id="mascot-mouth-container">
              <!-- Mouth Interior Cavity -->
              <path id="mouth-cavity" d="M 224 308 Q 250 338 276 308 Q 250 316 224 308 Z" fill="#1e1014" stroke="#09090b" stroke-width="2.5" />
              <!-- White Upper Teeth -->
              <path id="mouth-teeth" d="M 228 309 Q 250 318 272 309 L 270 316 Q 250 322 230 316 Z" fill="#ffffff" />
              <!-- Pink Tongue -->
              <path id="mouth-tongue" d="M 236 330 Q 250 324 264 330 Q 250 336 236 330 Z" fill="#f43f5e" />
            </g>
          </g>

          <!-- 8. VOLUMETRIC 3D SHADED & DITHERED ARMS + HANDS (Zero cartoon outlines, authentic sebg.ch 3D render anatomy) -->
          <g id="mascot-hands-layer">

            <!-- POSE A: POINT RIGHT (Used when character is on Left: CleanVid, FluxRip) -->
            <g id="gesture-point-right" class="rig-gesture-group gesture-active">
              <g class="gesture-kinetic-point-right" style="transform-origin: 410px 520px;">
                <!-- Seamless Outer Right Shoulder -> Bent Elbow -> Extended 3D Forearm Cylinder -->
                <path d="M 375 438 C 415 455, 442 488, 456 508 L 490 450 C 506 458, 518 474, 508 492 L 464 562 C 452 578, 434 580, 412 580 L 365 580 Z" fill="url(#hoodie-grad)" />
                <path d="M 375 438 C 415 455, 442 488, 456 508 L 490 450 C 506 458, 518 474, 508 492 L 464 562 C 452 578, 434 580, 412 580 L 365 580 Z" fill="url(#halftone-dither)" opacity="0.65" />
                <!-- Soft 3D inner elbow fold shading -->
                <path d="M 432 486 Q 448 504 458 504" stroke="#090d16" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.4" />

                <!-- 3D Rolled Wrist Cuff & Sculpted Pointing Hand -->
                <g transform="translate(496, 466) rotate(-28)">
                  <!-- Ambient occlusion shadow under cuff -->
                  <ellipse cx="-8" cy="2" rx="12" ry="28" fill="#060911" opacity="0.45" />
                  <!-- Plush 3D Rolled Cuff Torus -->
                  <rect x="-16" y="-26" width="22" height="52" rx="11" fill="url(#cuff-roll-3d)" />
                  <rect x="-16" y="-26" width="22" height="52" rx="11" fill="url(#halftone-dither)" opacity="0.32" />
                  <!-- Dark inner cuff opening -->
                  <ellipse cx="4" cy="0" rx="5" ry="20" fill="#475569" />

                  <!-- Stepped 3D Curled Fingers (Pinky, Ring, Middle tucked underneath with AO separation) -->
                  <rect x="14" y="12" width="28" height="13" rx="6.5" fill="#8c5438" opacity="0.45" />
                  <rect x="12" y="10" width="28" height="12.5" rx="6.2" fill="url(#curled-finger-3d)" />
                  <rect x="18" y="2" width="33" height="13.5" rx="6.7" fill="#8c5438" opacity="0.45" />
                  <rect x="16" y="0" width="33" height="13" rx="6.5" fill="url(#curled-finger-3d)" />
                  <rect x="20" y="-9" width="37" height="14" rx="7" fill="#8c5438" opacity="0.45" />
                  <rect x="18" y="-11" width="37" height="13.5" rx="6.7" fill="url(#curled-finger-3d)" />

                  <!-- Extended 3D Index Finger (Anatomical phalanx taper + cylindrical lighting) -->
                  <path d="M 12 -24 L 72 -24 C 80 -24, 84 -20, 84 -15.5 C 84 -11, 80 -7, 72 -7 L 14 -6 Z" fill="url(#finger-cyl-h)" />
                  <ellipse cx="75" cy="-16.5" rx="5.5" ry="4" fill="#fdebd9" opacity="0.55" />

                  <!-- Volumetric 3D Palm / Hand Body -->
                  <path d="M 0 -22 C 12 -26, 28 -25, 36 -16 C 40 -4, 36 16, 22 22 C 10 25, 0 20, -2 12 Z" fill="url(#palm-3d-grad)" />
                  <path d="M 4 -10 C 14 -12, 24 -6, 24 6 C 24 14, 14 18, 4 14 Z" fill="url(#palm-hollow-ao)" />

                  <!-- Opposable 3D Thumb & Plump Thenar Pad -->
                  <g transform="translate(18, -16) rotate(-22)">
                    <ellipse cx="4" cy="4" rx="16" ry="11" fill="#8c5438" opacity="0.32" />
                    <path d="M -10 -6 C -6 -13, 14 -13, 24 -7 C 30 -3, 30 5, 23 8 C 14 11, -4 10, -10 4 Z" fill="url(#thenar-pad-grad)" />
                  </g>

                  <!-- Unified Halftone Dither across entire 3D hand -->
                  <path d="M 0 -25 L 74 -25 C 82 -25, 85 -20, 85 -15 C 85 -10, 80 -6, 72 -6 L 55 -6 C 56 4, 52 14, 42 22 C 28 26, 8 25, -2 16 Z" fill="url(#halftone-dither)" opacity="0.34" />
                </g>
              </g>
            </g>

            <!-- POSE B: POINT LEFT (Mirror for when character is on Right: Kabir Bazaar, Selected Works) -->
            <g id="gesture-point-left" class="rig-gesture-group">
              <g transform="translate(500, 0) scale(-1, 1)">
                <g class="gesture-kinetic-point-right" style="transform-origin: 410px 520px;">
                  <path d="M 375 438 C 415 455, 442 488, 456 508 L 490 450 C 506 458, 518 474, 508 492 L 464 562 C 452 578, 434 580, 412 580 L 365 580 Z" fill="url(#hoodie-grad)" />
                  <path d="M 375 438 C 415 455, 442 488, 456 508 L 490 450 C 506 458, 518 474, 508 492 L 464 562 C 452 578, 434 580, 412 580 L 365 580 Z" fill="url(#halftone-dither)" opacity="0.65" />
                  <path d="M 432 486 Q 448 504 458 504" stroke="#090d16" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.4" />

                  <g transform="translate(496, 466) rotate(-28)">
                    <ellipse cx="-8" cy="2" rx="12" ry="28" fill="#060911" opacity="0.45" />
                    <rect x="-16" y="-26" width="22" height="52" rx="11" fill="url(#cuff-roll-3d)" />
                    <rect x="-16" y="-26" width="22" height="52" rx="11" fill="url(#halftone-dither)" opacity="0.32" />
                    <ellipse cx="4" cy="0" rx="5" ry="20" fill="#475569" />

                    <rect x="14" y="12" width="28" height="13" rx="6.5" fill="#8c5438" opacity="0.45" />
                    <rect x="12" y="10" width="28" height="12.5" rx="6.2" fill="url(#curled-finger-3d)" />
                    <rect x="18" y="2" width="33" height="13.5" rx="6.7" fill="#8c5438" opacity="0.45" />
                    <rect x="16" y="0" width="33" height="13" rx="6.5" fill="url(#curled-finger-3d)" />
                    <rect x="20" y="-9" width="37" height="14" rx="7" fill="#8c5438" opacity="0.45" />
                    <rect x="18" y="-11" width="37" height="13.5" rx="6.7" fill="url(#curled-finger-3d)" />

                    <path d="M 12 -24 L 72 -24 C 80 -24, 84 -20, 84 -15.5 C 84 -11, 80 -7, 72 -7 L 14 -6 Z" fill="url(#finger-cyl-h)" />
                    <ellipse cx="75" cy="-16.5" rx="5.5" ry="4" fill="#fdebd9" opacity="0.55" />

                    <path d="M 0 -22 C 12 -26, 28 -25, 36 -16 C 40 -4, 36 16, 22 22 C 10 25, 0 20, -2 12 Z" fill="url(#palm-3d-grad)" />
                    <path d="M 4 -10 C 14 -12, 24 -6, 24 6 C 24 14, 14 18, 4 14 Z" fill="url(#palm-hollow-ao)" />

                    <g transform="translate(18, -16) rotate(-22)">
                      <ellipse cx="4" cy="4" rx="16" ry="11" fill="#8c5438" opacity="0.32" />
                      <path d="M -10 -6 C -6 -13, 14 -13, 24 -7 C 30 -3, 30 5, 23 8 C 14 11, -4 10, -10 4 Z" fill="url(#thenar-pad-grad)" />
                    </g>

                    <path d="M 0 -25 L 74 -25 C 82 -25, 85 -20, 85 -15 C 85 -10, 80 -6, 72 -6 L 55 -6 C 56 4, 52 14, 42 22 C 28 26, 8 25, -2 16 Z" fill="url(#halftone-dither)" opacity="0.34" />
                  </g>
                </g>
              </g>
            </g>

            <!-- POSE C: FRIENDLY WAVE (Hero & Contact — matches sebg.ch frame_01 & frame_33) -->
            <!-- Arm extends OUTSIDE the left shoulder into open space with bent elbow, 3D rolled cuff, and plump 3D open hand -->
            <g id="gesture-wave" class="rig-gesture-group">
              <g class="gesture-kinetic-wave" style="transform-origin: 85px 520px;">
                <!-- Seamless Outer Left Shoulder -> Bent Elbow -> Full-Volume Raised 3D Forearm -->
                <path d="M 125 438 C 85 455, 58 492, 46 516 L 12 406 C -6 410, -24 422, -18 442 L 22 562 C 32 578, 52 580, 82 580 L 135 580 Z" fill="url(#hoodie-grad)" />
                <path d="M 125 438 C 85 455, 58 492, 46 516 L 12 406 C -6 410, -24 422, -18 442 L 22 562 C 32 578, 52 580, 82 580 L 135 580 Z" fill="url(#halftone-dither)" opacity="0.65" />
                <!-- Soft 3D inner elbow fold shading -->
                <path d="M 66 492 Q 52 508 42 508" stroke="#090d16" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.4" />

                <!-- 3D Rolled Cuff + Volumetric Open Waving Palm & 5 Sculpted Fingers -->
                <g class="gesture-hand-waving-palm" style="transform-origin: -4px 412px;">
                  <g transform="translate(-4, 412) rotate(-20)">
                    <!-- Wrist Stem connecting into Cuff -->
                    <rect x="-18" y="-22" width="36" height="22" rx="10" fill="url(#palm-3d-grad)" />

                    <!-- 4 Individual 3D Cylindrical Fingers fanned along natural metacarpal arch -->
                    <!-- Pinky Finger (outer left) -->
                    <g transform="translate(-21, -50) rotate(-14)">
                      <rect x="-6.5" y="-36" width="13" height="40" rx="6.5" fill="url(#finger-cyl-v)" />
                      <rect x="-6.5" y="-36" width="13" height="40" rx="6.5" fill="url(#halftone-dither)" opacity="0.3" />
                      <ellipse cx="-1" cy="-30" rx="3.5" ry="4" fill="#fdebd9" opacity="0.45" />
                    </g>
                    <!-- Ring Finger -->
                    <g transform="translate(-8, -56) rotate(-5)">
                      <rect x="-7" y="-45" width="14" height="49" rx="7" fill="url(#finger-cyl-v)" />
                      <rect x="-7" y="-45" width="14" height="49" rx="7" fill="url(#halftone-dither)" opacity="0.3" />
                      <ellipse cx="-1" cy="-38" rx="3.8" ry="4.5" fill="#fdebd9" opacity="0.45" />
                    </g>
                    <!-- Middle Finger (tallest) -->
                    <g transform="translate(6, -58) rotate(3)">
                      <rect x="-7.4" y="-50" width="14.8" height="54" rx="7.4" fill="url(#finger-cyl-v)" />
                      <rect x="-7.4" y="-50" width="14.8" height="54" rx="7.4" fill="url(#halftone-dither)" opacity="0.3" />
                      <ellipse cx="-1" cy="-43" rx="4" ry="4.5" fill="#fdebd9" opacity="0.45" />
                    </g>
                    <!-- Index Finger -->
                    <g transform="translate(20, -53) rotate(11)">
                      <rect x="-7" y="-43" width="14" height="47" rx="7" fill="url(#finger-cyl-v)" />
                      <rect x="-7" y="-43" width="14" height="47" rx="7" fill="url(#halftone-dither)" opacity="0.3" />
                      <ellipse cx="-1" cy="-36" rx="3.8" ry="4.5" fill="#fdebd9" opacity="0.45" />
                    </g>

                    <!-- Soft 3D Inter-digital Webbing Ambient Occlusion Shadows -->
                    <ellipse cx="-15" cy="-54" rx="3.2" ry="7" fill="#8c5438" opacity="0.42" transform="rotate(-10 -15 -54)" />
                    <ellipse cx="-1" cy="-59" rx="3.2" ry="7.5" fill="#8c5438" opacity="0.42" transform="rotate(-1 -1 -59)" />
                    <ellipse cx="13" cy="-57" rx="3.2" ry="7" fill="#8c5438" opacity="0.42" transform="rotate(7 13 -57)" />

                    <!-- Plump 3D Palm Cushion -->
                    <path d="M -27 -48 C -29 -62, 29 -62, 28 -46 C 30 -24, 22 -8, 0 -8 C -21 -8, -28 -24, -27 -48 Z" fill="url(#palm-3d-grad)" />
                    <ellipse cx="0" cy="-34" rx="18" ry="16" fill="url(#palm-hollow-ao)" />
                    <ellipse cx="-14" cy="-28" rx="11" ry="16" fill="url(#thenar-pad-grad)" opacity="0.72" />

                    <!-- Opposable 3D Thumb & Muscular Thenar Mound -->
                    <g transform="translate(22, -28) rotate(38)">
                      <ellipse cx="-5" cy="2" rx="12" ry="16" fill="#8c5438" opacity="0.35" />
                      <path d="M -8 -30 C -8 -38, 8 -38, 8 -30 L 11 4 C 11 14, -11 14, -11 4 Z" fill="url(#finger-cyl-v)" />
                      <path d="M -8 -30 C -8 -38, 8 -38, 8 -30 L 11 4 C 11 14, -11 14, -11 4 Z" fill="url(#halftone-dither)" opacity="0.3" />
                      <ellipse cx="-1" cy="-28" rx="3.8" ry="4.5" fill="#fdebd9" opacity="0.45" />
                    </g>
                    <!-- Plump Thenar Pad Highlight -->
                    <ellipse cx="12" cy="-24" rx="14" ry="16" fill="url(#thenar-pad-grad)" opacity="0.88" />

                    <!-- Halftone Dither across Palm -->
                    <path d="M -27 -48 C -29 -62, 29 -62, 28 -46 C 30 -24, 22 -8, 0 -8 C -21 -8, -28 -24, -27 -48 Z" fill="url(#halftone-dither)" opacity="0.32" />

                    <!-- Subtle 3D Phalanx Joint Crease Shading -->
                    <path d="M -18 -46 Q 0 -52 18 -45" stroke="#9c6244" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.28" />
                    <path d="M -10 -34 Q 4 -36 14 -24" stroke="#9c6244" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.32" />

                    <!-- Plush 3D Rolled Sleeve Cuff Wrapping the Wrist -->
                    <ellipse cx="0" cy="4" rx="28" ry="11" fill="#060911" opacity="0.4" />
                    <rect x="-27" y="-10" width="54" height="21" rx="10.5" fill="url(#cuff-roll-3d)" />
                    <rect x="-27" y="-10" width="54" height="21" rx="10.5" fill="url(#halftone-dither)" opacity="0.32" />
                  </g>
                </g>
              </g>
            </g>

            <!-- POSE D: THOUGHTFUL CHIN POSE (Used on Bio, Experience, Skills — matches sebg.ch frame_13 & frame_14) -->
            <g id="gesture-think" class="rig-gesture-group">
              <g class="gesture-kinetic-think" style="transform-origin: 350px 540px;">
                <!-- Seamless Right Forearm rising from lower-right elbow up toward chin -->
                <path d="M 342 580 C 336 525, 316 472, 292 426 L 336 410 C 362 458, 386 518, 398 580 Z" fill="url(#hoodie-grad)" />
                <path d="M 342 580 C 336 525, 316 472, 292 426 L 336 410 C 362 458, 386 518, 398 580 Z" fill="url(#halftone-dither)" opacity="0.65" />

                <!-- 3D Rolled Cuff & Natural Hand Resting Thoughtfully at Chin/Beard -->
                <g transform="translate(312, 416) rotate(-18)">
                  <!-- Extended 3D Index Finger resting upwards along right jawline/beard -->
                  <g transform="translate(-8, -32) rotate(-12)">
                    <rect x="-7" y="-42" width="14" height="46" rx="7" fill="url(#finger-cyl-v)" />
                    <rect x="-7" y="-42" width="14" height="46" rx="7" fill="url(#halftone-dither)" opacity="0.3" />
                    <ellipse cx="-1" cy="-35" rx="3.8" ry="4" fill="#fdebd9" opacity="0.48" />
                  </g>

                  <!-- Opposable 3D Thumb tucked horizontally under the chin -->
                  <g transform="translate(-18, -28) rotate(-68)">
                    <rect x="-6.5" y="-34" width="13" height="38" rx="6.5" fill="url(#finger-cyl-v)" />
                    <rect x="-6.5" y="-34" width="13" height="38" rx="6.5" fill="url(#halftone-dither)" opacity="0.3" />
                  </g>

                  <!-- Softly Curled Middle, Ring, & Pinky Fingers in Natural Stepped 3D Arch -->
                  <g transform="translate(5, -36) rotate(8)">
                    <rect x="-6.5" y="-26" width="13.5" height="32" rx="6.7" fill="url(#curled-finger-3d)" />
                    <rect x="-6.5" y="-26" width="13.5" height="32" rx="6.7" fill="url(#halftone-dither)" opacity="0.3" />
                  </g>
                  <g transform="translate(15, -32) rotate(16)">
                    <rect x="-6.2" y="-23" width="13" height="29" rx="6.5" fill="url(#curled-finger-3d)" />
                    <rect x="-6.2" y="-23" width="13" height="29" rx="6.5" fill="url(#halftone-dither)" opacity="0.3" />
                  </g>
                  <g transform="translate(24, -26) rotate(24)">
                    <rect x="-5.8" y="-19" width="12" height="25" rx="6" fill="url(#curled-finger-3d)" />
                    <rect x="-5.8" y="-19" width="12" height="25" rx="6" fill="url(#halftone-dither)" opacity="0.3" />
                  </g>

                  <!-- Soft AO shadows between curled fingers -->
                  <ellipse cx="0" cy="-42" rx="2.5" ry="7" fill="#8c5438" opacity="0.38" />
                  <ellipse cx="11" cy="-38" rx="2.5" ry="6.5" fill="#8c5438" opacity="0.38" />
                  <ellipse cx="20" cy="-32" rx="2.5" ry="6" fill="#8c5438" opacity="0.38" />

                  <!-- Sculpted 3D Dorsal Hand / Palm Cushion -->
                  <path d="M -22 -30 C -20 -46, 24 -44, 26 -24 C 28 -8, 18 0, 0 0 C -16 0, -24 -12, -22 -30 Z" fill="url(#palm-3d-grad)" />
                  <path d="M -22 -30 C -20 -46, 24 -44, 26 -24 C 28 -8, 18 0, 0 0 C -16 0, -24 -12, -22 -30 Z" fill="url(#halftone-dither)" opacity="0.32" />

                  <!-- Plush 3D Rolled Sleeve Cuff -->
                  <ellipse cx="0" cy="6" rx="27" ry="10" fill="#060911" opacity="0.42" />
                  <rect x="-26" y="-8" width="52" height="20" rx="10" fill="url(#cuff-roll-3d)" />
                  <rect x="-26" y="-8" width="52" height="20" rx="10" fill="url(#halftone-dither)" opacity="0.32" />
                </g>
              </g>
            </g>

          </g>
        </g>
      </svg>
    `;
  }

  cacheElements() {
    this.svg = this.container.querySelector('.khalid-svg-rig');
    this.leftPupil = this.container.querySelector('#left-pupil');
    this.rightPupil = this.container.querySelector('#right-pupil');
    this.mouthCavity = this.container.querySelector('#mouth-cavity');
    this.mouthTeeth = this.container.querySelector('#mouth-teeth');
    this.mouthTongue = this.container.querySelector('#mouth-tongue');
    this.eyelids = [
      this.container.querySelector('#eyelid-left'),
      this.container.querySelector('#eyelid-right')
    ];
    this.headGroup = this.container.querySelector('#mascot-head');
    this.eyebrowLeft = this.container.querySelector('#eyebrow-left');
    this.eyebrowRight = this.container.querySelector('#eyebrow-right');
    this.eyesGroup = this.container.querySelector('#mascot-eyes');
    this.glassesGroup = this.container.querySelector('#mascot-glasses');
    this.mouthContainer = this.container.querySelector('#mascot-mouth-container');
    this.beardGroup = this.container.querySelector('#mascot-beard');

    this.gestureGroups = {
      'point-right': this.container.querySelector('#gesture-point-right'),
      'point-left': this.container.querySelector('#gesture-point-left'),
      'wave': this.container.querySelector('#gesture-wave'),
      'think': this.container.querySelector('#gesture-think')
    };

    [this.eyesGroup, this.glassesGroup, this.mouthContainer, this.beardGroup].forEach(el => {
      if (el) el.style.transition = 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    this.setGesture('wave', 'right');
  }

  // Mouth Shapes for dynamic talking lip-sync
  setMouthShape(type) {
    if (!this.mouthCavity || !this.mouthTeeth || !this.mouthTongue) return;
    this.currentMouth = type;

    switch (type) {
      case 'smile': // Friendly resting smile
        this.mouthCavity.setAttribute('d', 'M 224 308 Q 250 338 276 308 Q 250 316 224 308 Z');
        this.mouthTeeth.setAttribute('d', 'M 228 309 Q 250 318 272 309 L 270 316 Q 250 322 230 316 Z');
        this.mouthTeeth.style.opacity = '1';
        this.mouthTongue.setAttribute('d', 'M 236 330 Q 250 324 264 330 Q 250 336 236 330 Z');
        this.mouthTongue.style.opacity = '1';
        break;

      case 'talk-open': // Wide open speaking vowel
        this.mouthCavity.setAttribute('d', 'M 218 305 Q 250 292 282 305 Q 288 350 250 352 Q 212 350 218 305 Z');
        this.mouthTeeth.setAttribute('d', 'M 224 306 Q 250 314 276 306 L 274 318 Q 250 324 226 318 Z');
        this.mouthTeeth.style.opacity = '1';
        this.mouthTongue.setAttribute('d', 'M 230 342 Q 250 330 270 342 Q 250 350 230 342 Z');
        this.mouthTongue.style.opacity = '1';
        break;

      case 'talk-mid': // Moderate speech shape
        this.mouthCavity.setAttribute('d', 'M 222 307 Q 250 340 278 307 Q 250 314 222 307 Z');
        this.mouthTeeth.setAttribute('d', 'M 226 308 Q 250 316 274 308 L 272 316 Q 250 320 228 316 Z');
        this.mouthTeeth.style.opacity = '1';
        this.mouthTongue.setAttribute('d', 'M 236 332 Q 250 326 264 332 Q 250 338 236 332 Z');
        this.mouthTongue.style.opacity = '1';
        break;

      case 'oh': // Rounded expressive 'O' shape
        this.mouthCavity.setAttribute('d', 'M 234 308 C 228 328, 228 340, 250 342 C 272 340, 272 328, 266 308 C 255 304, 245 304, 234 308 Z');
        this.mouthTeeth.setAttribute('d', 'M 238 309 Q 250 315 262 309 L 260 314 Q 250 318 240 314 Z');
        this.mouthTeeth.style.opacity = '1';
        this.mouthTongue.style.opacity = '0';
        break;

      case 'laugh': // Cheerful big laugh
        this.mouthCavity.setAttribute('d', 'M 214 306 Q 250 358 286 306 Q 250 310 214 306 Z');
        this.mouthTeeth.setAttribute('d', 'M 220 307 Q 250 320 280 307 L 276 320 Q 250 326 224 320 Z');
        this.mouthTeeth.style.opacity = '1';
        this.mouthTongue.setAttribute('d', 'M 228 344 Q 250 330 272 344 Q 250 354 228 344 Z');
        this.mouthTongue.style.opacity = '1';
        break;
    }
  }

  // Animate speech lip-sync
  speak(durationMs = 3200) {
    if (this.talkInterval) clearInterval(this.talkInterval);
    this.isTalking = true;

    const shapes = ['talk-mid', 'talk-open', 'talk-mid', 'oh', 'smile', 'talk-open', 'talk-mid'];
    let idx = 0;

    this.talkInterval = setInterval(() => {
      this.setMouthShape(shapes[idx % shapes.length]);
      idx++;
    }, 110);

    setTimeout(() => {
      this.stopSpeaking();
    }, durationMs);
  }

  stopSpeaking() {
    if (this.talkInterval) {
      clearInterval(this.talkInterval);
      this.talkInterval = null;
    }
    this.isTalking = false;
    this.setMouthShape('smile');
  }

  // Blinking loop
  startBlinkLoop() {
    const doBlink = () => {
      this.eyelids.forEach(el => {
        if (el) el.style.transform = 'scaleY(1)';
      });

      setTimeout(() => {
        this.eyelids.forEach(el => {
          if (el) el.style.transform = 'scaleY(0)';
        });
      }, 120);

      const nextDelay = 2500 + Math.random() * 3000;
      setTimeout(doBlink, nextDelay);
    };

    setTimeout(doBlink, 1800);
  }

  // Lock gaze on specific coordinates for a set duration (e.g. looking at new project mockups)
  lockGaze(targetX, targetY, duration = 1800) {
    this.gazeLocked = true;
    this.targetGazeX = targetX;
    this.targetGazeY = targetY;
    clearTimeout(this.gazeLockTimer);
    this.gazeLockTimer = setTimeout(() => {
      this.gazeLocked = false;
    }, duration);
  }

  // Gaze Tracking (Eyes follow mouse cursor smoothly)
  updateGaze(mouseX, mouseY) {
    if (this.gazeLocked) return;
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.4;

    const deltaX = (mouseX - centerX) / (window.innerWidth * 0.5);
    const deltaY = (mouseY - centerY) / (window.innerHeight * 0.5);

    // Limit maximum pupil offset within the eye socket
    this.targetGazeX = Math.max(-7.5, Math.min(7.5, deltaX * 7.5));
    this.targetGazeY = Math.max(-6, Math.min(6, deltaY * 6));
  }

  startGazeLoop() {
    const loop = () => {
      // Lerp pupil translation
      this.gazeX += (this.targetGazeX - this.gazeX) * 0.12;
      this.gazeY += (this.targetGazeY - this.gazeY) * 0.12;

      if (this.leftPupil && this.rightPupil) {
        this.leftPupil.style.transform = `translate(${this.gazeX.toFixed(1)}px, ${this.gazeY.toFixed(1)}px)`;
        this.rightPupil.style.transform = `translate(${this.gazeX.toFixed(1)}px, ${this.gazeY.toFixed(1)}px)`;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  activateHandGesture(poseKey) {
    if (!this.gestureGroups) return;
    Object.entries(this.gestureGroups).forEach(([key, group]) => {
      if (!group) return;
      if (key === poseKey) {
        group.classList.add('gesture-active');
      } else {
        group.classList.remove('gesture-active');
      }
    });
  }

  // 2.5D Head & Facial Parallax Turn while walking across the stage (sebg.ch choreography)
  setWalkingTurn(direction) {
    if (!this.headGroup) return;
    if (direction === 'left' || direction === 'right') {
      const sign = direction === 'right' ? 1 : -1;
      this.headGroup.style.transform = `translateX(${sign * 10}px) rotate(${sign * 4.5}deg) translateY(-3px)`;
      if (this.eyesGroup) this.eyesGroup.style.transform = `translateX(${sign * 10}px)`;
      if (this.glassesGroup) this.glassesGroup.style.transform = `translateX(${sign * 11}px)`;
      if (this.mouthContainer) this.mouthContainer.style.transform = `translateX(${sign * 8}px)`;
      if (this.beardGroup) this.beardGroup.style.transform = `translateX(${sign * 5}px)`;
      this.lockGaze(sign * 6.5, -0.5, 650);
      // Lead with pointing hand in walking direction (sebg.ch walk pose)
      this.activateHandGesture(direction === 'right' ? 'point-right' : 'point-left');
    } else {
      if (this.eyesGroup) this.eyesGroup.style.transform = 'translateX(0px)';
      if (this.glassesGroup) this.glassesGroup.style.transform = 'translateX(0px)';
      if (this.mouthContainer) this.mouthContainer.style.transform = 'translateX(0px)';
      if (this.beardGroup) this.beardGroup.style.transform = 'translateX(0px)';
    }
  }

  // Expression, Head Posture & Sculpted 3D Hand Gestures
  setGesture(type, side = 'right') {
    this.currentGesture = type;
    if (!this.headGroup) return;

    if (type === 'wave') {
      // Cheerful upright head + friendly waving hand
      this.headGroup.style.transform = 'rotate(0deg) translateY(0px)';
      if (this.eyebrowLeft && this.eyebrowRight) {
        this.eyebrowLeft.style.transform = 'translateY(-2px)';
        this.eyebrowRight.style.transform = 'translateY(-2px)';
      }
      this.activateHandGesture('wave');
    } else if (type === 'think') {
      // Curious thoughtful head tilt + chin thinking hand (Bio, Experience, Skills)
      this.headGroup.style.transform = 'rotate(-3deg) translateY(-2px)';
      if (this.eyebrowLeft && this.eyebrowRight) {
        this.eyebrowLeft.style.transform = 'translateY(-3px)';
        this.eyebrowRight.style.transform = 'translateY(1px)';
      }
      this.activateHandGesture('think');
    } else if (type === 'point') {
      // Attentive head orientation + pointing hand directed at project devices!
      const rot = side === 'left' ? '3deg' : '-3deg';
      this.headGroup.style.transform = `rotate(${rot}) translateY(0px)`;
      if (this.eyebrowLeft && this.eyebrowRight) {
        this.eyebrowLeft.style.transform = 'translateY(0px)';
        this.eyebrowRight.style.transform = 'translateY(0px)';
      }
      // If character is on Left, devices are on Right -> point-right; if on Right -> point-left
      this.activateHandGesture(side === 'left' ? 'point-right' : 'point-left');
    } else {
      this.headGroup.style.transform = 'rotate(0deg) translateY(0px)';
      this.activateHandGesture('wave');
    }
  }

  triggerTrick() {
    this.setMouthShape('laugh');
    setTimeout(() => {
      this.setMouthShape('smile');
    }, 2200);
  }
}
