---
title: "How I Built and Deployed This Website: Git, Eleventy, GitHub Actions & Pages"
slug: "how-this-site-is-built-and-deployed"
subtitle: "A technical breakdown of the architecture, build pipeline, DNS resolution, and automated delivery workflow powering my personal portfolio."
excerpt: "A comprehensive DevOps case study exploring the static site architecture, Eleventy compilation, Pages CMS content management, Cloudflare DNS configuration, and automated GitHub Actions deployment pipeline behind wvrner.com."
category: "DEVOPS & INFRASTRUCTURE"
display_date: "October 2026"
date: 2026-10-05
read_time: "12 min read"
post_tags:
  - "#DevOps"
  - "#GitHubActions"
  - "#GitHubPages"
  - "#Cloudflare"
  - "#CICD"
  - "#Linux"
  - "#GitOps"
  - "#OpenSource"
published: true
featured: true
---

Building a personal portfolio website is a standard rite of passage for software and systems engineers. However, instead of treating this site merely as an online resume or relying on an off-the-shelf dynamic CMS, I approached the portfolio itself as a real infrastructure, automation, and deployment engineering project.

As an aspiring DevOps and infrastructure systems engineer, my objective was not just to put pages on the internet, but to design, implement, and document a disciplined delivery lifecycle: declarative configuration, strict version control, reproducible local builds, automated CI/CD pipelines, managed DNS resolution, and secure HTTPS delivery.

