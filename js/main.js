/**
 * Awwwards-Grade Interactive Architecture & Micro-Interactions
 * Nima Hosseini (@wvrner) Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroSplash();
  initCustomCursor();
  initWebAudio();
  initThemeToggle();
  initFluidNavPill();
  initScrollReveal();
  initCardTilt();
  initOverclockMode();
  initCompactArchSection();
  initLearningExhibition();
  initSmoothScroll();
  initFooterClock();
  initCopyEmail();
  // initCompactArchSection handles both
  initInteractiveTerminal();
  initBackToTop();
});

/* ==========================================================================
   1. Cinematic Intro Screen: "Good morning sunshine"
   ========================================================================== */
function initIntroSplash() {
  const splash = document.getElementById('introSplash');
  if (!splash) return;

  const counterEl = document.getElementById('introCounter');
  let count = 0;
  
  if (counterEl) {
    const counterTimer = setInterval(() => {
      count += Math.floor(Math.random() * 12) + 5;
      if (count >= 100) {
        count = 100;
        clearInterval(counterTimer);
      }
      counterEl.textContent = count.toString().padStart(3, '0') + '%';
    }, 45);
  }

  // Smooth cinematic curtain dissolve after 1.5s
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 850);
  }, 1600);
}

/* ==========================================================================
   2. Custom Magnetic Fluid Cursor
   ========================================================================== */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let dot = document.querySelector('.custom-cursor-dot');
  let ring = document.querySelector('.custom-cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(ring);
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  // Render loop with spring lerp
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover target scale expansion
  const interactiveTargets = 'a, button, input, .tilt-card, .cv-action-btn, .inspector-btn, .terminal-tab';
  document.querySelectorAll(interactiveTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3. Synthesized Web Audio Micro-Soundscape (Organic & Soft)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initWebAudio() {
  const toggleBtn = document.getElementById('soundToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    soundEnabled = !soundEnabled;
    toggleBtn.classList.toggle('is-active', soundEnabled);
    toggleBtn.classList.toggle('sound-bars-active', soundEnabled);

    const label = toggleBtn.querySelector('.sound-btn-label');
    if (label) {
      label.textContent = soundEnabled ? 'AUDIO: ON' : 'AUDIO: MUTED';
    }

    if (soundEnabled) {
      playSoftTone(600, 0.08, 'sine');
      setTimeout(() => playSoftTone(900, 0.09, 'sine'), 60);
    }
  });

  // Attach subtle audio blips to buttons
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled && audioCtx) playSoftTone(1200, 0.02, 'sine', 0.015);
    });
    el.addEventListener('click', () => {
      if (soundEnabled && audioCtx) playSoftTone(880, 0.04, 'triangle', 0.03);
    });
  });
}

function playSoftTone(freq, duration, type = 'sine', gainVal = 0.035) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Graceful fallback
  }
}

/* ==========================================================================
   4. Compact VisionOS Navigation & Magnetic Fluid Sliding Pill
   ========================================================================== */
function initFluidNavPill() {
  const navLinks = document.querySelector('.nav-links');
  const hoverPill = document.querySelector('.nav-hover-pill');
  if (!navLinks || !hoverPill) return;

  const items = navLinks.querySelectorAll('.nav-link');
  const activeItem = navLinks.querySelector('.nav-link.active');

  function updatePill(el) {
    if (!el) {
      hoverPill.style.opacity = '0';
      return;
    }
    const navRect = navLinks.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    hoverPill.style.width = `${elRect.width}px`;
    hoverPill.style.height = `${elRect.height}px`;
    hoverPill.style.transform = `translateX(${elRect.left - navRect.left}px)`;
    hoverPill.style.opacity = '1';
  }

  if (activeItem) {
    setTimeout(() => updatePill(activeItem), 60);
  }

  items.forEach(item => {
    item.addEventListener('mouseenter', () => updatePill(item));
  });

  navLinks.addEventListener('mouseleave', () => {
    if (activeItem) {
      updatePill(activeItem);
    } else {
      hoverPill.style.opacity = '0';
    }
  });

  window.addEventListener('resize', () => {
    if (activeItem) updatePill(activeItem);
  });
}

