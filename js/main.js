/**
 * WVRNER × GUMROAD INTERACTIVE JAVASCRIPT
 * Full-Featured Neubrutalist Micro-Interactions & State Management
 * Nima Hosseini (@wvrner) · DevOps & Infrastructure Systems
 */

document.addEventListener('DOMContentLoaded', () => {
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
});

/* ==========================================================================
   0. Intro Splash Screen ("Good Morning!" ~2s Fade)
   ========================================================================== */
function initIntroSplash() {
  const splash = document.getElementById('introSplash');
  if (!splash) return;

  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 750);
  }, 2000);
}

/* ==========================================================================
   1. Theme Switcher (Gumroad Light / Dark Neubrutalism)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('gumroad-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

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
    localStorage.setItem('gumroad-theme', next);
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
   2. Web Audio Synthesizer (Retro Neubrutalist Blips)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

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
      if (soundEnabled && audioCtx) playChime(850, 0.035, 'triangle', 0.025);
    });
  });
}

function playChime(freq, duration, type = 'sine', gainVal = 0.03) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

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
  } catch (e) {
    // Ignore audio errors
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

      // Automatically focus on main.tf in the console
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
   7. Copy Code Button
   ========================================================================== */
function initCopyCodeButtons() {
  const copyBtn = document.getElementById('copyCodeBtn');
  const copyLabel = document.getElementById('copyCodeLabel');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const activePane = document.querySelector('.console-pane.active');
    if (!activePane) return;

    const textToCopy = activePane.innerText || activePane.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
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
    }).catch(() => {
      if (copyLabel) copyLabel.textContent = 'COPIED!';
      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'COPY CODE';
      }, 1500);
    });
  });
}

/* ==========================================================================
   8. Interactive Cloud Terminal CLI (`nimactl`)
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
        <div>&nbsp;&nbsp;<span class="term-cyan">actions</span>&nbsp;&nbsp;&nbsp;· Keyless GitHub Actions OIDC pipeline status</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">mesh</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· mTLS 1.3 &amp; Anycast edge routing telemetry</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">projects</span>&nbsp;&nbsp;· Active project repositories &amp; lab topologies</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;· Nima Hosseini credentials &amp; focus</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">contact</span>&nbsp;&nbsp;&nbsp;· Direct transmission links (Email, GitHub, LinkedIn)</div>
        <div>&nbsp;&nbsp;<span class="term-cyan">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· Clear terminal output</div>
      `;
      break;

    case 'status':
      output = `
        <div class="term-cmd">$ nimactl status --all</div>
        <div><span class="term-green">✔</span> AWS CloudFront Edge PoPs: <span class="term-cyan">[HEALTHY]</span> 450+ PoPs online · Latency p99: 14ms</div>
        <div><span class="term-green">✔</span> AWS S3 Bucket Origin: <span class="term-cyan">[ENCRYPTED]</span> SigV4 OAC Enforced · Public Access: 0%</div>
        <div><span class="term-green">✔</span> Uptime SLA: <span class="term-cyan">99.992% Nominal</span></div>
      `;
      break;

    case 'aws':
    case 'solutions-architect':
      output = `
        <div class="term-cmd">$ nimactl aws --track</div>
        <div><span class="term-green">✔</span> Target: AWS Certified Solutions Architect - Associate (SAA-C03)</div>
        <div><span class="term-green">✔</span> Disciplines: Multi-AZ VPC Design · Route 53 Anycast · CloudFront OAC · IAM Least-Privilege</div>
        <div class="term-dim">→ Mental model: Designing resilient distributed systems from the network up.</div>
      `;
      break;

    case 'terraform':
    case 'iac':
      output = `
        <div class="term-cmd">$ nimactl terraform --verify-state</div>
        <div><span class="term-green">✔</span> Remote State: AWS S3 + DynamoDB Distributed State Locking</div>
        <div><span class="term-green">✔</span> Configuration Drift: 0 unmanaged resources detected</div>
        <div><span class="term-green">✔</span> Modules: Networking, Storage, Security Groups, IAM</div>
      `;
      break;

    case 'docker':
    case 'containers':
      output = `
        <div class="term-cmd">$ nimactl docker stats</div>
        <div><span class="term-green">✔</span> Isolation Primitives: Linux cgroups &amp; namespaces</div>
        <div><span class="term-green">✔</span> Optimization: Multi-stage Dockerfile (920MB SDK → 28MB Distroless runtime)</div>
        <div><span class="term-green">✔</span> Attack Surface: 97% reduction · Non-root user · 0 shells · 0 CVEs</div>
      `;
      break;

    case 'actions':
    case 'ci':
    case 'cd':
      output = `
        <div class="term-cmd">$ nimactl actions status</div>
        <div><span class="term-green">✔</span> Authentication: Keyless AWS OIDC Federated Token (Zero static API keys)</div>
        <div><span class="term-green">✔</span> S3 Sync: Automated static asset synchronization</div>
        <div><span class="term-green">✔</span> Edge Invalidation: CloudFront CDN flushed in &lt; 4.0s</div>
      `;
      break;

    case 'mesh':
      output = `
        <div class="term-cmd">$ nimactl mesh inspect</div>
        <div><span class="term-green">✔</span> TLS Version: TLS 1.3 strictly enforced</div>
        <div><span class="term-green">✔</span> Cache Hit Ratio: 98.6% (Anycast Edge CDN)</div>
      `;
      break;

    case 'projects':
      output = `
        <div class="term-cmd">$ nimactl projects list</div>
        <div>[1] <span class="term-cyan">Cloud Architecture Site</span>: AWS (S3+CloudFront) · Terraform IaC · GitHub Actions CI/CD</div>
        <div>[2] <span class="term-cyan">Hardened Container Runtime</span>: Multi-stage Golang + Distroless (28MB image)</div>
        <div>[3] <span class="term-dim">Upcoming Labs</span>: Multi-container Compose topologies &amp; AWS VPC peering</div>
      `;
      break;

    case 'whoami':
      output = `
        <div class="term-cmd">$ whoami</div>
        <div>Nima Hosseini (@wvrner) · DevOps &amp; Infrastructure Systems</div>
        <div>Focus: Understanding modern systems from the network up.</div>
        <div>Location: New York City (40.7128° N, 74.0060° W)</div>
      `;
      break;

    case 'contact':
      output = `
        <div class="term-cmd">$ nimactl contact</div>
        <div>Email: <a href="mailto:wvrner@outlook.com" style="color:#38BDF8; text-decoration:underline;">wvrner@outlook.com</a></div>
        <div>GitHub: <a href="https://github.com/wvrner" target="_blank" style="color:#38BDF8; text-decoration:underline;">github.com/wvrner</a></div>
        <div>LinkedIn: <a href="https://linkedin.com/in/wvrner" target="_blank" style="color:#38BDF8; text-decoration:underline;">linkedin.com/in/wvrner</a></div>
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
   10. Live Dual World Clocks (NYC EST & UTC)
   ========================================================================== */
function initLiveClocks() {
  const localEl = document.getElementById('footerLocalClock');
  const utcEl = document.getElementById('footerUtcClock');
  if (!localEl && !utcEl) return;

  function update() {
    const now = new Date();
    if (localEl) {
      localEl.textContent = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' EST';
    }
    if (utcEl) {
      utcEl.textContent = now.toISOString().slice(11, 19) + ' UTC';
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   11. Copy Email Button with Haptic Toast
   ========================================================================== */
function initCopyEmail() {
  document.querySelectorAll('.copy-email-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'wvrner@outlook.com';

      navigator.clipboard.writeText(email).then(() => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