This technical case study documents the complete architecture, implementation decisions, real-world troubleshooting encounters, and operational lessons behind [wvrner.com](https://wvrner.com).

---

## 1. Project Goal: Treating the Portfolio as an Infrastructure Project

When designing modern systems, the boundary between application code and operational infrastructure has largely dissolved. Systems engineers must know how software packages are built, how automated delivery pipelines validate code, and how network packets traverse the internet to reach visitors.

<div class="blog-callout-box" style="border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; margin: 26px 0; padding: 22px 24px; background: #FFFDF5;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
    <span class="blog-category-tag" style="background: var(--gum-yellow, #FFC900); font-size: 11px; font-weight: 800; padding: 3px 10px;">ARCHITECTURAL PRINCIPLE</span>
    <strong style="font-size: 16.5px; font-family: var(--font-display, sans-serif);">Treating Content as Code (GitOps)</strong>
  </div>
  <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #222222;">
    Every single artifact—from markdown articles and Nunjucks templates to the CI/CD pipeline and DNS domain bindings—lives in Git. No manual dashboard edits, no unversioned server state, and zero configuration drift.
  </p>
</div>

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

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #58A6FF;">// DIAGRAM 01: 4-TIER ARCHITECTURE OVERVIEW</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">ASCII ARCHITECTURE</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.5; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>+---------------------------------------------------------------------------------------------------+
|                                  SYSTEM ARCHITECTURE TOPOLOGY                                     |
+---------------------------------------------------------------------------------------------------+

 [ TIER 1: AUTHORING & DEV ]             [ TIER 2: SOURCE OF TRUTH ]
 +--------------------------+            +----------------------------------+
 |  Local Developer Machine |            |      GitHub Git Repository       |
 |  - VS Code / Terminal    |            |   (github.com/WVRNER/portfolio)  |
 |  - Node.js 22 & npm      |            |                                  |
 |  - Eleventy Dev Server   |            |  - Protected 'main' branch       |
 |  - Local Git Commits     |            |  - Complete commit history       |
 +------------+-------------+            |  - .pages.yml content schema     |
              |                          +-----------------+----------------+
              | git push origin main                       |
              +------------------------------------------->| Webhook trigger on push
                                                           v
 [ TIER 4: GLOBAL HOSTING & DNS ]        [ TIER 3: CI/CD PIPELINE ]
 +----------------------------------+    +----------------------------------+
 |       GitHub Pages Edge          |    |     GitHub Actions Runner        |
 |  - Anycast CDN edge servers      |    |       (ubuntu-latest)            |
 |  - Static asset storage          |<---|                                  |
 |  - Automatic Let's Encrypt TLS   |    |  1. actions/checkout@v4          |
 |  - Custom domain: wvrner.com     |    |  2. actions/setup-node@v4 (cache)|
 +----------------+-----------------+    |  3. npm ci (clean lockfile)      |
                  ^                      |  4. npx @11ty/eleventy (build)   |
                  | A / CNAME Records    |  5. upload-pages-artifact@v3     |
 +----------------+-----------------+    |  6. deploy-pages@v4 (OIDC)       |
 |    Cloudflare DNS Engine         |    +----------------------------------+
 |  - Authoritative DNS resolution  |
 |  - Global Anycast network        |
 +----------------+-----------------+
                  ^
                  | DNS Query (UDP/53)
 +----------------+-----------------+
 |         Visitor Browser          |
 |  - Pure semantic HTML5 + CSS     |
 |  - Sub-100ms global response     |
 +----------------------------------+</code></pre>
</div>

---

## 3. Custom Domain & DNS Architecture

DNS (Domain Name System) is the backbone of internet routing. For `wvrner.com`, domain configuration is handled cleanly between the domain registrar, Cloudflare DNS, and GitHub Pages.

### Authoritative DNS Delegation Flow

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #58A6FF;">// DIAGRAM 02: DNS DELEGATION & RESOLUTION PATH</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">DNS FLOW</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.5; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>+--------------------+      1. Query "wvrner.com"       +----------------------+
|  Visitor Browser   | -------------------------------> |  Local DNS Resolver  |
+--------------------+                                  +----------+-----------+
                                                                   |
                         2. Referral to .com Root TLD              v
                         <--------------------------------- +------------------+
                                                            | Root Nameservers |
                                                            +------------------+
                                                                   |
                         3. NS Delegation to Cloudflare            v
                         <--------------------------------- +------------------+
                                                            | Registrar (.com) |
                                                            +------------------+
                                                                   |
                                                                   v
+-------------------------------------------------------------------------------------+
|                              Cloudflare DNS (Authoritative)                         |
|                                                                                     |
|   Delegated Nameservers:                                                            |
|     ns1.cloudflare.com  (Anycast)                                                   |
|     ns2.cloudflare.com  (Anycast)                                                   |
|                                                                                     |
|   Records:                                                                          |
|     @ (apex) IN A     185.199.108.153                                               |
|     @ (apex) IN A     185.199.109.153                                               |
|     @ (apex) IN A     185.199.110.153                                               |
|     @ (apex) IN A     185.199.111.153                                               |
|     www      IN CNAME wvrner.github.io.                                             |
+------------------------------------------+------------------------------------------+
                                           |
                                           | 4. Returns GitHub Pages IP
                                           v
                               +-----------------------+
                               | GitHub Pages Ingress  |
                               | (TLS Handshake & HTTP)|
                               +-----------------------+</code></pre>
</div>

### Configured DNS Records

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #E6EDF3;">// DNS ZONE CONFIGURATION (BIND FORMAT)</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">ZONE FILE</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 13px; line-height: 1.65; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>; Authoritative Apex IPv4 Records (GitHub Pages Anycast Load Balancing)
@               300     IN      A       185.199.108.153
@               300     IN      A       185.199.109.153
@               300     IN      A       185.199.110.153
@               300     IN      A       185.199.111.153

; Canonical Name for Subdomain Ingress
www             300     IN      CNAME   wvrner.github.io.

; Custom Domain Verification (GitHub Ownership Validation)
_gh-wvrner      300     IN      TXT     "github-pages-verification-token"</code></pre>
</div>

<div class="blog-callout-box" style="border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; margin: 26px 0; padding: 22px 24px; background: #FFFDF5;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
    <span class="blog-category-tag" style="background: var(--gum-pink, #FF90E8); font-size: 11px; font-weight: 800; padding: 3px 10px;">DNS HONESTY</span>
    <strong style="font-size: 16.5px; font-family: var(--font-display, sans-serif);">DNS Management vs. Edge Reverse Proxying</strong>
  </div>
  <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #222222;">
    Cloudflare is configured as an authoritative DNS manager (DNS Only mode). Queries resolve to GitHub Pages' official IP addresses. The TLS certificate is issued directly by GitHub Pages via Let's Encrypt, not through Cloudflare edge proxying.
  </p>
</div>

---

## 4. Static Site Generation: Architecture & Rationale

Dynamic content management systems (like WordPress or Drupal) execute code on every request: a client sends an HTTP GET, a PHP/Node worker queries a relational SQL database, compiles an HTML string in memory, and returns it. This introduces execution latency, database lock contention, memory overhead, and severe vulnerability surfaces.

### Dynamic Architecture vs. Static Site Generation

| Evaluation Criteria | Dynamic CMS (WordPress / Node.js) | Static Site Generator (Eleventy + Pages) |
| :--- | :--- | :--- |
| **Request Execution** | Server evaluates code & queries DB per hit | Pre-compiled static HTML served directly from disk |
| **Security Surface** | High (SQL injection, XSS, plugin CVEs) | Zero (Read-only static files; no server runtime) |
| **Time to First Byte** | 200ms – 1200ms (dependent on DB & cache) | 15ms – 50ms (served directly from Anycast edge) |
| **Infrastructure Cost**| Ongoing ($5–$50/mo for VPS + managed DB) | $0.00 (Zero hosting overhead) |
| **Disaster Recovery** | Complex SQL dumps & stateful backups | Instant `git clone` contains 100% of website state |

---

## 5. The Build Engine: Eleventy (11ty)

Eleventy serves as the build engine. It transforms raw Markdown files and Nunjucks layout templates into semantic HTML pages during the build step.

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #58A6FF;">// DIAGRAM 03: ELEVENTY COMPILATION PIPELINE</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">BUILD PIPELINE</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.5; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>+-------------------------------------------------------------------------------------+
|                                SOURCE REPOSITORY (INPUT)                            |
|                                                                                     |
|   ./posts/*.md           (Markdown articles with YAML front matter)                 |
|   ./_includes/post.njk   (Parent article layout template)                           |
|   ./blog.njk             (Paginated blog feed template)                             |
|   ./index.html           (Homepage with infrastructure showcase)                    |
|   ./about.html           (About & CV engineering page)                              |
|   ./styles/*             (Neubrutalist CSS design system)                           |
|   ./js/*                 (Vanilla JavaScript interactions)                          |
+------------------------------------------+------------------------------------------+
                                           |
                                           | npx @11ty/eleventy
                                           v
+-------------------------------------------------------------------------------------+
|                              ELEVENTY BUILD ENGINE (v3)                             |
|                                                                                     |
|   1. Read .eleventy.js configuration                                                |
|   2. Execute passthrough copies (CSS, JS, images, CNAME)                            |
|   3. Parse posts directory and create 'posts' collection (sorted newest first)      |
|   4. Generate paginated feed pages (/blog/, /blog/2/, /blog/3/)                     |
|   5. Transform Markdown to HTML and inject into {{ content | safe }}                |
|   6. Evaluate permalinks (/posts/{{ page.fileSlug }}.html)                          |
+------------------------------------------+------------------------------------------+
                                           |
                                           | Emits static artifacts (0.12s build time)
                                           v
+-------------------------------------------------------------------------------------+
|                                  OUTPUT DIRECTORY (_site)                           |
|                                                                                     |
|   ./_site/index.html                                                                |
|   ./_site/about/index.html                                                          |
|   ./_site/blog/index.html                                                           |
|   ./_site/blog/2/index.html                                                         |
|   ./_site/posts/how-this-site-is-built-and-deployed.html                            |
|   ./_site/styles/main.css                                                           |
|   ./_site/CNAME                                                                     |
+-------------------------------------------------------------------------------------+</code></pre>
</div>

### Eleventy Configuration File

The site is configured via `.eleventy.js`:

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #E6EDF3;">// .eleventy.js</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">JAVASCRIPT</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 13px; line-height: 1.65; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>module.exports = function (eleventyConfig) {
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

### Post Directory Defaults (`posts/posts.json`)

To avoid repeating configuration across every article, Eleventy reads `posts/posts.json` to assign layout and tags automatically:

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #E6EDF3;">// posts/posts.json</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">JSON</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 13px; line-height: 1.65; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>{
  "layout": "post.njk",
  "tags": ["posts"],
  "permalink": "/posts/{{ page.fileSlug }}.html"
}</code></pre>
</div>

---

## 6. Content Management & Headless Publishing with Pages CMS

While developers are comfortable writing in VS Code and running git commands in terminal, writing articles on mobile or without developer tooling requires an accessible interface.

Pages CMS operates as an open-source, client-side, headless CMS. It authenticates via GitHub OAuth and writes commits directly into the repository via the GitHub REST API.

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #E6EDF3;">// .pages.yml (SCHEMA SPECIFICATION)</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">YAML</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 13px; line-height: 1.65; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>media:
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

---

## 7. Static Pagination & Collection Architecture

In `blog.njk`, pagination is evaluated statically at build time using Eleventy's collection engine:

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #E6EDF3;">// blog.njk (BUILD-TIME PAGINATION HEADER)</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">NUNJUCKS</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 13px; line-height: 1.65; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>---
pagination:
  data: collections.posts
  size: 5
  alias: posts
permalink: "/blog/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---</code></pre>
</div>

### Generated Route Topology

- **Page 1 (`pageNumber == 0`)**: Emits `_site/blog/index.html` &rarr; accessible as `/blog/`
- **Page 2 (`pageNumber == 1`)**: Emits `_site/blog/2/index.html` &rarr; accessible as `/blog/2/`
- **Page 3 (`pageNumber == 2`)**: Emits `_site/blog/3/index.html` &rarr; accessible as `/blog/3/`

Because each page is compiled into a discrete static HTML file, pagination requests require zero client-side JavaScript or API hydration.

---

## 8. Automated CI/CD Pipeline: GitHub Actions

Manual deployments lead to human error, missed asset bundles, and configuration drift. In this repository, deployment is handled entirely by GitHub Actions.

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #58A6FF;">// DIAGRAM 04: GITHUB ACTIONS PIPELINE EXECUTION GRAPH</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">CI/CD FLOW</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.5; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>[ TRIGGER ] git push origin main
     |
     v
+-------------------------------------------------------------------------------------+
|                      GITHUB ACTIONS HOSTED RUNNER (ubuntu-latest)                   |
|                                                                                     |
|  [STEP 1] actions/checkout@v4                                                       |
|           Clones Git repository commit sha into ephemeral runner workspace          |
|                                                                                     |
|  [STEP 2] actions/setup-node@v4                                                     |
|           Provisions Node.js 22 environment & restores ~/.npm cache                 |
|                                                                                     |
|  [STEP 3] npm ci                                                                    |
|           Strictly validates package-lock.json checksums & unpacks exact deps       |
|                                                                                     |
|  [STEP 4] npx @11ty/eleventy                                                        |
|           Executes build engine, generating static files into ./_site               |
|                                                                                     |
|  [STEP 5] actions/upload-pages-artifact@v3                                          |
|           Gzips ./_site directory into a verified tarball artifact                  |
|                                                                                     |
|  [STEP 6] actions/deploy-pages@v4                                                   |
|           Authenticates via OIDC token and atomically publishes to GitHub Pages     |
+-------------------------------------------------------------------------------------+
     |
     v
[ LIVE DEPLOYMENT ] Atomic release live at https://wvrner.com (Zero downtime)</code></pre>
</div>

### Complete CI/CD Workflow Specification

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #E6EDF3;">// .github/workflows/deploy.yml</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">YAML</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 13px; line-height: 1.65; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>name: Deploy Eleventy to GitHub Pages

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

---

## 9. Deep-Dive: `npm ci` vs. `npm install` in CI/CD

One of the most critical operational distinctions in pipeline design is using `npm ci` rather than `npm install`:

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #58A6FF;">// DIAGRAM 05: DEPENDENCY RESOLUTION BEHAVIOR</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">EXECUTION MODEL</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.5; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>COMMAND: npm install (DEVELOPMENT ONLY)
------------------------------------------------------------------------------------
  [ package.json ] ---> Reads semver ranges (e.g. ^3.1.0)
          |
          v
  [ Resolves Remote ] -> Checks npm registry for latest non-breaking version
          |
          v
  [ Mutates Lockfile ]-> Overwrites package-lock.json with newly resolved versions
          |
          v
  [ RISKS IN CI ] -----> Non-deterministic builds; builds pass today, break tomorrow!


COMMAND: npm ci (STRICT CI/CD AUTOMATION)
------------------------------------------------------------------------------------
  [ package-lock.json ] -> Reads exact immutable SHA-512 cryptographic checksums
          |
          v
  [ Strict Equality ] ---> Verifies package.json and package-lock.json match exactly
          |                (If mismatched, FAILS immediately with non-zero exit code)
          v
  [ Purge node_modules ]-> Completely deletes existing node_modules directory
          |
          v
  [ Exact Unpack ] ------> Installs verbatim dependencies without mutating lockfile
          |
          v
  [ GUARANTEE ] ---------> 100% deterministic, reproducible, auditable builds!</code></pre>
</div>

| Operational Characteristic | `npm install` | `npm ci` (Used in wvrner.com) |
| :--- | :--- | :--- |
| **Intended Context** | Local manual development | Automated CI/CD execution environments |
| **Lockfile Handling** | Modifies `package-lock.json` if dependencies drift | Strictly read-only; never touches lockfile |
| **Dependency Resolution**| Re-evaluates semver ranges against npm registry | Unpacks exact pinned versions from lockfile |
| **Lockfile Discrepancies** | Silently updates lockfile | Fails immediately with exit code 1 |
| **Clean-Slate Guarantee** | Overwrites in-place | Automatically deletes `node_modules/` before installing |
| **Build Reproducibility** | Non-deterministic across machines | 100% byte-for-byte deterministic |

---

## 10. What Happens When I Push? (End-to-End Sequence Walkthrough)

To appreciate modern automated infrastructure, consider the complete sequence of events triggered by a simple git push:

<div class="code-console-window" style="margin: 28px 0; border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; overflow: hidden; background: #0D1117;">
  <div class="console-title-bar" style="background: #161B22; border-bottom: 2px solid #30363D; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 6px; align-items: center;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
    </div>
    <span style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 700; color: #58A6FF;">// DIAGRAM 06: END-TO-END EXECUTION SEQUENCE</span>
    <span style="font-family: var(--font-mono, monospace); font-size: 11px; background: #21262D; color: #8B949E; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363D;">SEQUENCE DIAGRAM</span>
  </div>
  <pre style="margin: 0; padding: 20px; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.5; overflow-x: auto; background: #0D1117; color: #E6EDF3;"><code>Author               GitHub Repo            Actions Runner         GitHub Pages          Cloudflare DNS           Visitor
  |                       |                       |                      |                      |                    |
  |-- git push main ----->|                       |                      |                      |                    |
  |                       |-- trigger webhook --->|                      |                      |                    |
  |                       |                       |-- actions/checkout ->|                      |                    |
  |                       |                       |-- npm ci ----------->|                      |                    |
  |                       |                       |-- npx eleventy ----->|                      |                    |
  |                       |                       |-- upload artifact -->|                      |                    |
  |                       |                       |-- deploy-pages ----->|                      |                    |
  |                       |                       |   (OIDC Auth)        |-- release update --->|                    |
  |                       |                       |<-- deployment OK ----|                      |                    |
  |                       |<-- workflow success --|                      |                      |                    |
  |                                                                      |                      |                    |
  |                                                                      |                      |<-- DNS Query ------|
  |                                                                      |                      |--- Return IPs ---->|
  |                                                                      |<-- HTTP GET / -------+--------------------|
  |                                                                      |--- 200 OK (HTML) ----+------------------->|</code></pre>
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

<div class="blog-callout-box" style="border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; margin: 26px 0; padding: 22px 24px; background: #FFFDF5;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
    <span class="blog-category-tag" style="background: var(--gum-pink, #FF90E8); font-size: 11px; font-weight: 800; padding: 3px 10px;">INCIDENT 01</span>
    <strong style="font-size: 16.5px; font-family: var(--font-display, sans-serif);">Broken CSS on Nested Article Paths</strong>
  </div>
  <p style="margin: 0 0 10px; font-size: 14.5px; line-height: 1.6; color: #444444;">
    <strong>Symptom:</strong> The homepage loaded stylesheets properly, but navigating to <code>/posts/first-course.html</code> resulted in unstyled plain HTML.<br>
    <strong>Root Cause:</strong> <code>_includes/post.njk</code> used relative stylesheet links: <code>&lt;link rel="stylesheet" href="styles/main.css"&gt;</code>. On nested URL paths, the browser resolved this relative to the current directory (<code>/posts/styles/main.css</code>), returning a 404.<br>
    <strong>Fix:</strong> Converted all asset links to root-relative paths: <code>href="/styles/main.css"</code> and <code>src="/js/main.js"</code>.
  </p>
</div>

<div class="blog-callout-box" style="border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; margin: 26px 0; padding: 22px 24px; background: #FFFDF5;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
    <span class="blog-category-tag" style="background: var(--gum-yellow, #FFC900); font-size: 11px; font-weight: 800; padding: 3px 10px;">INCIDENT 02</span>
    <strong style="font-size: 16.5px; font-family: var(--font-display, sans-serif);">Git Divergence between Web CMS & Local Machine</strong>
  </div>
  <p style="margin: 0 0 10px; font-size: 14.5px; line-height: 1.6; color: #444444;">
    <strong>Symptom:</strong> Local <code>git push origin main</code> was rejected with <code>[rejected - non-fast-forward]</code>.<br>
    <strong>Root Cause:</strong> Pages CMS authors commits directly on the remote GitHub repository via the GitHub REST API. Meanwhile, local file edits occurred offline without pulling the remote changes first.<br>
    <strong>Fix:</strong> Executed <code>git pull --rebase origin main</code> to replay local commits on top of the remote CMS commits, maintaining a linear Git history without messy merge commits.
  </p>
</div>

<div class="blog-callout-box" style="border: 2.5px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 12px; margin: 26px 0; padding: 22px 24px; background: #FFFDF5;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
    <span class="blog-category-tag" style="background: var(--gum-green, #27C93F); font-size: 11px; font-weight: 800; padding: 3px 10px;">INCIDENT 03</span>
    <strong style="font-size: 16.5px; font-family: var(--font-display, sans-serif);">Template Parsing Crashes on Code Snippets</strong>
  </div>
  <p style="margin: 0 0 10px; font-size: 14.5px; line-height: 1.6; color: #444444;">
    <strong>Symptom:</strong> Eleventy crashed during compilation with <code>AssertionError: undefined filter: safe</code>.<br>
    <strong>Root Cause:</strong> Eleventy pre-processes Markdown files with Liquid by default. When the article contained example Nunjucks code snippets like <code>{{ content | safe }}</code>, Liquid attempted to evaluate them as active directives.<br>
    <strong>Fix:</strong> Added <code>templateEngineOverride: md</code> to the article's front matter, instructing Eleventy to treat the file body strictly as pure Markdown without template evaluation.
  </p>
</div>

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
- **Author**: Nima Hosseini ([@wvrner](https://github.com/wvrner))\n