/* ==========================================================================
   5. Theme Controller (Light / Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon(false);
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateThemeIcon(!isDark);

    if (soundEnabled && audioCtx) {
      playSoftTone(isDark ? 520 : 780, 0.08, 'sine');
    }
  });
}

function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById('themeIcon');
  if (!themeIcon) return;
  
  if (isDark) {
    themeIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    themeIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

/* ==========================================================================
   6. Scroll Reveal (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. Interactive 3D Card Tilt with Physics
   ========================================================================== */
function initCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -3.0;
      const rotateY = ((x - centerX) / centerX) * 3.0;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/* ==========================================================================
   8. Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   9. Live Dual World Clocks (NYC Local + UTC)
   ========================================================================== */
function initFooterClock() {
  const localEl = document.getElementById('footerLocalTime');
  const utcEl = document.getElementById('footerUtcTime');
  if (!localEl && !utcEl) return;

  function update() {
    const now = new Date();
    
    if (localEl) {
      const localStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' EST';
      localEl.textContent = localStr;
    }

    if (utcEl) {
      const utcStr = now.toISOString().slice(11, 19) + ' UTC';
      utcEl.textContent = utcStr;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   10. 1-Click Copy Email to Clipboard with Haptic Feedback
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  if (!copyBtns.length) return;

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'wvrner@outlook.com';
      
      navigator.clipboard.writeText(email).then(() => {
        const textSpan = btn.querySelector('.copy-btn-text');
        const originalText = textSpan ? textSpan.textContent : 'Copy Email';
        
        btn.classList.add('is-copied');
        if (textSpan) textSpan.textContent = 'Copied to clipboard!';

        if (soundEnabled && audioCtx) {
          playSoftTone(880, 0.05, 'sine');
          setTimeout(() => playSoftTone(1320, 0.08, 'sine'), 50);
        }
        
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (textSpan) textSpan.textContent = originalText;
        }, 2200);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  });
}

/* ==========================================================================
   11. Architecture Inspector Component (Awwwards Interactive Showcase)
   ========================================================================== */
