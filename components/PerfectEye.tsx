"use client";

import { useId } from "react";

/**
 * THE EYE OF PERFECT PROPORTIONS (Φ = 1.618)
 *
 * Classical divine proportion & sacred geometry ocular system:
 * - Vesica Piscis curvature adhering to golden ratio harmonic arcs
 * - Iris collarette, pupillary zone, and limbal ring calibrated to powers of Φ
 * - 64 procedural radial ciliary fibers with multi-tonal depth
 * - Double corneal specular reflection catching light with 3D depth
 * - Hypnotic continuous 10s looping gaze cycle with accommodation dilation & natural blinks
 * - Architectural hairline construction guides (harmonic circles, optic axes, phi notation)
 */
export function PerfectEye({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "_");

  // 64 intricate radial iris fibers with mathematical angles & varied opacity
  const irisFibers = Array.from({ length: 64 }, (_, i) => {
    const angle = (i * 360) / 64;
    const rad = (angle * Math.PI) / 180;
    const innerR = 30 + ((i % 5) * 2);
    const outerR = 86 - ((i % 3) * 3);
    const x1 = Math.cos(rad) * innerR;
    const y1 = Math.sin(rad) * innerR;
    const x2 = Math.cos(rad) * outerR;
    const y2 = Math.sin(rad) * outerR;
    const opacity = (0.2 + ((i % 7) * 0.1)).toFixed(2);
    const strokeWidth = i % 4 === 0 ? "1.2" : "0.7";
    return { id: i, x1, y1, x2, y2, opacity, strokeWidth };
  });

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-label="Eye of Perfect Proportions"
    >
      <svg
        viewBox="0 0 640 640"
        className="w-full h-auto max-w-[540px] max-h-[540px] drop-shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Eyeball Sclera Gradient: Crisp white with delicate curvature shading */}
          <radialGradient
            id={`scleraGrad_${id}`}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="46%"
          >
            <stop offset="65%" stopColor="#FFFFFF" />
            <stop offset="86%" stopColor="#F4F3EE" />
            <stop offset="100%" stopColor="#DDD9D0" />
          </radialGradient>

          {/* Iris Gradient: Rich layered charcoal, bronze-graphite and obsidian */}
          <radialGradient
            id={`irisGrad_${id}`}
            cx="50%"
            cy="50%"
            r="50%"
            fx="44%"
            fy="42%"
          >
            <stop offset="0%" stopColor="#1E1C1A" />
            <stop offset="35%" stopColor="#2E2B27" />
            <stop offset="68%" stopColor="#1C1A18" />
            <stop offset="88%" stopColor="#11100F" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>

          {/* Limbal Ring: Deep dark outer perimeter */}
          <radialGradient
            id={`limbalRing_${id}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="78%" stopColor="transparent" />
            <stop offset="92%" stopColor="#0A0A0A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.98" />
          </radialGradient>

          {/* Upper Eyelid Deep Shadow cast onto the eyeball */}
          <linearGradient
            id={`eyelidShadow_${id}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.4" />
            <stop offset="32%" stopColor="#0A0A0A" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
          </linearGradient>

          {/* Golden Ratio Eye Aperture Mask (Vesica Piscis Harmonic Curve) */}
          <clipPath id={`eyeApertureClip_${id}`}>
            <path
              d="M 152,320 
                 C 185,255 245,228 305,228 
                 C 375,228 455,265 488,320 
                 C 455,372 385,396 325,396 
                 C 255,396 185,372 152,320 Z"
            />
          </clipPath>
        </defs>

        {/* ========================================================
            LAYER 01: ARCHITECTURAL & SACRED GEOMETRY GUIDES (Φ = 1.618)
            Subtle 0.5px hairline construction lines showing perfection
           ======================================================== */}
        <g className="text-[#0A0A0A] opacity-[0.22]" stroke="currentColor" strokeWidth="0.6">
          {/* Outer Golden Proportion Ring: Diameter = 460px */}
          <circle cx="320" cy="320" r="230" strokeDasharray="3 6" />
          
          {/* Major Optic Coordinate Axes with Hairline Ticks */}
          <line x1="60" y1="320" x2="580" y2="320" strokeDasharray="2 4" />
          <line x1="320" y1="60" x2="320" y2="580" strokeDasharray="2 4" />

          {/* Golden Section Concentric Circles: Φ-powers (144 : 89 : 55 : 34) */}
          <g className="animate-sacred-rings">
            <circle cx="320" cy="320" r="144" strokeDasharray="4 8" />
            <circle cx="320" cy="320" r="89" strokeDasharray="1 3" />
            <circle cx="320" cy="320" r="55" strokeDasharray="2 5" />
            <circle cx="320" cy="320" r="34" />
            {/* Harmonic Diagonals (Golden Angle Radians) */}
            <line x1="160" y1="204" x2="480" y2="436" strokeOpacity="0.4" />
            <line x1="160" y1="436" x2="480" y2="204" strokeOpacity="0.4" />
          </g>

          {/* Technical Editorial Coordinate Callouts */}
          <text
            x="328"
            y="94"
            fill="currentColor"
            fontSize="7"
            fontFamily="monospace"
            letterSpacing="0.18em"
            stroke="none"
          >
            Φ 1.6180 // OPTIC MERIDIAN
          </text>
          <text
            x="480"
            y="314"
            fill="currentColor"
            fontSize="7"
            fontFamily="monospace"
            letterSpacing="0.18em"
            stroke="none"
          >
            R:144.0
          </text>
          <text
            x="76"
            y="314"
            fill="currentColor"
            fontSize="7"
            fontFamily="monospace"
            letterSpacing="0.18em"
            stroke="none"
          >
            CANTHUS:0°
          </text>
        </g>

        {/* ========================================================
            LAYER 02: THE EYE APERTURE & LIVING INTERIOR
            The eye opening is held in divine golden ratio proportion
           ======================================================== */}
        <g>
          {/* Masked Interior: Sclera + Moving Iris + Pupil */}
          <g clipPath={`url(#eyeApertureClip_${id})`}>
            {/* Base Eyeball Surface */}
            <rect
              x="120"
              y="200"
              width="400"
              height="220"
              fill={`url(#scleraGrad_${id})`}
            />

            {/* Subtle sclera contour micro-lines */}
            <path
              d="M 170,320 Q 210,314 230,318 M 175,325 Q 195,332 220,328"
              stroke="#C4BCB2"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              fill="none"
            />
            <path
              d="M 470,320 Q 430,315 410,319 M 465,326 Q 445,330 420,325"
              stroke="#C4BCB2"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              fill="none"
            />

            {/* ========================================================
                LAYER 03: THE MOVING IRIS & PUPIL ASSEMBLY
                Smooth 10s continuous looping gaze tracking
               ======================================================== */}
            <g className="animate-eye-gaze">
              {/* Iris Outer Disk: Radius 88px */}
              <circle
                cx="320"
                cy="312"
                r="88"
                fill={`url(#irisGrad_${id})`}
              />

              {/* Concentric Crypts / Contraction Furrows */}
              <circle
                cx="320"
                cy="312"
                r="76"
                stroke="#4A4540"
                strokeWidth="0.75"
                strokeOpacity="0.35"
                strokeDasharray="4 6"
                fill="none"
              />
              <circle
                cx="320"
                cy="312"
                r="62"
                stroke="#5E5852"
                strokeWidth="0.85"
                strokeOpacity="0.45"
                strokeDasharray="6 4"
                fill="none"
              />

              {/* Intricate Radial Iris Fibers */}
              <g transform="translate(320, 312)">
                {irisFibers.map((f) => (
                  <line
                    key={f.id}
                    x1={f.x1}
                    y1={f.y1}
                    x2={f.x2}
                    y2={f.y2}
                    stroke="#7A7268"
                    strokeWidth={f.strokeWidth}
                    strokeOpacity={f.opacity}
                  />
                ))}

                {/* Collarette Ring: Golden ratio boundary (r = 54px) */}
                <circle
                  cx="0"
                  cy="0"
                  r="54"
                  stroke="#8A8276"
                  strokeWidth="1.2"
                  strokeOpacity="0.55"
                  strokeDasharray="2 3"
                  fill="none"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="44"
                  stroke="#3E3A36"
                  strokeWidth="0.9"
                  strokeOpacity="0.4"
                  fill="none"
                />

                {/* Pupillary Zone Shadow Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r="36"
                  stroke="#121110"
                  strokeWidth="2.5"
                  strokeOpacity="0.9"
                  fill="none"
                />
              </g>

              {/* Outer Limbal Ring (Dark, crisp iris perimeter) */}
              <circle
                cx="320"
                cy="312"
                r="88"
                fill={`url(#limbalRing_${id})`}
              />

              {/* The Pupil: Deep black void with accommodation breathing */}
              <circle
                cx="320"
                cy="312"
                r="29"
                fill="#050505"
                className="animate-pupil-breathe"
              />

              {/* Corneal Specular Reflection: Primary Crisp Glint catching light */}
              <circle
                cx="302"
                cy="294"
                r="7.5"
                fill="#FFFFFF"
                fillOpacity="0.95"
              />
              {/* Secondary Soft Ambient Highlight */}
              <circle
                cx="342"
                cy="332"
                r="3.2"
                fill="#FFFFFF"
                fillOpacity="0.5"
              />
            </g>

            {/* Cast Shadow of Upper Eyelid onto Eyeball */}
            <path
              d="M 140,220 L 500,220 L 500,270 
                 C 420,290 220,290 140,270 Z"
              fill={`url(#eyelidShadow_${id})`}
            />
          </g>

          {/* ========================================================
              LAYER 04: PALPEBRAL APERTURE CONTOURS & CARUNCLE
             ======================================================== */}
          {/* Inner Lacrimal Caruncle (Tear Duct) Detail */}
          <path
            d="M 152,320 
               C 142,322 136,326 142,330 
               C 148,333 154,328 158,324 Z"
            fill="#EAE5DC"
            stroke="#0A0A0A"
            strokeWidth="1.2"
          />
          <circle cx="144" cy="326" r="2.2" fill="#D4CCC0" />

          {/* Upper Eyelid Margin: Substantial, authoritative 2.4px dark line */}
          <path
            d="M 142,326 
               C 185,255 245,228 305,228 
               C 375,228 455,265 488,320"
            stroke="#0A0A0A"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Lower Eyelid Margin: Delicate 1.3px line */}
          <path
            d="M 146,328 
               C 185,372 255,396 325,396 
               C 385,396 455,372 488,320"
            stroke="#0A0A0A"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Subtle Eyelash Hints: Clean, minimal editorial accents */}
          <g stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
            <line x1="220" y1="248" x2="214" y2="238" />
            <line x1="260" y1="234" x2="256" y2="222" />
            <line x1="305" y1="228" x2="305" y2="216" />
            <line x1="350" y1="232" x2="354" y2="220" />
            <line x1="395" y1="244" x2="402" y2="234" />
            <line x1="440" y1="268" x2="450" y2="258" />
          </g>
        </g>

        {/* Supratarsal Crease (Upper Eyelid Fold): Stays above aperture */}
        <path
          d="M 172,282 
             C 215,208 285,192 340,196 
             C 395,200 445,232 472,274"
          stroke="#0A0A0A"
          strokeWidth="1.0"
          strokeOpacity="0.65"
          strokeLinecap="round"
          fill="none"
        />

        {/* Infratarsal Crease (Lower Lid Accent) */}
        <path
          d="M 220,412 C 280,424 360,424 420,404"
          stroke="#0A0A0A"
          strokeWidth="0.65"
          strokeOpacity="0.3"
          strokeDasharray="2 4"
          fill="none"
        />

        {/* Outer Corner (Lateral Canthus Accent) */}
        <path
          d="M 488,320 L 512,324"
          stroke="#0A0A0A"
          strokeWidth="1.1"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
}
