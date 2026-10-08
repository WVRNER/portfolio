---
title: "How I Built and Deployed This Website: Git, Eleventy, GitHub Actions & Pages"
slug: how-this-site-is-built-and-deployed
subtitle: A technical breakdown of the architecture, build pipeline, DNS resolution, and automated delivery workflow powering my personal portfolio.
excerpt: A comprehensive DevOps case study exploring the static site architecture, Eleventy compilation, Pages CMS content management, Cloudflare DNS configuration, and automated GitHub Actions deployment pipeline behind wvrner.com.
author: Nima Hosseini
date: 2026-10-05
display_date: October 2026
updated: 2026-10-05
read_time: 12 min read
post_tags:
  - "DevOps"
  - "GitHubActions"
  - "GitHubPages"
  - "Cloudflare"
  - "CICD"
  - "Linux"
  - "GitOps"
  - "OpenSource"
toc: false
callout_box:
  enable: false
seo:
  no_index: false
published: true
featured: false
layout: post.njk
templateEngineOverride: md
---

Building a personal portfolio website is a standard rite of passage for software and systems engineers. However, instead of treating this site merely as an online resume or relying on an off-the-shelf dynamic CMS, I approached the portfolio itself as a real infrastructure, automation, and deployment engineering project.

As an aspiring DevOps and infrastructure systems engineer, my objective was not just to put pages on the internet, but to design, implement, and document a disciplined delivery lifecycle: declarative configuration, strict version control, reproducible local builds, automated CI/CD pipelines, managed DNS resolution, and secure HTTPS delivery.