function initCompactArchSection() {
  const flowNodes = document.querySelectorAll('.flow-node');
  const flowConnectors = document.querySelectorAll('.flow-connector');
  const flowStatusMsg = document.getElementById('flowStatusMsg');
  const traceBtn = document.getElementById('traceFlowBtn');
  const consoleTabs = document.querySelectorAll('.console-tab');
  const consolePanes = document.querySelectorAll('.console-pane');
  const copyBtn = document.getElementById('copyCodeBtn');
  const copyLabel = document.getElementById('copyCodeLabel');

  if (!flowNodes.length) return;

  const nodeExplanations = {
    browser: '<strong>Client Ingress:</strong> Modern browser establishes TLS 1.3 connection to Anycast edge. Click any node to inspect its code.',
    dns: '<strong>AWS Route 53:</strong> Latency-based Anycast DNS alias record directs user requests to the closest global CloudFront PoP.',
    cdn: '<strong>CloudFront CDN:</strong> Origin Access Control (OAC) signs requests using SigV4. Cached assets returned with low TTFB.',
    s3: '<strong>AWS S3 Bucket:</strong> Private origin bucket. Public access is 100% blocked; accessed exclusively via SigV4 CloudFront OAC.'
  };

  // Node Click Handlers
  flowNodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeKey = node.getAttribute('data-node');
      flowNodes.forEach(n => {
        n.classList.remove('active');
        n.setAttribute('aria-selected', 'false');
      });
      node.classList.add('active');
      node.setAttribute('aria-selected', 'true');

      if (flowStatusMsg && nodeExplanations[nodeKey]) {
        flowStatusMsg.innerHTML = nodeExplanations[nodeKey];
      }

      // Switch to main.tf tab if not already on it
      const targetTab = document.querySelector('.console-tab[data-pane="pane-tf"]');
      if (targetTab && !targetTab.classList.contains('active')) {
        targetTab.click();
      }

      if (typeof soundEnabled !== 'undefined' && soundEnabled && typeof audioCtx !== 'undefined' && audioCtx) {
        playSoftTone(880, 0.04, 'sine', 0.02);
      }
    });
  });

  // Console Tab Handlers
  consoleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const paneId = tab.getAttribute('data-pane');
      consoleTabs.forEach(t => t.classList.remove('active'));
      consolePanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(paneId);
      if (targetPane) targetPane.classList.add('active');

      if (typeof soundEnabled !== 'undefined' && soundEnabled && typeof audioCtx !== 'undefined' && audioCtx) {
        playSoftTone(960, 0.03, 'sine', 0.015);
      }
    });
  });

  // Copy Code Button
  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.console-pane.active');
      if (!activePane) return;
      const codeText = activePane.innerText || activePane.textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        copyLabel.textContent = 'Copied! ✔';
        copyBtn.style.borderColor = '#10b981';
        copyBtn.style.color = '#10b981';
        setTimeout(() => {
          copyLabel.textContent = 'Copy';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      }).catch(() => {
        copyLabel.textContent = 'Copied!';
        setTimeout(() => { copyLabel.textContent = 'Copy'; }, 1500);
      });
    });
  }

  // Fun Request Tracer Button
  if (traceBtn) {
    let isTracing = false;
    traceBtn.addEventListener('click', () => {
      if (isTracing) return;
      isTracing = true;
      traceBtn.style.pointerEvents = 'none';

      const traceMessages = [
        '🌐 <strong>Step 1 (Ingress):</strong> Client initiates TLS 1.3 handshake to wvrner.com...',
        '🧭 <strong>Step 2 (DNS):</strong> AWS Route 53 Anycast resolves alias to nearest CloudFront PoP...',
        '⚡ <strong>Step 3 (Edge CDN):</strong> CloudFront Edge verifies cache & validates Origin Access Control (OAC)...',
        '🪣 <strong>Step 4 (Origin):</strong> AWS S3 Bucket verifies SigV4 authorization & delivers assets...'
      ];

      flowNodes.forEach((node, i) => {
        setTimeout(() => {
          flowNodes.forEach(n => n.classList.remove('tracing', 'active'));
          node.classList.add('tracing', 'active');
          if (flowConnectors[i - 1]) flowConnectors[i - 1].classList.add('active');

          if (flowStatusMsg && traceMessages[i]) {
            flowStatusMsg.innerHTML = traceMessages[i];
          }

          if (typeof soundEnabled !== 'undefined' && soundEnabled && typeof audioCtx !== 'undefined' && audioCtx) {
            playSoftTone(440 + i * 180, 0.06, 'sine', 0.03);
          }
        }, i * 360);
      });

      // Complete Trace
      setTimeout(() => {
        flowConnectors.forEach(c => c.classList.remove('active'));
        flowNodes.forEach(n => n.classList.remove('tracing'));
        const browserNode = document.querySelector('.flow-node[data-node="browser"]');
        if (browserNode) browserNode.classList.add('active');

        if (flowStatusMsg) {
          flowStatusMsg.innerHTML = '✨ <strong>Result:</strong> HTTP 200 OK &middot; CloudFront Cache Hit &middot; S3 OAC Enforced &middot; Zero manual console clicks';
        }

        traceBtn.style.pointerEvents = '';
        isTracing = false;

        if (typeof soundEnabled !== 'undefined' && soundEnabled && typeof audioCtx !== 'undefined' && audioCtx) {
          playSoftTone(1100, 0.1, 'triangle', 0.04);
        }
      }, flowNodes.length * 360 + 350);
    });
  }
}

/* ==========================================================================
   12. Real Interactive Cloud Terminal CLI (`nimactl`)
   ========================================================================== */
