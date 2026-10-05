/**
 * WVRNER INTERACTIVE CLIENT SCRIPT
 * Neubrutalist Interactions & Micro-Interactions
 * Nima Hosseini (@wvrner) · DevOps & Infrastructure Systems
 */

/* ==========================================================================
   Cross-Browser Safe Utilities (Clipboard & Resiliency)
   ========================================================================== */
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

  // Immediate tap/click fallback so users are never trapped
  splash.addEventListener('click', dismiss);
  splash.addEventListener('touchstart', dismiss, { passive: true });

  // Timed dissolve after ~1.8s
  setTimeout(dismiss, 1800);
}

/* ==========================================================================
   1. Currently Learning Exhibition (4 Chapters Tabs)
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
    });
  });

  // Mobile horizontal swipe gesture between chapters
  const exhibitionWrap = document.querySelector('.gum-exhibition-wrapper');
  if (exhibitionWrap) {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    exhibitionWrap.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    exhibitionWrap.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        const tabList = Array.from(tabs);
        const currentIndex = tabList.findIndex(t => t.classList.contains('active'));
        if (currentIndex === -1) return;
        if (diffX > 0 && currentIndex < tabList.length - 1) {
          tabList[currentIndex + 1].click();
        } else if (diffX < 0 && currentIndex > 0) {
          tabList[currentIndex - 1].click();
        }
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   2. Schematic Blueprint vs Code View Toggles
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
      });
    });
  });
}

/* ==========================================================================
   3. Real Architecture 4-Node Flow Strip
   ========================================================================== */
function initInfraNodeFlow() {
  const nodeButtons = document.querySelectorAll('.node-btn');
  const statusToast = document.getElementById('nodeStatusToast');
  if (!nodeButtons.length) return;

  const nodeDetails = {
    browser: '🌐 <strong>01 / Client Ingress:</strong> Modern browser establishes TLS 1.3 encrypted connection to the Anycast edge. Click any node to inspect the real deployment architecture.',
    repo: '🐙 <strong>02 / GitHub Source:</strong> Every release is committed and pushed directly to GitHub. Fully auditable git commit log with zero hidden dependencies or config drift.',
    cdn: '⚡ <strong>03 / GitHub Actions:</strong> Every push to the main branch automatically triggers the CI/CD workflow. GitHub Actions installs the required dependencies, builds the Eleventy site and prepares the generated files for deployment.',
    static: '🌐 <strong>04 / GitHub Pages:</strong> After a successful build, the generated static site is automatically deployed to GitHub Pages and served through the custom domain over HTTPS.'
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
    });
  });
}

/* ==========================================================================
   4. Code Console Tabs
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
    });
  });
}

/* ==========================================================================
   5. Copy Code Button
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
   6. Interactive Terminal: nimactl (Simulation)
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
        <div>&nbsp;&nbsp;<span class="term-cyan">contact</span>&nbsp;&nbsp;&nbsp;· Fast Telegram/SMTP routes</div>
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
        <div>Telegram:&nbsp;<a href="https://t.me/wvrner" target="_blank" rel="noopener" style="color: var(--gum-blue);">Telegram</a></div>
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
}

/* ==========================================================================
   7. Unlimited Possibilities Category Pills
   ========================================================================== */
function initTopicPills() {
  const pills = document.querySelectorAll('.gum-topic-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
    });
  });
}

/* ==========================================================================
   8. Live Dual World Clocks (NYC EST & UTC)
   ========================================================================== */