This technical case study documents the complete architecture, implementation decisions, real-world troubleshooting encounters, and operational lessons behind [wvrner.com](https://wvrner.com).

---

## 1. Project Goal: Treating the Portfolio as an Infrastructure Project

When designing modern systems, the boundary between application code and operational infrastructure has largely dissolved. Systems engineers must know how software packages are built, how automated delivery pipelines validate code, and how network packets traverse the internet to reach visitors.

**ARCHITECTURAL PRINCIPLE: Treating Content as Code (GitOps)**

Every single artifact—from markdown articles and Nunjucks templates to the CI/CD pipeline and DNS domain bindings—lives in Git. No manual dashboard edits, no unversioned server state, and zero configuration drift.

For this website, I established seven foundational technical requirements:

1. **Zero Runtime Server Vulnerabilities**: Eliminate backend operating systems, runtime application servers (Node/Python/PHP), and database connection pools that require ongoing OS patching and security monitoring.
2. **Immutable Version Control**: Every change—whether styling, content, or deployment workflows—must be committed as an atomic Git commit.
3. **Automated CI/CD Delivery**: Manual FTP uploads, SSH deployments, or direct file pushing are strictly forbidden. Pushing to `main` must autonomously test, compile, and deploy the site.
4. **Reproducible Local Environment**: Builds executed in GitHub Actions must execute identically on local development environments using isolated dependency locks.
5. **Decoupled Headless Editorial Workflow**: Managing blog articles should be intuitive via a browser-based UI (Pages CMS) without requiring raw git commands for quick writing, yet writing back directly to Git commits.
6. **Managed Anycast DNS & Edge TLS**: DNS resolution must resolve globally through authoritative Anycast nameservers, terminating HTTPS securely with automated certificate renewal.
7. **Strict Engineering Honesty**: Clearly differentiate what was personally configured and automated versus the underlying platform services provided by GitHub and Cloudflare.

---

## 2. High-Level Systems Architecture

The site operates across four distinct operational tiers: Local Development, Version Control, Continuous Integration/Continuous Deployment (CI/CD), and Edge Static Hosting.

<div class="arch-visual-window">
  <div class="arch-window-bar">
    <div class="arch-window-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
    </div>
    <span class="arch-window-title">// DIAGRAM 01: 4-TIER ARCHITECTURE TOPOLOGY</span>
    <span class="arch-status-pill">PRODUCTION SYSTEM</span>
  </div>
  <div class="arch-window-body">
    <div class="arch-tier-grid">
      <!-- Tier 1 -->
      <div class="arch-tier-card">
        <div class="tier-card-header">
          <span class="tier-badge">TIER 01 &bull; AUTHORING &amp; DEV</span>
          <span class="tier-icon">💻</span>
        </div>
        <h4 class="tier-title">Local Developer Machine</h4>
        <p class="tier-desc">Isolated local authoring environment. Zero direct production access or manual FTP uploads.</p>
        <div class="tier-tools-list">
          <span class="tier-tool-chip">VS Code</span>
          <span class="tier-tool-chip">Node.js 22</span>
          <span class="tier-tool-chip">11ty Dev Server</span>
          <span class="tier-tool-chip">Atomic Commits</span>
        </div>
        <div class="tier-flow-action">
          <span>git push origin main</span>
          <span class="flow-arrow">&rarr;</span>
        </div>
      </div>

      <!-- Tier 2 -->
      <div class="arch-tier-card">
        <div class="tier-card-header">
          <span class="tier-badge">TIER 02 &bull; SOURCE OF TRUTH</span>
          <span class="tier-icon">🐙</span>
        </div>
        <h4 class="tier-title">GitHub Git Repository</h4>
        <p class="tier-desc">Immutable distributed version control tracking 100% of website state and configuration.</p>
        <div class="tier-tools-list">
          <span class="tier-tool-chip">Protected main</span>
          <span class="tier-tool-chip">.pages.yml CMS</span>
          <span class="tier-tool-chip">Audit Trail</span>
          <span class="tier-tool-chip">GitOps</span>
        </div>
        <div class="tier-flow-action">
          <span>Webhook trigger on push</span>
          <span class="flow-arrow">&rarr;</span>
        </div>
      </div>

      <!-- Tier 3 -->
      <div class="arch-tier-card">
        <div class="tier-card-header">
          <span class="tier-badge">TIER 03 &bull; CI/CD AUTOMATION</span>
          <span class="tier-icon">⚡</span>
        </div>
        <h4 class="tier-title">GitHub Actions Runner</h4>
        <p class="tier-desc">Automated, reproducible container execution executing linting, compilation, and keyless OIDC release.</p>
        <div class="tier-steps-compact">
          <div class="step-item"><span class="step-num">1</span><span>actions/checkout@v4</span></div>
          <div class="step-item"><span class="step-num">2</span><span>actions/setup-node@v4</span></div>
          <div class="step-item"><span class="step-num">3</span><span>npm ci (strict lockfile)</span></div>
          <div class="step-item"><span class="step-num">4</span><span>npx @11ty/eleventy</span></div>
          <div class="step-item"><span class="step-num">5</span><span>upload-pages-artifact@v3</span></div>
          <div class="step-item"><span class="step-num">6</span><span>deploy-pages@v4 (OIDC)</span></div>
        </div>
        <div class="tier-flow-action">
          <span>Upload artifact to Edge</span>
          <span class="flow-arrow">&rarr;</span>
        </div>
      </div>

      <!-- Tier 4 -->
      <div class="arch-tier-card">
        <div class="tier-card-header">
          <span class="tier-badge">TIER 04 &bull; GLOBAL HOSTING &amp; DNS</span>
          <span class="tier-icon">🌐</span>
        </div>
        <h4 class="tier-title">GitHub Pages Edge &amp; Cloudflare</h4>
        <p class="tier-desc">Global Anycast edge servers with automatic TLS certificates delivering sub-50ms TTFB.</p>
        <div class="tier-tools-list">
          <span class="tier-tool-chip">4 Apex Anycast IPs</span>
          <span class="tier-tool-chip">Cloudflare DNS</span>
          <span class="tier-tool-chip">TLS 1.3 HTTPS</span>
          <span class="tier-tool-chip">wvrner.com</span>
        </div>
        <div class="tier-flow-action success">
          <span>Sub-50ms response to Visitor</span>
          <span class="flow-check">&check;</span>
        </div>
      </div>
    </div>
  </div>
</div>

---

## 3. Custom Domain & DNS Architecture

DNS (Domain Name System) is the backbone of internet routing. For `wvrner.com`, domain configuration is handled cleanly between the domain registrar, Cloudflare DNS, and GitHub Pages.

### Authoritative DNS Delegation Flow

<div class="arch-visual-window">
  <div class="arch-window-bar">
    <div class="arch-window-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
    </div>
    <span class="arch-window-title">// DIAGRAM 02: AUTHORITATIVE DNS RESOLUTION TIMELINE</span>
    <span class="arch-status-pill">UDP / 53</span>
  </div>
  <div class="arch-window-body">
    <div class="dns-timeline-flow">
      <div class="dns-flow-step">
        <div class="dns-step-header">
          <span class="dns-step-num">01</span>
          <span class="dns-step-title">Browser Query</span>
        </div>
        <p class="dns-step-desc">Visitor types <code>wvrner.com</code>. Local OS checks resolver cache, then forwards request to recursive DNS.</p>
      </div>

      <div class="dns-flow-arrow">&rarr;</div>

      <div class="dns-flow-step">
        <div class="dns-step-header">
          <span class="dns-step-num">02</span>
          <span class="dns-step-title">Root &amp; TLD Referral</span>
        </div>
        <p class="dns-step-desc">Root nameservers refer resolver to <code>.com</code> registry nameservers operated by Verisign.</p>
      </div>

      <div class="dns-flow-arrow">&rarr;</div>

      <div class="dns-flow-step">
        <div class="dns-step-header">
          <span class="dns-step-num">03</span>
          <span class="dns-step-title">Cloudflare Delegation</span>
        </div>
        <p class="dns-step-desc">Registry delegates authority to Cloudflare Anycast nameservers (<code>ns1.cloudflare.com</code>).</p>
      </div>

      <div class="dns-flow-arrow">&rarr;</div>

      <div class="dns-flow-step">
        <div class="dns-step-header">
          <span class="dns-step-num">04</span>
          <span class="dns-step-title">Apex A Resolution</span>
        </div>
        <p class="dns-step-desc">Cloudflare returns 4 Anycast IPv4 addresses (<code>185.199.108.153</code>...). Browser initiates TLS handshake.</p>
      </div>
    </div>
  </div>
</div>

### Configured DNS Records

**// DNS ZONE CONFIGURATION (BIND FORMAT)**

```dns
; Authoritative Apex IPv4 Records (GitHub Pages Anycast Load Balancing)
@               300     IN      A       185.199.108.153
@               300     IN      A       185.199.109.153
@               300     IN      A       185.199.110.153
@               300     IN      A       185.199.111.153

; Canonical Name for Subdomain Ingress
www             300     IN      CNAME   wvrner.github.io.

; Custom Domain Verification (GitHub Ownership Validation)
_gh-wvrner      300     IN      TXT     "github-pages-verification-token"
```

**DNS HONESTY: DNS Management vs. Edge Reverse Proxying**

Cloudflare is configured as an authoritative DNS manager (DNS Only mode). Queries resolve to GitHub Pages' official IP addresses. The TLS certificate is issued directly by GitHub Pages via Let's Encrypt, not through Cloudflare edge proxying.

---

## 4. Static Site Generation: Architecture & Rationale

Dynamic content management systems (like WordPress or Drupal) execute code on every request: a client sends an HTTP GET, a PHP/Node worker queries a relational SQL database, compiles an HTML string in memory, and returns it. This introduces execution latency, database lock contention, memory overhead, and severe vulnerability surfaces.

### Dynamic Architecture vs. Static Site Generation

| Evaluation Criteria | Dynamic CMS (WordPress / Node.js) | Static Site Generator (Eleventy + Pages) |
| :--- | :--- | :--- |
| **Request Execution** | Server evaluates code & queries DB per hit | Pre-compiled static HTML served directly from disk |
| **Security Surface** | High (SQL injection, XSS, plugin CVEs) | Zero (Read-only static files; no server runtime) |
| **Time to First Byte** | 200ms – 1200ms (dependent on DB & cache) | 15ms – 50ms (served directly from Anycast edge) |
| **Infrastructure Cost** | Ongoing ($5–$50/mo for VPS + managed DB) | $0.00 (Zero hosting overhead) |
| **Disaster Recovery** | Complex SQL dumps & stateful backups | Instant `git clone` contains 100% of website state |

---

## 5. The Build Engine: Eleventy (11ty)

Eleventy serves as the build engine. It transforms raw Markdown files and Nunjucks layout templates into semantic HTML pages during the build step.

<div class="arch-visual-window">
  <div class="arch-window-bar">
    <div class="arch-window-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
    </div>
    <span class="arch-window-title">// DIAGRAM 03: ELEVENTY COMPILATION PIPELINE</span>
    <span class="arch-status-pill">0.12s BUILD</span>
  </div>
  <div class="arch-window-body">
    <div class="pipeline-3col-grid">
      <div class="pipeline-col">
        <div class="pipeline-col-badge">1. INPUT ARTIFACTS</div>
        <ul class="pipeline-col-list">
          <li><code>./posts/*.md</code> (Content)</li>
          <li><code>./_includes/post.njk</code> (Layout)</li>
          <li><code>./styles/*</code> (CSS System)</li>
          <li><code>./js/*</code> (Interactions)</li>
          <li><code>./CNAME</code> (Domain Binding)</li>
        </ul>
      </div>

      <div class="pipeline-col-connector">&rarr;</div>

      <div class="pipeline-col featured">
        <div class="pipeline-col-badge accent">2. 11ty ENGINE (v3)</div>
        <ul class="pipeline-col-list">
          <li>Passthrough static copies</li>
          <li>Parse post collections</li>
          <li>Sort chronological metadata</li>
          <li>Inject Markdown into layouts</li>
          <li>Compute canonical permalinks</li>
        </ul>
      </div>

      <div class="pipeline-col-connector">&rarr;</div>

      <div class="pipeline-col">
        <div class="pipeline-col-badge">3. OUTPUT (_site)</div>
        <ul class="pipeline-col-list">
          <li><code>./_site/index.html</code></li>
          <li><code>./_site/posts/*.html</code></li>
          <li><code>./_site/blog/index.html</code></li>
          <li><code>./_site/styles/main.css</code></li>
          <li><code>./_site/CNAME</code></li>
        </ul>
      </div>
    </div>
  </div>
</div>

### Eleventy Configuration & Directory Defaults

The build process is governed by two essential declarative files: `.eleventy.js` (asset passthrough copies & post collection sorting) and `posts/posts.json` (dynamic permalinks & layout defaults).

<details class="clean-code-accordion">
  <summary class="clean-code-summary">
    <div class="summary-left">
      <span class="file-name">.eleventy.js</span>
      <span class="file-badge">Configuration</span>
    </div>
    <span class="summary-toggle">View full source &darr;</span>
  </summary>
  <div class="clean-code-body">
    <pre><code class="language-javascript">module.exports = function (eleventyConfig) {
  // Passthrough copy for static assets (zero processing, direct copy)
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Automatically collect every Markdown blog post, sorted newest first
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("./posts/*.md")
      .filter((post) => post.data.published !== false)
      .sort((a, b) => {
        const dateA = new Date(a.data.date || a.date);
        const dateB = new Date(b.data.date || b.date);
        return (dateB.getTime() - dateA.getTime()) || b.inputPath.localeCompare(a.inputPath);
      });
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
  };
};</code></pre>
  </div>
</details>

<details class="clean-code-accordion">
  <summary class="clean-code-summary">
    <div class="summary-left">
      <span class="file-name">posts/posts.json</span>
      <span class="file-badge">Directory Defaults</span>
    </div>
    <span class="summary-toggle">View schema &darr;</span>
  </summary>
  <div class="clean-code-body">
    <pre><code class="language-json">{
  "layout": "post.njk",
  "tags": ["posts"],
  "permalink": "/posts/{{ page.fileSlug }}.html"
}</code></pre>
  </div>
</details>

---

## 6. Content Management & Headless Publishing with Pages CMS

While developers are comfortable writing in VS Code and running git commands in terminal, writing articles on mobile or without developer tooling requires an accessible interface.

Pages CMS operates as an open-source, client-side, headless CMS. It authenticates via GitHub OAuth and writes commits directly into the repository via the GitHub REST API.

<details class="clean-code-accordion">
  <summary class="clean-code-summary">
    <div class="summary-left">
      <span class="file-name">.pages.yml</span>
      <span class="file-badge">Pages CMS Schema</span>
    </div>
    <span class="summary-toggle">View YAML specification &darr;</span>
  </summary>
  <div class="clean-code-body">
    <pre><code class="language-yaml">media:
  input: images
  output: /images
  categories: [image, document, compressed, code]
  rename: safe

content:
  - name: posts
    label: Blog Posts
    type: collection
    path: posts
    filename: "{fields.slug}.md"
    fields:
      - name: title
        label: Post Title
        type: string
        required: true
      - name: slug
        label: URL Slug
        type: string
        required: true
        pattern: "^[a-z0-9-]+$"
      - name: subtitle
        label: Subtitle / Hook
        type: string
        required: true
      - name: excerpt
        label: Blog Feed Teaser
        type: text
        required: true
      - name: category
        label: Category Badge
        type: select
        required: true
        options:
          values:
            - "DEVOPS & INFRASTRUCTURE"
            - "CERTIFICATION & LAB LOG"
            - "CLOUD ARCHITECTURE & AWS"
            - "LINUX & KERNEL SYSTEMS"
      - name: date
        label: Publication Date
        type: date
        default: now
        required: true
      - name: display_date
        label: Display Date
        type: string
        required: true
      - name: read_time
        label: Reading Time
        type: string
        required: true
      - name: post_tags
        label: Topic Tags
        type: list
      - name: published
        label: Published Status
        type: boolean
        default: true
      - name: body
        label: Article Content
        type: rich-text</code></pre>
  </div>
</details>

---

## 7. Static Pagination & Collection Architecture

In `blog.njk`, pagination is evaluated statically at build time using Eleventy's collection engine:

<details class="clean-code-accordion">
  <summary class="clean-code-summary">
    <div class="summary-left">
      <span class="file-name">blog.njk</span>
      <span class="file-badge">Pagination Header</span>
    </div>
    <span class="summary-toggle">View front matter &darr;</span>
  </summary>
  <div class="clean-code-body">
    <pre><code class="language-html">---
pagination:
  data: collections.posts
  size: 5
  alias: posts
permalink: "/blog/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---</code></pre>
  </div>
</details>

### Generated Route Topology

- **Page 1 (`pageNumber == 0`)**: Emits `_site/blog/index.html` &rarr; accessible as `/blog/`
- **Page 2 (`pageNumber == 1`)**: Emits `_site/blog/2/index.html` &rarr; accessible as `/blog/2/`
- **Page 3 (`pageNumber == 2`)**: Emits `_site/blog/3/index.html` &rarr; accessible as `/blog/3/`

Because each page is compiled into a discrete static HTML file, pagination requests require zero client-side JavaScript or API hydration.

---

## 8. Automated CI/CD Pipeline: GitHub Actions

Manual deployments lead to human error, missed asset bundles, and configuration drift. In this repository, deployment is handled entirely by GitHub Actions.

<div class="arch-visual-window">
  <div class="arch-window-bar">
    <div class="arch-window-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
    </div>
    <span class="arch-window-title">// DIAGRAM 04: GITHUB ACTIONS DEPLOYMENT WORKFLOW</span>
    <span class="arch-status-pill">UBUNTU RUNNER</span>
  </div>
  <div class="arch-window-body">
    <div class="runner-steps-grid">
      <div class="runner-step-card">
        <span class="step-badge">STEP 1</span>
        <h5>Checkout Repo</h5>
        <p><code>actions/checkout@v4</code> clones commit SHA into isolated runner workspace.</p>
      </div>
      <div class="runner-step-card">
        <span class="step-badge">STEP 2</span>
        <h5>Node.js Setup</h5>
        <p><code>actions/setup-node@v4</code> configures Node 22 and restores cached dependencies.</p>
      </div>
      <div class="runner-step-card">
        <span class="step-badge">STEP 3</span>
        <h5>Strict Clean Install</h5>
        <p><code>npm ci</code> validates SHA-512 checksums without mutating <code>package-lock.json</code>.</p>
      </div>
      <div class="runner-step-card">
        <span class="step-badge">STEP 4</span>
        <h5>Eleventy Build</h5>
        <p><code>npx @11ty/eleventy</code> compiles site into <code>./_site</code> in &lt;0.2s.</p>
      </div>
      <div class="runner-step-card">
        <span class="step-badge">STEP 5</span>
        <h5>Archive Artifact</h5>
        <p><code>upload-pages-artifact@v3</code> packages <code>./_site</code> into a verified tarball.</p>
      </div>
      <div class="runner-step-card">
        <span class="step-badge">STEP 6</span>
        <h5>Deploy via OIDC</h5>
        <p><code>deploy-pages@v4</code> authenticates via keyless OIDC token to GitHub Pages.</p>
      </div>
    </div>
  </div>
</div>

### Complete CI/CD Workflow Specification

<details class="clean-code-accordion">
  <summary class="clean-code-summary">
    <div class="summary-left">
      <span class="file-name">.github/workflows/deploy.yml</span>
      <span class="file-badge">GitHub Actions CI/CD</span>
    </div>
    <span class="summary-toggle">View full pipeline source &darr;</span>
  </summary>
  <div class="clean-code-body">
    <pre><code class="language-yaml">name: Deploy Eleventy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Build Static Site with Eleventy
        run: npx @11ty/eleventy

      - name: Package Build Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "_site"

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4</code></pre>
  </div>
</details>

---

## 9. Deep-Dive: `npm ci` vs. `npm install` in CI/CD

One of the most critical operational distinctions in pipeline design is using `npm ci` rather than `npm install`:

<div class="arch-visual-window">
  <div class="arch-window-bar">
    <div class="arch-window-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
    </div>
    <span class="arch-window-title">// DIAGRAM 05: PACKAGE INSTALLATION GUARANTEE</span>
    <span class="arch-status-pill">LOCKFILE INTEGRITY</span>
  </div>
  <div class="arch-window-body">
    <div class="install-compare-grid">
      <div class="compare-card danger">
        <div class="compare-card-badge">MANUAL DEV: npm install</div>
        <p>Reads semver ranges. Can silently mutate <code>package-lock.json</code> when dependencies release minor updates. Causes build divergence across machines.</p>
        <span class="compare-verdict risk">&times; Non-deterministic in CI</span>
      </div>
      <div class="compare-card success">
        <div class="compare-card-badge">AUTOMATED CI: npm ci</div>
        <p>Deletes <code>node_modules/</code> completely. Enforces 100% cryptographic SHA-512 checksum matching against <code>package-lock.json</code>. Fails if lockfile drifts.</p>
        <span class="compare-verdict safe">&check; 100% Byte-for-byte Deterministic</span>
      </div>
    </div>
  </div>
</div>

| Operational Characteristic | `npm install` | `npm ci` (Used in wvrner.com) |
| :--- | :--- | :--- |
| **Intended Context** | Local manual development | Automated CI/CD execution environments |
| **Lockfile Handling** | Modifies `package-lock.json` if dependencies drift | Strictly read-only; never touches lockfile |
| **Dependency Resolution** | Re-evaluates semver ranges against npm registry | Unpacks exact pinned versions from lockfile |
| **Lockfile Discrepancies** | Silently updates lockfile | Fails immediately with exit code 1 |
| **Clean-Slate Guarantee** | Overwrites in-place | Automatically deletes `node_modules/` before installing |
| **Build Reproducibility** | Non-deterministic across machines | 100% byte-for-byte deterministic |

---

## 10. What Happens When I Push? (End-to-End Sequence Walkthrough)

To appreciate modern automated infrastructure, consider the complete sequence of events triggered by a simple git push:

<div class="arch-visual-window">
  <div class="arch-window-bar">
    <div class="arch-window-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
    </div>
    <span class="arch-window-title">// DIAGRAM 06: FULL DEPLOYMENT LIFECYCLE</span>
    <span class="arch-status-pill">&lt; 4.0s TOTAL</span>
  </div>
  <div class="arch-window-body">
    <div class="sequence-cards-flow">
      <div class="seq-step">
        <span class="seq-num">1</span>
        <div class="seq-content">
          <strong>Git Commit &amp; Push</strong>
          <span>Developer executes <code>git push origin main</code> from local workstation.</span>
        </div>
      </div>
      <div class="seq-step">
        <span class="seq-num">2</span>
        <div class="seq-content">
          <strong>GitHub Webhook</strong>
          <span>GitHub receives push event and dispatches webhook to workflow runner.</span>
        </div>
      </div>
      <div class="seq-step">
        <span class="seq-num">3</span>
        <div class="seq-content">
          <strong>Actions Execution</strong>
          <span>Runner spins up ephemeral Ubuntu container, verifies lockfile, and runs Eleventy.</span>
        </div>
      </div>
      <div class="seq-step">
        <span class="seq-num">4</span>
        <div class="seq-content">
          <strong>OIDC Deployment</strong>
          <span>Short-lived federated OIDC token deploys compiled artifact to Pages edge servers.</span>
        </div>
      </div>
      <div class="seq-step success">
        <span class="seq-num">&check;</span>
        <div class="seq-content">
          <strong>Global Edge Live</strong>
          <span>Site is live worldwide across Cloudflare Anycast and GitHub Pages in &lt; 4.0s.</span>
        </div>
      </div>
    </div>
  </div>
</div>

1. **Local Commit & Push**: The engineer executes `git commit` and `git push origin main`. Git transfers commit objects to GitHub over SSH.
2. **Webhook Dispatch**: GitHub's internal event router captures the push event on `refs/heads/main` and queues the `Deploy Eleventy to GitHub Pages` workflow.
3. **Runner Provisioning**: GitHub assigns an ephemeral Ubuntu virtual machine container (`ubuntu-latest`).
4. **Environment Setup**: `actions/setup-node@v4` configures Node 22 and checks for cached npm packages matching `package-lock.json`.
5. **Clean Dependency Installation**: `npm ci` verifies cryptographic hashes and mounts dependencies into `node_modules/`.
6. **Static Compilation**: `npx @11ty/eleventy` evaluates collections, compiles Markdown into HTML, executes Nunjucks layouts, and outputs production files into `_site/`.
7. **Artifact Archiving**: `actions/upload-pages-artifact@v3` packages `_site/` into an immutable tarball.
8. **Atomic Deployment**: `actions/deploy-pages@v4` exchanges a short-lived OIDC token with the GitHub Pages deployment service and atomically updates the web server mount.
9. **DNS Routing**: When a visitor enters `https://wvrner.com`, their resolver queries Cloudflare Anycast nameservers, receiving GitHub Pages IP addresses (`185.199.108.153`).
10. **TLS Termination & Serving**: GitHub Pages terminates TLS 1.3 using a Let's Encrypt certificate and streams static HTML directly to the browser.

---

## 11. Real-World Troubleshooting & Debugging Log

Infrastructure engineering is defined not by how systems behave when everything goes right, but by how issues are diagnosed when they break. Here are three real engineering problems solved during this build:

**INCIDENT 01: Broken CSS on Nested Article Paths**

- **Symptom:** The homepage loaded stylesheets properly, but navigating to `/posts/first-course.html` resulted in unstyled plain HTML.  
- **Root Cause:** `_includes/post.njk` used relative stylesheet links: `<link rel="stylesheet" href="styles/main.css">`. On nested URL paths, the browser resolved this relative to the current directory (`/posts/styles/main.css`), returning a 404.  
- **Fix:** Converted all asset links to root-relative paths: `href="/styles/main.css"` and `src="/js/main.js"`.

**INCIDENT 02: Git Divergence between Web CMS & Local Machine**

- **Symptom:** Local `git push origin main` was rejected with `[rejected - non-fast-forward]`.  
- **Root Cause:** Pages CMS authors commits directly on the remote GitHub repository via the GitHub REST API. Meanwhile, local file edits occurred offline without pulling the remote changes first.  
- **Fix:** Executed `git pull --rebase origin main` to replay local commits on top of the remote CMS commits, maintaining a linear Git history without messy merge commits.

**INCIDENT 03: Template Parsing Crashes on Code Snippets**

- **Symptom:** Eleventy crashed during compilation with `AssertionError: undefined filter: safe`.  
- **Root Cause:** Eleventy pre-processes Markdown files with Liquid by default. When the article contained example Nunjucks code snippets like `{{ content | safe }}`, Liquid attempted to evaluate them as active directives.  
- **Fix:** Added `templateEngineOverride: md` to the article's front matter, instructing Eleventy to treat the file body strictly as pure Markdown without template evaluation.

---

## 12. Technology Breakdown: What, Why & Role

| Component | Technology | Operational Role | Rationale & Selection Criteria |
| :--- | :--- | :--- | :--- |
| **Version Control** | Git | Distributed change tracking | Immutable historical audit trail; standard for GitOps |
| **Repository Host** | GitHub | Centralized collaboration | Native CI/CD hooks and secure OIDC integration |
| **Build Engine** | Eleventy (11ty) | Static site generator | Zero client-side JS overhead, flexible templating, 0.12s build times |
| **CI/CD Platform** | GitHub Actions | Automated build & deploy | Integrated execution, secretless OIDC token deployment |
| **Static Hosting** | GitHub Pages | Global file delivery | Zero cost, native HTTPS certificate issuance, high availability |
| **DNS Management** | Cloudflare DNS | Authoritative nameservers | Global Anycast network, sub-10ms resolution, robust API |
| **Content Editor** | Pages CMS | Headless Git-backed CMS | Web authoring directly committed to repository as Markdown |
| **Design System** | Neubrutalist CSS | Frontend presentation | High-contrast readability, 0 runtime framework dependencies |

---

## 13. Practical Lessons for Junior DevOps Engineers

1. **Understand Where Configuration Lives**: A common junior mistake is changing settings manually in web consoles. In modern DevOps, if a setting is not committed to code or declarative configuration, it does not exist.
2. **Treat CI/CD as Production Code**: Pipelines are not secondary scripts; they are production software. Pin action versions (`@v4`), enforce strict lockfiles (`npm ci`), and set explicit least-privilege security permissions.
3. **Know the Network Path**: Understand every hop a packet takes—from browser DNS lookup to Anycast nameserver, TCP handshake, TLS negotiation, reverse proxy routing, and static file streaming.
4. **Be Transparent About Infrastructure**: Real engineering maturity means honestly acknowledging which platform abstractions you depend on. Don't claim to have built an Anycast CDN when you configured DNS records to point to GitHub Pages.

---

## 14. Project Resources & Links

- **Live Website**: [https://wvrner.com](https://wvrner.com)
- **Source Code Repository**: [https://github.com/WVRNER/portfolio](https://github.com/WVRNER/portfolio)
- **Author**: Nima Hosseini ([@wvrner](https://github.com/wvrner))