function initInteractiveTerminal() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const panes = document.querySelectorAll('.terminal-pane');
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('termInput');
  const outputBody = document.querySelector('.terminal-body');

  if (tabs.length && panes.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }

        if (soundEnabled && audioCtx) {
          playSoftTone(1050, 0.03, 'sine');
        }
      });
    });
  }

  // Active CLI input processor
  if (form && input && outputBody) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (!val) return;

      input.value = '';
      executeCliCommand(val, outputBody);
    });
  }
}

function executeCliCommand(cmd, container) {
  const responseDiv = document.createElement('div');
  responseDiv.style.marginTop = '12px';
  responseDiv.style.borderTop = '1px solid rgba(255,255,255,0.08)';
  responseDiv.style.paddingTop = '8px';

  let responseHtml = '';

  switch (cmd) {
    case 'help':
      responseHtml = `
        <div class="term-cmd">$ nimactl help</div>
        <div>Available commands:</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">status</span>&nbsp;&nbsp;&nbsp;&nbsp;&mdash; Inspect distributed multi-region cluster health</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">iac</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&mdash; Check Terraform state lock &amp; drift status</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">mesh</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&mdash; Inspect mTLS service mesh &amp; CDN edge routing</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">projects</span>&nbsp;&mdash; List live projects &amp; architecture repositories</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">contact</span>&nbsp;&nbsp;&mdash; Display verified email &amp; transmission links</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">whoami</span>&nbsp;&nbsp;&mdash; Print engineer credentials</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&mdash; Reset terminal buffer</div>
      `;
      break;

    case 'status':
    case 'cluster':
      responseHtml = `
        <div class="term-cmd">$ nimactl cluster status --all-regions</div>
        <div><span class="term-green">&#x2714;</span> us-east-1 (N. Virginia): <span class="term-cyan">[HEALTHY]</span> pods: 412/412 &middot; p99: 14ms</div>
        <div><span class="term-green">&#x2714;</span> eu-central-1 (Frankfurt): <span class="term-cyan">[HEALTHY]</span> pods: 288/288 &middot; p99: 18ms</div>
        <div><span class="term-green">&#x2714;</span> ap-southeast-1 (Singapore): <span class="term-cyan">[HEALTHY]</span> pods: 196/196 &middot; p99: 22ms</div>
      `;
      break;

    case 'aws':
    case 'solutions-architect':
      responseHtml = `
        <div class="term-cmd">$ nimactl aws status --cert</div>
        <div><span class="term-green">&#x2714;</span> Track: AWS Solutions Architect (SAA-C03) [ACTIVE]</div>
        <div><span class="term-green">&#x2714;</span> Core Services: Route 53 &middot; CloudFront CDN &middot; S3 (OAC) &middot; VPC &middot; IAM</div>
        <div><span class="term-dim">&rarr; Multi-AZ resilient topologies &amp; Least-Privilege boundaries</span></div>
      `;
      break;

    case 'docker':
    case 'containers':
      responseHtml = `
        <div class="term-cmd">$ docker stats --all</div>
        <div><span class="term-green">&#x2714;</span> Runtime: containerd / Linux cgroups &amp; namespaces</div>
        <div><span class="term-green">&#x2714;</span> Optimization: Multi-stage Dockerfile (920MB &rarr; 28MB Alpine base)</div>
        <div><span class="term-green">&#x2714;</span> CVE Scan: 0 critical vulnerabilities detected</div>
      `;
      break;

    case 'github-actions':
    case 'ci':
    case 'cd':
      responseHtml = `
        <div class="term-cmd">$ gh workflow view deploy.yml</div>
        <div><span class="term-green">&#x2714;</span> Status: ACTIVE &middot; Trigger: Push to main</div>
        <div><span class="term-green">&#x2714;</span> Authentication: Keyless AWS OIDC Federated Token</div>
        <div><span class="term-green">&#x2714;</span> Edge Cache Invalidation: CloudFront flushed in 0.9s</div>
      `;
      break;

    case 'learn':
    case 'learning':
      responseHtml = `
        <div class="term-cmd">$ nimactl learn list</div>
        <div>Currently learning:</div>
        <div>&nbsp;&nbsp;[1] <span class="term-cyan">AWS</span> (working toward Solutions Architect)</div>
        <div>&nbsp;&nbsp;[2] <span class="term-cyan">Terraform</span> (infrastructure as code)</div>
        <div>&nbsp;&nbsp;[3] <span class="term-cyan">Docker</span> (containers)</div>
        <div>&nbsp;&nbsp;[4] <span class="term-cyan">GitHub Actions</span> (CI/CD)</div>
      `;
      break;

    case 'warp':
    case 'overclock':
      const isOverclocked = !document.body.classList.contains('is-overclocked');
      document.body.classList.toggle('is-overclocked', isOverclocked);
      if (window.cloudCanvas && typeof window.cloudCanvas.setOverclock === 'function') {
        window.cloudCanvas.setOverclock(isOverclocked);
      }
      responseHtml = `
        <div class="term-cmd">$ nimactl overclock</div>
        <div><span class="term-green">&#x2714;</span> Overclock State: ${isOverclocked ? 'WARP SPEED [PARTICLES ACCELERATED 4.8X]' : 'NORMAL NOMINAL'}</div>
      `;
      break;

    case 'ping':
      responseHtml = `
        <div class="term-cmd">$ ping -c 3 cdn.wvrner.com</div>
        <div>64 bytes from d2xyz.cloudfront.net: icmp_seq=1 ttl=58 time=12.4 ms</div>
        <div>64 bytes from d2xyz.cloudfront.net: icmp_seq=2 ttl=58 time=13.1 ms</div>
        <div>64 bytes from d2xyz.cloudfront.net: icmp_seq=3 ttl=58 time=11.9 ms</div>
        <div>--- cdn.wvrner.com ping statistics --- rtt min/avg/max = 11.9/12.4/13.1 ms</div>
      `;
      break;

    case 'iac':
    case 'terraform':
      responseHtml = `
        <div class="term-cmd">$ nimactl iac verify --state-check</div>
        <div><span class="term-green">&#x2714;</span> State Storage: AWS S3 + DynamoDB state locking [ACTIVE]</div>
        <div><span class="term-green">&#x2714;</span> Drift Check: 0 unmanaged resources across 14 modules</div>
        <div><span class="term-green">&#x2714;</span> GitOps Sync: In sync with github.com/wvrner/portfolio</div>
      `;
      break;

    case 'mesh':
      responseHtml = `
        <div class="term-cmd">$ nimactl mesh inspect</div>
        <div><span class="term-green">&#x2714;</span> mTLS 1.3: STRICT_ENFORCED across all ingress paths</div>
        <div><span class="term-green">&#x2714;</span> Edge Cache Hit Ratio: 98.4% (CloudFront Anycast)</div>
      `;
      break;

    case 'projects':
      responseHtml = `
        <div class="term-cmd">$ nimactl projects list</div>
        <div>[1] <span class="term-cyan">This Website</span>: AWS (S3+CloudFront) &middot; Terraform &middot; GitHub Actions</div>
        <div>[2] <span class="term-dim">Homelab K8s Cluster</span>: Microservices &middot; Istio mTLS [IN PROGRESS]</div>
      `;
      break;

    case 'whoami':
      responseHtml = `
        <div class="term-cmd">$ whoami</div>
        <div>Nima Hosseini (@wvrner) &mdash; Cloud &amp; DevOps Engineering</div>
        <div>Focus: AWS &middot; Terraform &middot; Docker &middot; GitHub Actions CI/CD</div>
      `;
      break;

    case 'contact':
    case 'email':
      responseHtml = `
        <div class="term-cmd">$ nimactl comms contact</div>
        <div>Email: <span class="term-cyan">wvrner@outlook.com</span></div>
        <div>GitHub: <a href="https://github.com/wvrner" target="_blank" style="color:#f87171; text-decoration:underline;">github.com/wvrner</a></div>
        <div>LinkedIn: <a href="https://linkedin.com/in/wvrner" target="_blank" style="color:#f87171; text-decoration:underline;">linkedin.com/in/wvrner</a></div>
      `;
      break;

    case 'clear':
      container.innerHTML = `
        <div class="term-cmd">$ nimactl &mdash; buffer cleared. Type 'help' for commands.</div>
      `;
      return;

    default:
      responseHtml = `
        <div class="term-cmd">$ ${cmd}</div>
        <div style="color: #f85149;">Command not recognized: '${cmd}'. Type 'help' to see available commands.</div>
      `;
      break;
  }

  responseDiv.innerHTML = responseHtml;
  container.appendChild(responseDiv);
  container.scrollTop = container.scrollHeight;

  if (soundEnabled && audioCtx) {
    playSoftTone(740, 0.04, 'square', 0.015);
  }
}

