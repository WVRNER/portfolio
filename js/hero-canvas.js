/* ==========================================================================
   KID-FRIENDLY EXPLANATION OF HERO-CANVAS.JS:
   Imagine a big black sheet of paper behind your screen, and someone using
   glow-in-the-dark chalk to draw floating stars and connect them with laser lines!
   When you move your mouse, a friendly spotlight shines around it.
   This file does all the math to make those stars float, breathe, and connect smoothly!
   ========================================================================== */
/**
 * Handcrafted 3D Kinetic Celestial Astrolabe & Orbital Resonance Engine
 * Palette: Deep Royal Indigo #27187E & Luminous Periwinkle #758BFD
 * Built for Nima Hosseini (@wvrner) :  DevOps & Infrastructure Systems
 * 
 * An entirely bespoke, craft-made kinetic astronomical instrument in 3D:
 * - Concentric tilted 3D gimbal rings with hand-calibrated degree ticks & coordinate marks
 * - Asynchronous multi-axial 3D gyroscopic rotation with mechanical momentum
 * - Dynamic harmonic chord filaments creating shifting 3D hyperboloid structures
 * - Orbital specular tracer beads gliding along calibrated paths
 * - Magnetic inertial mouse tilt (luxurious physical weight and spring damping)
 * - Deep royal indigo #27187E ambient core with luminous periwinkle specular sheen
 */

class KineticAstrolabeCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.scrollY = window.scrollY || 0;
    this.targetScrollY = window.scrollY || 0;

    // 3D Gimbal & Camera Orientation
    this.camera = {
      basePitch: 0.35,  // ~ 20 degrees initial tilt
      baseYaw: -0.32,   // ~ -18 degrees side profile
      pitch: 0.35,
      yaw: -0.32,
      targetPitch: 0.35,
      targetYaw: -0.32,
      focalLength: 760,
      distance: 960
    };

    // Mouse & Inertial Torque State
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false
    };

    // 6 Concentric Handcrafted 3D Gimbal Rings
    this.rings = [
      { radius: 140, tiltX: 0.55, tiltY: 0.20, tiltZ: 0.10, speed: 0.0016, numTicks: 16, dash: [], isMajor: true, beads: [0, Math.PI] },
      { radius: 240, tiltX: -0.35, tiltY: 0.55, tiltZ: -0.25, speed: -0.0012, numTicks: 24, dash: [4, 6], isMajor: false, beads: [0.5, 2.4, 4.2] },
      { radius: 360, tiltX: 0.65, tiltY: -0.40, tiltZ: 0.30, speed: 0.0009, numTicks: 32, dash: [], isMajor: true, beads: [1.1, 3.8, 5.5] },
      { radius: 490, tiltX: -0.45, tiltY: -0.35, tiltZ: -0.15, speed: -0.0007, numTicks: 48, dash: [10, 8], isMajor: false, beads: [0.2, 1.8, 3.4, 5.0] },
      { radius: 630, tiltX: 0.35, tiltY: 0.60, tiltZ: 0.45, speed: 0.0005, numTicks: 64, dash: [], isMajor: true, beads: [0.8, 2.2, 3.9, 5.2] },
      { radius: 780, tiltX: -0.25, tiltY: 0.30, tiltZ: -0.40, speed: -0.0003, numTicks: 72, dash: [3, 8], isMajor: false, beads: [0.4, 1.6, 2.9, 4.3, 5.7] }
    ];

    // 3D Orbital Stardust Embers
    this.particles = [];
    this.numParticles = 42;

    // State
    this.isOverclocked = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    this.initParticles();

    window.addEventListener('resize', () => {
      this.resize();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.isHovered = true;

      // Heavy mechanical gimbal torque reaction
      const normX = (e.clientX / this.width) - 0.5;
      const normY = (e.clientY / this.height) - 0.5;
      this.camera.targetYaw = this.camera.baseYaw + normX * 0.18;
      this.camera.targetPitch = this.camera.basePitch + normY * 0.14;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.mouse.isHovered = false;
      this.camera.targetYaw = this.camera.baseYaw;
      this.camera.targetPitch = this.camera.basePitch;
    });

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY || 0;
    }, { passive: true });

    this.animate();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    if (this.ctx.resetTransform) {
      this.ctx.resetTransform();
    } else {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.ctx.scale(dpr, dpr);
    this.camera.focalLength = Math.max(580, Math.min(this.width * 0.7, 920));
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      const radius = 180 + Math.random() * 640;
      const theta = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 280;

      this.particles.push({
        radius: radius,
        theta: theta,
        elevation: elevation,
        speed: (0.0006 + Math.random() * 0.0012) * (Math.random() > 0.5 ? 1 : -1),
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  setOverclock(val) {
    this.isOverclocked = val;
  }

  // 3D Math Utilities
  rotateX(x, y, z, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: x, y: y * c - z * s, z: y * s + z * c };
  }

  rotateY(x, y, z, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: x * c + z * s, y: y, z: -x * s + z * c };
  }

  rotateZ(x, y, z, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: x * c - y * s, y: x * s + y * c, z: z };
  }

  // Project 3D point through gimbal rotations and perspective camera
  project(x, y, z) {
    // Apply camera yaw & pitch
    let p = this.rotateY(x, y, z, this.camera.yaw);
    p = this.rotateX(p.x, p.y, p.z, this.camera.pitch);

    const zDist = p.z + this.camera.distance;
    if (zDist <= 20) return null;

    const scale = this.camera.focalLength / zDist;
    const cx = this.width * 0.50;  // Centered slightly to anchor the layout
    const cy = this.height * 0.50 - (this.scrollY * 0.08);

    return {
      x: cx + p.x * scale,
      y: cy + p.y * scale,
      z: zDist,
      scale: scale
    };
  }

  animate() {
    if (!this.reducedMotion) {
      this.time += this.isOverclocked ? 0.024 : 0.006;
    }

    // Heavy spring damping on camera inertia
    this.camera.yaw += (this.camera.targetYaw - this.camera.yaw) * 0.038;
    this.camera.pitch += (this.camera.targetPitch - this.camera.pitch) * 0.038;
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.06;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Ambient Royal Indigo Nexus (#27187E core)
    this.drawIndigoNexus(isDark);

    // 2. 3D Kinetic Astrolabe Concentric Gimbal Rings
    this.drawAstrolabeRings(isDark);

    // 3. Harmonic Resonant Chords / Geodesic Filament Ribbons
    this.drawHarmonicChords(isDark);

    // 4. 3D Orbital Stardust Embers
    this.drawOrbitalStardust(isDark);

    requestAnimationFrame(() => this.animate());
  }

  /* --------------------------------------------------------------------------
     1. Ambient Royal Indigo Nexus Core (#27187E)
     -------------------------------------------------------------------------- */
  drawIndigoNexus(isDark) {
    this.ctx.save();
    const cx = this.width * 0.50;
    const cy = this.height * 0.50 - (this.scrollY * 0.08);
    const maxR = Math.max(this.width, this.height) * 0.72;

    const boost = this.isOverclocked ? 1.8 : 1.0;
    const grad = this.ctx.createRadialGradient(cx, cy, 20, cx, cy, maxR);

    if (isDark) {
      grad.addColorStop(0, `rgba(39, 24, 126, ${(0.22 * boost).toFixed(3)})`);    // #27187E deep core
      grad.addColorStop(0.35, `rgba(117, 139, 253, ${(0.10 * boost).toFixed(3)})`); // #758BFD electric aura
      grad.addColorStop(0.70, 'rgba(18, 12, 58, 0.04)');
      grad.addColorStop(1, 'rgba(9, 10, 15, 0)');
    } else {
      grad.addColorStop(0, `rgba(39, 24, 126, ${(0.12 * boost).toFixed(3)})`);
      grad.addColorStop(0.40, 'rgba(117, 139, 253, 0.05)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  /* --------------------------------------------------------------------------
     2. 3D Kinetic Astrolabe Concentric Gimbal Rings
     -------------------------------------------------------------------------- */
  drawAstrolabeRings(isDark) {
    this.ctx.save();

    const t = this.time;
    const boost = this.isOverclocked ? 1.5 : 1.0;

    // Collect all rings projected data for cross-harmonic chord linking
    this.projectedRingsData = [];

    for (let rIdx = 0; rIdx < this.rings.length; rIdx++) {
      const ring = this.rings[rIdx];
      const currentRotation = ring.speed * t * (this.isOverclocked ? 3.5 : 1.0);

      const segments = 72; // High resolution circle segments
      const projectedCircle = [];
      const tickPoints = [];

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        let p = {
          x: ring.radius * Math.cos(theta),
          y: 0,
          z: ring.radius * Math.sin(theta)
        };

        // Apply ring's own independent 3D gimbal tilt
        p = this.rotateX(p.x, p.y, p.z, ring.tiltX);
        p = this.rotateY(p.x, p.y, p.z, ring.tiltY + currentRotation);
        p = this.rotateZ(p.x, p.y, p.z, ring.tiltZ);

        const proj = this.project(p.x, p.y, p.z);
        if (proj) {
          projectedCircle.push(proj);
        }
      }

      // Draw Handcrafted Ring Circumference
      if (projectedCircle.length > 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(projectedCircle[0].x, projectedCircle[0].y);

        for (let i = 1; i < projectedCircle.length; i++) {
          this.ctx.lineTo(projectedCircle[i].x, projectedCircle[i].y);
        }

        const avgZ = projectedCircle[Math.floor(projectedCircle.length / 2)].z;
        const depthFactor = Math.max(0.2, Math.min(1.0, 1 - (avgZ - 500) / 1600));

        this.ctx.setLineDash(ring.dash);

        if (isDark) {
          const alpha = (ring.isMajor ? 0.35 : 0.18) * depthFactor * boost;
          this.ctx.strokeStyle = ring.isMajor 
            ? `rgba(117, 139, 253, ${Math.min(alpha, 0.85).toFixed(3)})` 
            : `rgba(39, 24, 126, ${Math.min(alpha, 0.70).toFixed(3)})`;
          
          if (this.isOverclocked && ring.isMajor) {
            this.ctx.shadowColor = 'rgba(117, 139, 253, 0.8)';
            this.ctx.shadowBlur = 8;
          }
        } else {
          const alpha = (ring.isMajor ? 0.30 : 0.15) * depthFactor * boost;
          this.ctx.strokeStyle = `rgba(39, 24, 126, ${Math.min(alpha, 0.75).toFixed(3)})`;
        }

        this.ctx.lineWidth = (ring.isMajor ? 1.4 : 0.9) * depthFactor * (this.isOverclocked ? 1.3 : 1.0);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.shadowBlur = 0;
      }

      // Draw Artisanal Astrolabe Degree Ticks & Calibration Crosshairs
      const tickStep = (Math.PI * 2) / ring.numTicks;
      for (let k = 0; k < ring.numTicks; k++) {
        const tickAngle = k * tickStep;
        const isCardinal = (k % (ring.numTicks / 4) === 0);
        const tickLength = isCardinal ? 14 : 7;

        let pInner = {
          x: (ring.radius - tickLength / 2) * Math.cos(tickAngle),
          y: 0,
          z: (ring.radius - tickLength / 2) * Math.sin(tickAngle)
        };
        let pOuter = {
          x: (ring.radius + tickLength / 2) * Math.cos(tickAngle),
          y: 0,
          z: (ring.radius + tickLength / 2) * Math.sin(tickAngle)
        };

        pInner = this.rotateX(pInner.x, pInner.y, pInner.z, ring.tiltX);
        pInner = this.rotateY(pInner.x, pInner.y, pInner.z, ring.tiltY + currentRotation);
        pInner = this.rotateZ(pInner.x, pInner.y, pInner.z, ring.tiltZ);

        pOuter = this.rotateX(pOuter.x, pOuter.y, pOuter.z, ring.tiltX);
        pOuter = this.rotateY(pOuter.x, pOuter.y, pOuter.z, ring.tiltY + currentRotation);
        pOuter = this.rotateZ(pOuter.x, pOuter.y, pOuter.z, ring.tiltZ);

        const projIn = this.project(pInner.x, pInner.y, pInner.z);
        const projOut = this.project(pOuter.x, pOuter.y, pOuter.z);

        if (projIn && projOut) {
          this.ctx.beginPath();
          this.ctx.moveTo(projIn.x, projIn.y);
          this.ctx.lineTo(projOut.x, projOut.y);

          const depthFactor = Math.max(0.1, Math.min(1.0, 1 - (projIn.z - 500) / 1600));
          const alpha = (isCardinal ? 0.45 : 0.20) * depthFactor * boost;

          this.ctx.strokeStyle = isDark 
            ? `rgba(174, 184, 254, ${Math.min(alpha, 0.8).toFixed(3)})` 
            : `rgba(39, 24, 126, ${Math.min(alpha, 0.7).toFixed(3)})`;
          this.ctx.lineWidth = isCardinal ? 1.2 : 0.7;
          this.ctx.stroke();

          // Small cardinal diamond indicator on major quadrant markers
          if (isCardinal && ring.isMajor) {
            this.ctx.beginPath();
            this.ctx.arc(projOut.x, projOut.y, 2.0 * projOut.scale, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark ? '#aeb8fe' : '#27187E';
            this.ctx.fill();
          }
        }
      }

      // Draw Luminous Specular Orbital Tracer Beads along Ring Circumference
      for (let b = 0; b < ring.beads.length; b++) {
        const beadAngle = ring.beads[b] + (ring.speed * 2.8 * t * (this.isOverclocked ? 4.0 : 1.0));
        let pb = {
          x: ring.radius * Math.cos(beadAngle),
          y: 0,
          z: ring.radius * Math.sin(beadAngle)
        };

        pb = this.rotateX(pb.x, pb.y, pb.z, ring.tiltX);
        pb = this.rotateY(pb.x, pb.y, pb.z, ring.tiltY + currentRotation);
        pb = this.rotateZ(pb.x, pb.y, pb.z, ring.tiltZ);

        const projBead = this.project(pb.x, pb.y, pb.z);
        if (projBead) {
          const depthFactor = Math.max(0.2, Math.min(1.0, 1 - (projBead.z - 500) / 1600));
          const bRadius = (2.2 + depthFactor * 2.4) * (this.isOverclocked ? 1.4 : 1.0);

          this.ctx.beginPath();
          this.ctx.arc(projBead.x, projBead.y, bRadius, 0, Math.PI * 2);

          if (isDark) {
            this.ctx.fillStyle = '#aeb8fe';
            this.ctx.shadowColor = 'rgba(117, 139, 253, 0.9)';
            this.ctx.shadowBlur = 10;
          } else {
            this.ctx.fillStyle = '#27187E';
            this.ctx.shadowColor = 'rgba(39, 24, 126, 0.5)';
            this.ctx.shadowBlur = 6;
          }

          this.ctx.fill();
          this.ctx.shadowBlur = 0;
        }
      }

      this.projectedRingsData.push({ ring: ring, circle: projectedCircle, currentRotation: currentRotation });
    }

    this.ctx.restore();
  }

  /* --------------------------------------------------------------------------
     3. Harmonic Resonant Chords / Geodesic Filaments
     -------------------------------------------------------------------------- */
  drawHarmonicChords(isDark) {
    if (!this.projectedRingsData || this.projectedRingsData.length < 2) return;

    this.ctx.save();
    const t = this.time;
    const boost = this.isOverclocked ? 1.6 : 1.0;

    // Connect synchronized node chords between adjacent rings (forming 3D hyperboloid geometry)
    const numChords = 12;
    for (let r = 0; r < this.rings.length - 1; r += 2) {
      const ringA = this.rings[r];
      const ringB = this.rings[r + 1];

      const rotA = ringA.speed * t * (this.isOverclocked ? 3.5 : 1.0);
      const rotB = ringB.speed * t * (this.isOverclocked ? 3.5 : 1.0);

      for (let c = 0; c < numChords; c++) {
        const angleA = (c / numChords) * Math.PI * 2;
        const angleB = angleA + Math.PI * 0.45; // Phase offset creates continuous twist

        let pA = { x: ringA.radius * Math.cos(angleA), y: 0, z: ringA.radius * Math.sin(angleA) };
        pA = this.rotateX(pA.x, pA.y, pA.z, ringA.tiltX);
        pA = this.rotateY(pA.x, pA.y, pA.z, ringA.tiltY + rotA);
        pA = this.rotateZ(pA.x, pA.y, pA.z, ringA.tiltZ);

        let pB = { x: ringB.radius * Math.cos(angleB), y: 0, z: ringB.radius * Math.sin(angleB) };
        pB = this.rotateX(pB.x, pB.y, pB.z, ringB.tiltX);
        pB = this.rotateY(pB.x, pB.y, pB.z, ringB.tiltY + rotB);
        pB = this.rotateZ(pB.x, pB.y, pB.z, ringB.tiltZ);

        const projA = this.project(pA.x, pA.y, pA.z);
        const projB = this.project(pB.x, pB.y, pB.z);

        if (projA && projB) {
          this.ctx.beginPath();
          this.ctx.moveTo(projA.x, projA.y);
          this.ctx.lineTo(projB.x, projB.y);

          const avgZ = (projA.z + projB.z) / 2;
          const depthFactor = Math.max(0.1, Math.min(1.0, 1 - (avgZ - 500) / 1600));
          const alpha = (0.04 + depthFactor * 0.14) * boost;

          this.ctx.strokeStyle = isDark 
            ? `rgba(117, 139, 253, ${alpha.toFixed(3)})` 
            : `rgba(39, 24, 126, ${alpha.toFixed(3)})`;
          this.ctx.lineWidth = 0.8 * depthFactor;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.restore();
  }

  /* --------------------------------------------------------------------------
     4. 3D Orbital Stardust Embers
     -------------------------------------------------------------------------- */
  drawOrbitalStardust(isDark) {
    this.ctx.save();

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.theta += p.speed * (this.isOverclocked ? 3.0 : 1.0);

      // Orbital position in 3D
      let px = p.radius * Math.cos(p.theta);
      let py = p.elevation + Math.sin(this.time * 0.8 + p.phase) * 25;
      let pz = p.radius * Math.sin(p.theta);

      const proj = this.project(px, py, pz);
      if (!proj) continue;

      const size = Math.max(0.6, p.size * proj.scale * 1.3);
      const alpha = Math.min(p.alpha * (proj.scale * 1.6), 0.8);

      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);

      if (isDark) {
        this.ctx.fillStyle = `rgba(174, 184, 254, ${alpha.toFixed(3)})`;
        if (size > 1.8) {
          this.ctx.shadowColor = 'rgba(117, 139, 253, 0.8)';
          this.ctx.shadowBlur = 6;
        }
      } else {
        this.ctx.fillStyle = `rgba(39, 24, 126, ${(alpha * 0.65).toFixed(3)})`;
      }

      this.ctx.fill();
    }

    this.ctx.shadowBlur = 0;
    this.ctx.restore();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cloudCanvas = new KineticAstrolabeCanvas('heroCanvas');
});
