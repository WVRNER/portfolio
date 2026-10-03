/**
 * WVRNER × GUMROAD INTERACTIVE JAVASCRIPT (Cross-Browser & Safari-Hardened)
 * Full-Featured Neubrutalist Micro-Interactions & State Management
 * Nima Hosseini (@wvrner) · DevOps & Infrastructure Systems
 */

/* ==========================================================================
   Cross-Browser Safe Utilities (Safari Storage & Clipboard Resiliency)
   ========================================================================== */
function getSafeStorage(key, fallback = null) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      return val !== null ? val : fallback;
    }
  } catch (e) {
    // Safari Private Browsing, file:// protocol, or restricted cookies
  }
  return fallback;
}

function setSafeStorage(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    // Safari Private Browsing or quota exceeded
  }
}

function safeCopyText(text, onSuccess, onError) {
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext !== false) {
    navigator.clipboard.writeText(text).then(() => {
      if (onSuccess) onSuccess();
    }).catch(() => {
      fallbackCopyText(text, onSuccess, onError);
    });
  } else {
    fallbackCopyText(text, onSuccess, onError);
  }
}

function fallbackCopyText(text, onSuccess, onError) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      if (onSuccess) onSuccess();
    } else {
      if (onError) onError();
    }
  } catch (err) {
    if (onError) onError(err);
  }
}

/* ==========================================================================
   0. Intro Splash Screen ("Good Morning!" ~2s Fade with Tap & BFCache Fallback)
   ========================================================================== */
function initIntroSplash() {
  const splash = document.getElementById('introSplash');
  if (!splash) return;

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    splash.classList.add('fade-out');
    splash.style.pointerEvents = 'none';
    setTimeout(() => {
      splash.style.display = 'none';
    }, 750);
  };

  // Immediate tap/click fallback so Safari mobile & desktop users are never trapped
  splash.addEventListener('click', dismiss);
  splash.addEventListener('touchstart', dismiss, { passive: true });

  // Standard timed dissolve after ~1.8s
  setTimeout(dismiss, 1800);
}

/* ==========================================================================
   1. Theme Switcher (Gumroad Light / Dark Neubrutalism)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn) return;

  const savedTheme = getSafeStorage('gumroad-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon(false);
  }

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current === 'dark';
    const next = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    setSafeStorage('gumroad-theme', next);
    updateThemeIcon(!isDark);

    playChime(isDark ? 520 : 780, 0.08, 'sine');
  });
}

function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById('themeIcon');
  if (!themeIcon) return;
  themeIcon.innerHTML = isDark ? '☀️' : '🌙';
}

/* ==========================================================================
   2. Web Audio Synthesizer (Retro Neubrutalist Blips - Safari/iOS Resilient)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch (e) {
      audioCtx = null;
    }
  }
  return audioCtx;
}

function unlockAudioOnGesture() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

function initWebAudio() {
  const toggleBtn = document.getElementById('soundToggle');
  if (!toggleBtn) return;

  // Unlock iOS Safari WebAudio on first touch/click
  window.addEventListener('touchstart', unlockAudioOnGesture, { once: true, passive: true });
  window.addEventListener('click', unlockAudioOnGesture, { once: true });

  toggleBtn.addEventListener('click', () => {
    unlockAudioOnGesture();

    soundEnabled = !soundEnabled;
    toggleBtn.classList.toggle('sound-bars-active', soundEnabled);
    const label = toggleBtn.querySelector('.sound-label');
    if (label) {
      label.textContent = soundEnabled ? 'SFX: ON' : 'SFX: OFF';
    }

    if (soundEnabled) {
      playChime(640, 0.06, 'triangle');
      setTimeout(() => playChime(920, 0.08, 'triangle'), 60);
    }
  });

  // Attach hover & click sound to buttons & pills
  document.querySelectorAll('a, button, .gum-topic-pill, .node-btn, .chapter-tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled && audioCtx) playChime(1100, 0.015, 'sine', 0.012);
    });
    el.addEventListener('click', () => {
      if (soundEnabled) {
        unlockAudioOnGesture();
        playChime(850, 0.035, 'triangle', 0.025);
      }
    });
  });
}

function playChime(freq, duration, type = 'sine', gainVal = 0.03) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Suppress WebAudio permission or buffer errors on mobile
  }
}

/* ==========================================================================
   3. Currently Learning Exhibition (4 Chapters Tabs)
   ========================================================================== */