/* ==========================================================================
   13. Scroll to Top Trigger
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Viral Awwwards Overclock / Warp Speed Mode
   ========================================================================== */
function initOverclockMode() {
  const toggleBtns = document.querySelectorAll('.overclock-toggle-btn');
  
  function triggerOverclock() {
    const isNow = !document.body.classList.contains('is-overclocked');
    document.body.classList.toggle('is-overclocked', isNow);

    toggleBtns.forEach(btn => {
      const textSpan = btn.querySelector('.overclock-btn-text');
      if (textSpan) {
        textSpan.textContent = isNow ? '⚡ OVERCLOCKED [WARP SPEED: 4.8x]' : '⚡ OVERCLOCK SYSTEM';
      }
    });

    if (window.cloudCanvas && typeof window.cloudCanvas.setOverclock === 'function') {
      window.cloudCanvas.setOverclock(isNow);
    }

    if (soundEnabled && audioCtx) {
      if (isNow) {
        playWarpSound();
      } else {
        playSoftTone(440, 0.1, 'sine');
      }
    }
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerOverclock();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'w' || e.key === 'W' || e.key === '`' || e.key === '~') {
      triggerOverclock();
    }
  });
}

function playWarpSound() {
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.7);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  } catch (e) {}
}

/* ==========================================================================
   Live Edge Architecture Ping Simulator
   ========================================================================== */