function initLiveClocks() {
  const localEls = document.querySelectorAll('#footerLocalClock, #footerNycClock');
  const utcEls = document.querySelectorAll('#footerUtcClock');
  if (!localEls.length && !utcEls.length) return;

  function update() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    let timeStr = '';
    try {
      timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      const utcHours = now.getUTCHours();
      const edtHours = (utcHours - 4 + 24) % 24;
      timeStr = `${pad(edtHours)}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
    }

    localEls.forEach(el => {
      el.textContent = timeStr;
    });

    const utcStr = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
    utcEls.forEach(el => {
      el.textContent = utcStr;
    });
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   9. Copy Email Button with Haptic Toast
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
   10. Back to Top Button
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
  });
}

/* ==========================================================================
   11. Nav Search Quick Filter
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
   12. Smooth Hash Scroll for Safari & Anchors (#cv Clearance)
   ========================================================================== */
function initHashScroll() {
  function scrollToTarget(id) {
    const el = document.getElementById(id.replace('#', ''));
    if (el) {
      const topOffset = 86;
      const elPos = el.getBoundingClientRect().top + window.pageYOffset - topOffset;
      try {
        window.scrollTo({ top: elPos, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, elPos);
      }
    }
  }

  // Smooth in-page anchor clicks for Safari
  document.querySelectorAll('a[href^="#"], a[href*="about.html#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const hashIdx = href.indexOf('#');
      if (hashIdx === -1) return;
      const hash = href.slice(hashIdx);
      const isAboutPage = window.location.pathname.endsWith('about.html') || window.location.href.includes('about.html');
      const isInternal = href.startsWith('#') || isAboutPage;

      if (isInternal && document.querySelector(hash)) {
        e.preventDefault();
        scrollToTarget(hash);
        if (history.pushState) {
          history.pushState(null, '', hash);
        } else {
          window.location.hash = hash;
        }
      }
    });
  });

  // If page loads with a hash, wait for layout/fonts and scroll
  if (window.location.hash) {
    setTimeout(() => {
      scrollToTarget(window.location.hash);
    }, 180);
    window.addEventListener('load', () => {
      setTimeout(() => {
        scrollToTarget(window.location.hash);
      }, 100);
    }, { once: true });
  }
}


/* ==========================================================================
   Hero Architecture Inspector Dock (Pillar Switcher)
   ========================================================================== */
function initHeroDock() {
  const dockBtns = document.querySelectorAll('.stage-dock-btn');
  const dockTitle = document.getElementById('heroDockTitle');
  const dockDesc = document.getElementById('heroDockDesc');
  const dockTags = document.getElementById('heroDockTags');
  if (!dockBtns.length || !dockTitle || !dockDesc) return;

  const data = {
    aws: {
      title: 'AWS Cloud Architecture',
      desc: 'Multi-AZ topology with Anycast Route 53 DNS, CloudFront edge caching, and private S3 origins protected by strict SigV4 Origin Access Control (OAC).',
      tags: ['Route 53', 'CloudFront OAC', 'S3 Bucket', 'TLS 1.3', '99.992% SLA']
    },
    terraform: {
      title: 'Terraform IaC & State Locking',
      desc: '100% declarative HCL infrastructure with remote S3 state storage, DynamoDB distributed locking, and automated zero-drift enforcement.',
      tags: ['Declarative HCL', 'S3 Backend', 'DynamoDB Lock', 'Zero Drift', 'v1.5+']
    },
    docker: {
      title: 'Hardened Linux Containers',
      desc: 'Container kernel isolation with cgroups v2 and Linux namespaces. Multi-stage builds shrinking heavy 920MB SDKs into 28MB distroless runtimes.',
      tags: ['Distroless', 'cgroups v2', 'Non-Root User', 'Minimal Attack Surface']
    },
    actions: {
      title: 'Automated CI/CD Pipelines',
      desc: 'Keyless GitHub Actions workflows using OIDC STS authentication to assume IAM roles without long-lived secrets, invalidating edge caches in <4.0s.',
      tags: ['Keyless OIDC', 'GitHub Actions', 'Cache Invalidation', 'STS Role Assume']
    }
  };

  dockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-pillar');
      if (!data[key]) return;

      dockBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      dockTitle.textContent = data[key].title;
      dockDesc.textContent = data[key].desc;
      if (dockTags) {
        dockTags.innerHTML = data[key].tags.map(function(t) { return "<span class=\"stage-tag\">" + t + "</span>"; }).join("");
      }
    });
  });
}

/* ==========================================================================
   Smooth Animated Accordions for Reading Comfort & Ease (CSS Grid Driven)
   ========================================================================== */
function initAccordions() {
  const cards = document.querySelectorAll('.gum-accordion-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const trigger = card.querySelector('.gum-accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = card.classList.contains('is-open');

      if (isOpen) {
        card.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const checkHash = () => {
    const hash = window.location.hash;
    if (hash === '#cv') {
      const bgCard = document.getElementById('background-section');
      if (bgCard) {
        bgCard.classList.add('is-open');
        const trigger = bgCard.querySelector('.gum-accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
          const cvElem = document.getElementById('cv');
          if (cvElem) cvElem.scrollIntoView({ behavior: 'smooth' });
        }, 350);
      }
    } else if (hash) {
      const targetCard = document.querySelector(hash);
      if (targetCard && targetCard.classList.contains('gum-accordion-card')) {
        targetCard.classList.add('is-open');
        const trigger = targetCard.querySelector('.gum-accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    }
  };

  checkHash();
  window.addEventListener('hashchange', checkHash);
}

/* ==========================================================================
   Automatic 5-Posts-Per-Page Pagination for Blog
   ========================================================================== */
function initBlogPagination() {
  const feed = document.getElementById("blogFeed");
  const nav = document.getElementById("blogPagination");
  if (!feed || !nav) return;

  const POSTS_PER_PAGE = 5;
  const posts = Array.from(feed.querySelectorAll(".blog-post-card"));
  const placeholder = feed.querySelector(".blog-placeholder-card");
  const totalPosts = posts.length;

  if (totalPosts <= POSTS_PER_PAGE) {
    posts.forEach(p => p.style.display = "");
    if (placeholder) placeholder.style.display = "";
    nav.style.display = "none";
    return;
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const qPage = parseInt(params.get("page"), 10);
    if (!isNaN(qPage) && qPage >= 1 && qPage <= totalPages) return qPage;
    const hash = window.location.hash;
    const m = hash.match(/page[=-](\d+)/i);
    if (m) {
      const hPage = parseInt(m[1], 10);
      if (!isNaN(hPage) && hPage >= 1 && hPage <= totalPages) return hPage;
    }
    return 1;
  }

  function renderPage(pageNum, scrollIntoView = false) {
    if (pageNum < 1) pageNum = 1;
    if (pageNum > totalPages) pageNum = totalPages;

    const startIdx = (pageNum - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;

    posts.forEach((post, idx) => {
      if (idx >= startIdx && idx < endIdx) {
        post.style.display = "";
      } else {
        post.style.display = "none";
      }
    });

    if (placeholder) {
      placeholder.style.display = (pageNum === totalPages) ? "" : "none";
    }

    nav.innerHTML = "";
    nav.style.display = "flex";

    // Prev Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "blog-page-btn prev-btn" + (pageNum === 1 ? " disabled" : "");
    prevBtn.type = "button";
    prevBtn.innerHTML = "&larr; Prev";
    prevBtn.setAttribute("aria-label", "Previous Page");
    prevBtn.addEventListener("click", () => goToPage(pageNum - 1));
    nav.appendChild(prevBtn);

    // Numbered Buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.className = "blog-page-btn" + (i === pageNum ? " active" : "");
      pageBtn.type = "button";
      pageBtn.textContent = i;
      pageBtn.setAttribute("aria-label", "Page " + i);
      if (i !== pageNum) {
        pageBtn.addEventListener("click", () => goToPage(i));
      }
      nav.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "blog-page-btn next-btn" + (pageNum === totalPages ? " disabled" : "");
    nextBtn.type = "button";
    nextBtn.innerHTML = "Next &rarr;";
    nextBtn.setAttribute("aria-label", "Next Page");
    nextBtn.addEventListener("click", () => goToPage(pageNum + 1));
    nav.appendChild(nextBtn);

    if (scrollIntoView) {
      feed.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function goToPage(p) {
    const url = new URL(window.location);
    url.searchParams.set("page", p);
    window.history.pushState({ page: p }, "", url);
    renderPage(p, true);
  }

  window.addEventListener("popstate", () => {
    renderPage(getPageFromURL(), false);
  });

  renderPage(getPageFromURL(), false);
}

/* ==========================================================================
   App Initialization
   ========================================================================== */
function initApp() {
  const tasks = [
    initLiveClocks,
    initIntroSplash,
    initHeroDock,
    initChapterTabs,
    initVisualizerToggles,
    initInfraNodeFlow,
    initConsoleTabs,
    initCopyCodeButtons,
    initInteractiveTerminal,
    initTopicPills,
    initCopyEmail,
    initBackToTop,
    initNavSearch,
    initHashScroll,
    initAccordions,
    initBlogPagination
  ];

  tasks.forEach(fn => {
    try {
      if (typeof fn === 'function') fn();
    } catch (err) {
      console.warn('Init task error:', err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
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