function initChapterTabs() {
  const tabs = document.querySelectorAll('.chapter-tab-btn');
  const panels = document.querySelectorAll('.chapter-content-body');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      playChime(750, 0.04, 'triangle');
    });
  });
}

/* ==========================================================================
   4. Schematic Blueprint vs Code View Toggles
   ========================================================================== */
function initVisualizerToggles() {
  document.querySelectorAll('.chapter-visualizer-column').forEach(container => {
    const buttons = container.querySelectorAll('.vis-toggle-btn');
    const svgBox = container.querySelector('.vis-svg-container');
    const codeBox = container.querySelector('.vis-code-container');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (view === 'schematic') {
          if (svgBox) svgBox.style.display = 'flex';
          if (codeBox) codeBox.classList.remove('active');
        } else {
          if (svgBox) svgBox.style.display = 'none';
          if (codeBox) codeBox.classList.add('active');
        }

        playChime(950, 0.03, 'sine');
      });
    });
  });
}

/* ==========================================================================
   5. Real Architecture 4-Node Flow Strip
   ========================================================================== */
function initInfraNodeFlow() {
  const nodeButtons = document.querySelectorAll('.node-btn');
  const statusToast = document.getElementById('nodeStatusToast');
  if (!nodeButtons.length) return;

  const nodeDetails = {
    browser: '🌐 <strong>01 / Client Ingress:</strong> Modern browser establishes TLS 1.3 encrypted connection to the Anycast edge. Click any node to inspect its architecture.',
    dns: '🧭 <strong>02 / AWS Route 53:</strong> Latency-based Anycast DNS alias record directs user requests to the closest global CloudFront PoP.',
    cdn: '⚡ <strong>03 / CloudFront CDN:</strong> Origin Access Control (OAC) signs requests using SigV4. Cached assets returned with low TTFB from 450+ edge locations.',
    s3: '🪣 <strong>04 / AWS S3 Bucket:</strong> Private origin bucket. Public access is 100% blocked; accessed exclusively via SigV4 CloudFront OAC.'
  };

  nodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nodeKey = btn.getAttribute('data-node');
      nodeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (statusToast && nodeDetails[nodeKey]) {
        statusToast.innerHTML = nodeDetails[nodeKey];
      }

      // Automatically focus on main.tf if console is active
      const tfTab = document.querySelector('.console-tab-pill[data-pane="pane-tf"]');
      if (tfTab && !tfTab.classList.contains('active')) {
        tfTab.click();
      }

      playChime(880, 0.04, 'triangle');
    });
  });
}

/* ==========================================================================
   6. Code Console Tabs
   ========================================================================== */
function initConsoleTabs() {
  const tabs = document.querySelectorAll('.console-tab-pill');
  const panes = document.querySelectorAll('.console-pane');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-pane');
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const pane = document.getElementById(targetPaneId);
      if (pane) pane.classList.add('active');

      playChime(1020, 0.03, 'sine');
    });
  });
}

/* ==========================================================================
   7. Copy Code Button (Safari Safe)
   ========================================================================== */
function initCopyCodeButtons() {
  const copyBtn = document.getElementById('copyCodeBtn');
  const copyLabel = document.getElementById('copyCodeLabel');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const activePane = document.querySelector('.console-pane.active');
    if (!activePane) return;

    const textToCopy = activePane.innerText || activePane.textContent || '';
    safeCopyText(textToCopy, () => {
      if (copyLabel) copyLabel.textContent = 'COPIED! ✔';
      copyBtn.style.background = '#4ADE80';
      copyBtn.style.color = '#000000';

      playChime(1200, 0.06, 'sine');
      setTimeout(() => playChime(1600, 0.08, 'sine'), 50);

      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'COPY CODE';
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2000);
    }, () => {
      if (copyLabel) copyLabel.textContent = 'PRESS CMD+C';
      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'COPY CODE';
      }, 2000);
    });
  });
}

/* ==========================================================================
   8. Interactive Terminal: nimactl (Reusable Simulation)
   ========================================================================== */
function initInteractiveTerminal() {
  const form = document.getElementById('termForm');
  const input = document.getElementById('termInput');
  const screen = document.getElementById('termScreen');
  if (!form || !input || !screen) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const command = input.value.trim().toLowerCase();
    if (!command) return;

    input.value = '';
    handleTerminalCommand(command, screen);
  });
}