// initLatencyPingSimulator replaced by initCompactArchSection

/* ==========================================================================
   Handcrafted Awwwards Learning Exhibition (Chapter Switcher & Code Tabs)
   ========================================================================== */
function initLearningExhibition() {
  const chapterBtns = document.querySelectorAll('.chapter-nav-btn');
  const chapterPanels = document.querySelectorAll('.chapter-panel');

  if (chapterBtns.length && chapterPanels.length) {
    chapterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-chapter');

        chapterBtns.forEach(b => b.classList.remove('active'));
        chapterPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }

        if (soundEnabled && audioCtx) {
          playSoftTone(580, 0.06, 'sine', 0.025);
          setTimeout(() => playSoftTone(870, 0.08, 'sine', 0.02), 40);
        }
      });
    });
  }

  // Toggle between Schematic Blueprint and Code Inspector inside each panel
  document.querySelectorAll('.chapter-panel').forEach(panel => {
    const tabBtns = panel.querySelectorAll('.schematic-tab-btn');
    const visualBox = panel.querySelector('.schematic-visual-box');
    const codeBox = panel.querySelector('.schematic-code-box');

    if (tabBtns.length && visualBox && codeBox) {
      tabBtns.forEach(tab => {
        tab.addEventListener('click', () => {
          const view = tab.getAttribute('data-view');
          tabBtns.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          if (view === 'code') {
            visualBox.style.display = 'none';
            codeBox.classList.add('active');
          } else {
            codeBox.classList.remove('active');
            visualBox.style.display = 'flex';
          }

          if (soundEnabled && audioCtx) {
            playSoftTone(980, 0.03, 'sine', 0.015);
          }
        });
      });
    }
  });
}