function handleTerminalCommand(cmd, screen) {
  const div = document.createElement('div');
  div.style.marginTop = '10px';
  div.style.borderTop = '1px dashed #333344';
  div.style.paddingTop = '8px';

  let output = '';

  switch (cmd) {
    case 'help':
      output = `
        <div class="term-cmd">$ nimactl help</div>
        <div>Available commands in this cluster:</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">status</span>&nbsp;&nbsp;&nbsp;&nbsp;· Global CloudFront CDN &amp; S3 telemetry health</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">aws</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· Solutions Architect (SAA-C03) track &amp; services</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">terraform</span>&nbsp;· IaC state locking &amp; zero drift check</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">docker</span>&nbsp;&nbsp;&nbsp;&nbsp;· Container kernel isolation &amp; 28MB distroless builds</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">actions</span>&nbsp;&nbsp;&nbsp;· Keyless OIDC AWS deployment status</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">projects</span>&nbsp;&nbsp;· Systems engineering portfolio catalogue</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;· Nima Hosseini profile &amp; architecture bio</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">contact</span>&nbsp;&nbsp;&nbsp;· Fast SMTP/PGP communication routes</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· Clear the terminal buffer</div>
      `;
      break;

    case 'status':
      output = `
        <div class="term-cmd">$ nimactl status</div>
        <div>[EDGE] CloudFront Distribution: <span class="term-green">HEALTHY (450+ PoPs Active)</span></div>
        <div>[ORIGIN] AWS S3 wvrner-prod: <span class="term-green">PROTECTED (OAC Strict SigV4)</span></div>
        <div>[DNS] Route 53 Anycast Latency: <span class="term-green">NOMINAL (14ms avg TTFB)</span></div>
        <div>[SECURITY] TLS 1.3 Cipher: <span class="term-yellow">TLS_AES_256_GCM_SHA384</span></div>
      `;
      break;

    case 'aws':
      output = `
        <div class="term-cmd">$ nimactl aws --track</div>
        <div>Track: AWS Certified Solutions Architect - Associate (SAA-C03)</div>
        <div>Core Focus: Resilient VPC topologies, Cross-Region Multi-AZ architectures, S3 Lifecycle transitions, and IAM Principle of Least Privilege.</div>
      `;
      break;

    case 'terraform':
      output = `
        <div class="term-cmd">$ nimactl terraform plan</div>
        <div>Terraform Core: v1.5.7 on darwin_arm64</div>
        <div>Backend: S3 Remote State with DynamoDB State Locking (Zero Drift detected)</div>
        <div>Resources: 18 managed, 0 to add, 0 to change, 0 to destroy.</div>
      `;
      break;

    case 'docker':
      output = `
        <div class="term-cmd">$ nimactl docker images</div>
        <div>REPOSITORY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TAG&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SIZE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SECURITY</div>
        <div>wvrner/distroless-app&nbsp;&nbsp;v2.4.0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28.4MB&nbsp;&nbsp;&nbsp;0 vulnerabilities (cgroups v2)</div>
      `;
      break;

    case 'actions':
      output = `
        <div class="term-cmd">$ nimactl actions status</div>
        <div>Pipeline: .github/workflows/deploy.yml</div>
        <div>Authentication: Keyless GitHub OIDC Provider &rarr; AWS IAM Role Assume</div>
        <div>Last Run: #48 - <span class="term-green">Success (CDN Invalidated /*)</span></div>
      `;
      break;

    case 'projects':
      output = `
        <div class="term-cmd">$ nimactl projects --list</div>
        <div>1. <span class="term-cyan">Static Cloud Engine</span> - Terraform + S3 + CloudFront OAC + GitHub OIDC</div>
        <div>2. <span class="term-cyan">Multi-AZ VPC Sandbox</span> - Declarative subnets, NAT Gateways &amp; flow logs</div>
        <div>3. <span class="term-cyan">Container Security Lab</span> - Hardened non-root containers &amp; minimal attack surface</div>
      `;
      break;

    case 'whoami':
      output = `
        <div class="term-cmd">$ nimactl whoami</div>
        <div>User: Nima Hosseini (@wvrner)</div>
        <div>Focus: DevOps, Cloud Infrastructure, Systems Architecture</div>
        <div>Philosophy: "Network up, declarative code, high-density aesthetics."</div>
      `;
      break;

    case 'contact':
      output = `
        <div class="term-cmd">$ nimactl contact</div>
        <div>Email:&nbsp;&nbsp;&nbsp;<a href="mailto:wvrner@outlook.com" style="color: var(--gum-pink);">wvrner@outlook.com</a></div>
        <div>GitHub:&nbsp;&nbsp;<a href="https://github.com/wvrner" target="_blank" rel="noopener" style="color: var(--gum-yellow);">github.com/wvrner</a></div>
      `;
      break;

    case 'clear':
      screen.innerHTML = `
        <div>Type <span class="term-cyan">'help'</span> to see available commands.</div>
      `;
      return;

    default:
      output = `
        <div class="term-cmd">$ ${cmd}</div>
        <div style="color: #FF6B6B;">Command not found: '${cmd}'. Type 'help' for available commands.</div>
      `;
      break;
  }

  div.innerHTML = output;
  screen.appendChild(div);
  screen.scrollTop = screen.scrollHeight;
  playChime(680, 0.04, 'square', 0.02);
}

/* ==========================================================================
   9. Unlimited Possibilities Category Pills
   ========================================================================== */
function initTopicPills() {
  const pills = document.querySelectorAll('.gum-topic-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      playChime(pill.classList.contains('active') ? 950 : 720, 0.03, 'sine');
    });
  });
}

/* ==========================================================================
   10. Live Dual World Clocks (NYC EST & UTC - Safari Resilient)
   ========================================================================== */
function initLiveClocks() {
  const localEl = document.getElementById('footerLocalClock');
  const utcEl = document.getElementById('footerUtcClock');
  if (!localEl && !utcEl) return;

  function update() {
    const now = new Date();
    if (localEl) {
      try {
        localEl.textContent = now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' EST';
      } catch (e) {
        // Fallback for older WebKit engines without IANA timezone
        const utcHours = now.getUTCHours();
        const estHours = (utcHours - 5 + 24) % 24;
        const pad = (n) => String(n).padStart(2, '0');
        localEl.textContent = `${pad(estHours)}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} EST`;
      }
    }
    if (utcEl) {
      try {
        utcEl.textContent = now.toISOString().slice(11, 19) + ' UTC';
      } catch (e) {
        const pad = (n) => String(n).padStart(2, '0');
        utcEl.textContent = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
      }
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   11. Copy Email Button with Haptic Toast (Safari Safe)
   ========================================================================== */
function initCopyEmail() {
  document.querySelectorAll('.copy-email-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'wvrner@outlook.com';

      safeCopyText(email, () => {
        const orig = btn.innerText;
        btn.innerText = 'COPIED TO CLIPBOARD! ✔';
        btn.style.background = '#FFC900';
        btn.style.color = '#000000';

        playChime(1100, 0.05, 'sine');
        setTimeout(() => playChime(1450, 0.08, 'sine'), 50);

        setTimeout(() => {
          btn.innerText = orig;
          btn.style.background = '';
          btn.style.color = '';
        }, 2200);
      }, () => {
        window.location.href = `mailto:${email}`;
      });
    });
  });
}

/* ==========================================================================
   12. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    playChime(900, 0.05, 'sine');
  });
}

/* ==========================================================================
   13. Nav Search Quick Filter
   ========================================================================== */
function initNavSearch() {
  const searchInput = document.getElementById('navSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const pills = document.querySelectorAll('.gum-topic-pill');
    pills.forEach(pill => {
      const text = pill.textContent.toLowerCase();
      if (!val || text.includes(val)) {
        pill.style.display = 'inline-flex';
      } else {
        pill.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   App Initialization (Safari BFCache & Document Ready Resilient)
   ========================================================================== */
function initApp() {
  initIntroSplash();
  initThemeToggle();
  initWebAudio();
  initChapterTabs();
  initVisualizerToggles();
  initInfraNodeFlow();
  initConsoleTabs();
  initCopyCodeButtons();
  initInteractiveTerminal();
  initTopicPills();
  initLiveClocks();
  initCopyEmail();
  initBackToTop();
  initNavSearch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // If Safari has already parsed DOM or loaded from BFCache
  initApp();
}

// Support Safari BFCache (back/forward navigation restore)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    const splash = document.getElementById('introSplash');
    if (splash) {
      splash.style.display = 'none';
      splash.style.pointerEvents = 'none';
    }
  }
});
