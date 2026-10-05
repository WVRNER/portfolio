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
templateEngineOverride: md
---

Building a personal portfolio website is a standard rite of passage for software and systems engineers. However, instead of treating this site merely as an online resume or using an off-the-shelf dynamic CMS, I approached the portfolio itself as a real infrastructure, automation, and deployment engineering project.

As an aspiring DevOps and infrastructure systems engineer, my objective was not just to put pages on the internet, but to design, implement, and document a disciplined delivery lifecycle: declarative configuration, strict version control, reproducible local builds, automated CI/CD pipelines, managed DNS resolution, and secure HTTPS delivery.

This technical case study documents the complete architecture, implementation decisions, real-world troubleshooting encounters, and operational lessons behind [wvrner.com](https://wvrner.com).

---

## 1. Project Goal: Treating the Portfolio as an Infrastructure Project

When designing modern systems, the boundary between application code and operational infrastructure has largely dissolved. Systems engineers must know how software packages are built, how automated delivery pipelines validate code, and how network packets traverse the internet to reach visitors.

For this website, I established seven foundational technical requirements:

1. **Strict Version Control as the Single Source of Truth**: Every template, stylesheet, script, asset, and piece of content must live in Git. No manual FTP uploads, no direct edits on servers, and no untracked configuration drift.
2. **Reproducible Builds**: Anyone checking out the repository—whether locally on a Mac or inside an automated Linux container—must be able to produce the exact same static output using clean, deterministic commands.
3. **Automated CI/CD Delivery**: Manual deployment steps introduce human error. Pushing an update to the `main` branch must trigger an automated pipeline that checks out the code, installs dependencies, compiles assets, and deploys the site without manual intervention.
4. **Structured Content Management**: While the site is statically compiled, writing technical articles should not require duplicating 200 lines of boilerplate HTML. Content must be stored as clean, structured Markdown, managed either in a local text editor or through a Git-backed headless CMS.
5. **Clean Static Site Architecture**: Zero database queries, zero runtime server-side rendering delays, and zero server maintenance overhead.
6. **Managed DNS & Domain Routing**: Using a custom apex domain (`wvrner.com`) with redundant Anycast routing and clean URL canonicalization.
7. **Transparent Technical Accuracy**: Documenting only what is actually configured and implemented. Distinguishing clearly between infrastructure I personally manage and underlying services provided by the hosting platform.

---

## 2. Custom Domain & DNS Fundamentals

A personal domain name transforms an arbitrary cloud endpoint into a permanent, professional identity. My site resolves through the custom domain **`wvrner.com`**.

```
User visits: https://wvrner.com
                │
                ▼
  [Cloudflare Authoritative DNS]
   Translates 'wvrner.com' to GitHub Pages Anycast IPs
                │
                ▼
      [GitHub Pages Edge]
   Inspects CNAME -> Serves compiled static site over TLS
```

### Translating Hostnames to IP Addresses
Computers communicate using IP addresses, while humans navigate using domain names. The Domain Name System (DNS) operates as the distributed phonebook of the internet. When a browser requests `wvrner.com`, it queries a recursive DNS resolver, which traverses the DNS hierarchy (Root servers $\rightarrow$ `.com` TLD servers $\rightarrow$ Authoritative nameservers) to obtain the IP addresses responsible for handling traffic for the domain.

### Domain Registration
The domain `wvrner.com` was registered through a commercial registrar *[REGISTRAR NOTE: Replace with your specific registrar, e.g., Namecheap / Porkbun / Cloudflare Registrar]*. During initial registration, default registrar nameservers point the domain. To leverage Cloudflare’s fast authoritative DNS resolution and management interface, the domain's authoritative nameservers at the registrar were pointed to Cloudflare:

```text
Nameserver 1: [YOUR_CLOUDFLARE_NAMESERVER_1.ns.cloudflare.com]
Nameserver 2: [YOUR_CLOUDFLARE_NAMESERVER_2.ns.cloudflare.com]
```

---

## 3. Cloudflare & DNS Architecture

Cloudflare serves as the authoritative DNS provider for `wvrner.com`. Because DNS resolution sits directly in the critical request path, misconfiguring DNS records will take the entire website offline regardless of whether the hosting platform is healthy.

[SCREENSHOT: Cloudflare DNS Records Table Dashboard]

The DNS zone configuration consists of four primary record categories:

### 1. Apex Domain `A` Records (`wvrner.com`)
- **What It Is**: An `A` (Address) record maps a fully qualified domain name to a 32-bit IPv4 address.
- **Why It Exists**: To route traffic directed at the root domain (`wvrner.com` or `@`) directly to the servers hosting the website.
- **Where It Points**: GitHub Pages provides four redundant Anycast IPv4 addresses. The apex domain is configured with four separate `A` records pointing to:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **What Would Break If Wrong**: If these IP addresses are mistyped or missing, recursive resolvers cannot map `wvrner.com` to any host, returning `NXDOMAIN` or connection timeout errors to users trying to access the root domain.

### 2. IPv6 `AAAA` Records (`wvrner.com`)
- **What It Is**: A `AAAA` (Quad-A) record maps a domain name to a 128-bit IPv6 address.
- **Why It Exists**: To allow modern IPv6-native clients and mobile networks to connect directly without passing through legacy IPv4 translation gateways (NAT64).
- **Where It Points**: Points to GitHub Pages’ four official Anycast IPv6 addresses:
  - `2606:50c0:8000::153`
  - `2606:50c0:8001::153`
  - `2606:50c0:8002::153`
  - `2606:50c0:8003::153`
- **What Would Break If Wrong**: IPv6-only devices would experience connection failures or sluggish fallback delays attempting to connect over IPv4.

### 3. Subdomain `CNAME` Record (`www.wvrner.com`)
- **What It Is**: A `CNAME` (Canonical Name) record aliases one domain name to another canonical domain name rather than pointing directly to an IP address.
- **Why It Exists**: To ensure visitors typing `www.wvrner.com` reach the same website seamlessly.
- **Where It Points**: Points to `wvrner.github.io` (or `wvrner.com`).
- **What Would Break If Wrong**: Visitors entering `www` before the domain would encounter a host resolution error.

### 4. Domain Ownership Verification `TXT` Record
- **What It Is**: A `TXT` record holds arbitrary text readable by external automated verification systems.
- **Why It Exists**: GitHub requires proof of domain ownership to prevent domain takeover attacks, where an attacker could otherwise claim someone else's custom domain on their own GitHub Pages site.
- **Where It Points**: `_github-pages-challenge-wvrner` with a unique verification token generated by GitHub.
- **What Would Break If Wrong**: GitHub Pages would disallow custom domain binding and refuse to provision an SSL/TLS certificate for `wvrner.com`.

### Cloudflare Proxy Status: DNS-Only vs. Proxied
In Cloudflare, DNS records can operate in two modes:
- **DNS-Only (Grey Cloud)**: Cloudflare acts strictly as an authoritative DNS resolver. Queries return GitHub Pages' real Anycast IP addresses directly. Traffic flows directly from the visitor's browser to GitHub Pages.
- **Proxied (Orange Cloud)**: Cloudflare sits as a reverse proxy in front of the origin. DNS queries resolve to Cloudflare edge IP addresses, and Cloudflare terminates the TLS session before establishing a back-end connection to GitHub Pages.

*Note: For standard GitHub Pages setups using automated Let's Encrypt certificates, DNS-Only (grey cloud) or Proxied with SSL/TLS encryption set to "Full (strict)" is required to prevent redirect loops and allow GitHub to verify certificate renewal challenges.*

### DNS Resolution vs. Web Hosting: The Core Distinction
It is vital to distinguish between **DNS resolution** and **web hosting**:
- **Cloudflare DNS** does not store, compile, or serve my website's HTML, CSS, or JavaScript files. It only answers the question: *"What IP address corresponds to wvrner.com?"*
- **GitHub Pages** is the web server that actually receives the HTTP GET request, locates the requested file in the deployed static artifact, and transmits the bytes over the network.

---

## 4. Git & GitHub as the Single Source of Truth

The entire website is version-controlled with Git and hosted publicly in the repository [`WVRNER/portfolio`](https://github.com/WVRNER/portfolio).

[SCREENSHOT: Git Commit History & Branch Graph]

### Why Git as the Single Source of Truth?
In traditional server administration, changes often occur ad-hoc: an engineer logs into a server via SSH, edits an Nginx configuration file in `/etc/nginx/`, or manually uploads an image over SFTP. This creates two fatal problems:
1. **Lack of Auditability**: Nobody knows who changed what, when, or why.
2. **Configuration Drift**: The live server no longer matches any backup or source code. If the server dies, restoring it requires guesswork.

By maintaining the entire website in Git, every single change—whether it is a new blog post, a CSS color tweak, or a CI/CD workflow update—is an atomic, timestamped commit with a cryptographic hash and author signature.

### The Day-to-Day Developer Workflow
```text
1. Make change locally (content, styling, template)
2. Verify locally: npx @11ty/eleventy --serve
3. Stage changes: git add .
4. Commit: git commit -m "feat(blog): add architecture write-up"
5. Sync remote: git pull --rebase origin main
6. Push to production: git push origin main
7. GitHub Actions automatically builds and deploys
```

### Infrastructure Alongside Application Code
The repository stores not only user-facing content, but the deployment automation itself:
- `.eleventy.js`: Static compilation engine rules.
- `.eleventyignore`: Build exclusion boundaries.
- `.pages.yml`: CMS schema definition.
- `posts/posts.json`: Collection routing defaults.
- `.github/workflows/deploy.yml`: The deployment pipeline.

When configuration lives directly alongside code, any change to build logic is version-controlled, testable in branches, and atomically deployed together.

---

## 5. Static Site Generation: Architecture & Rationale

Dynamic content management systems (such as WordPress or custom Django/Express servers) assemble web pages at runtime: when a visitor requests an article, the application server accepts the socket, connects to a relational database (MySQL/PostgreSQL), executes SQL queries, loads template files into memory, concatenates HTML strings, and sends the response.

For a personal portfolio and technical blog, dynamic runtime architecture introduces severe liabilities:
- **Maintenance Burden**: Requires keeping PHP/Python runtimes, database services, and host operating systems patched against CVEs.
- **Security Surface**: SQL injection vulnerabilities, CMS plugin exploits, and database authentication credentials.
- **Reliability Risks**: If the database service crashes or runs out of connections, the entire website displays a `500 Internal Server Error`.
- **Hosting Costs**: Requires paying for persistent compute and database instances 24/7, even when traffic is low.

### The Static Site Generation (SSG) Solution
Static Site Generation inverts this model: **the website is compiled once at build time, rather than assembled on every request.**

When an article is written, the compilation engine reads the Markdown file, wraps it in the design template, and writes a static `.html` file to disk. When a user requests that article, the web server simply reads the static file directly from the filesystem or memory cache.

The advantages are concrete:
- **Zero Database Downtime**: There is no database to crash or compromise.
- **Minimal Compute Overhead**: Serving static files requires minimal CPU and memory, scaling effortlessly to traffic spikes.
- **Security by Design**: There is no execution runtime on the server that can be hijacked via form submissions or injection attacks.
- **Portability**: The output is pure HTML, CSS, and JavaScript that can be hosted on any web server, S3 bucket, Cloudflare Pages, or GitHub Pages.

---

## 6. The Build Engine: Eleventy (11ty)

To compile the site, I selected **Eleventy (11ty)**, an open-source, lightweight static site generator built on Node.js.

### Source Files vs. Generated Production Files
A critical distinction in static site architecture is understanding the boundary between **source files** and **generated files**:

```text
SOURCE REPOSITORY (What I write and maintain)
├── index.html
├── about.html
├── blog.njk
├── _includes/post.njk
├── posts/
│   ├── posts.json
│   └── my-post.md
├── styles/main.css
└── js/main.js
        │
        │  [Eleventy Compiler: npx @11ty/eleventy]
        ▼
GENERATED PRODUCTION OUTPUT (_site/ - Ephemeral Build Artifact)
├── index.html
├── about/index.html
├── blog/index.html
├── posts/my-post.html
├── styles/main.css
└── js/main.js
```

The `_site/` directory is **never edited manually** and is ignored by version control (`.gitignore`). It is entirely wiped and regenerated during every build.

### How Eleventy Compiles the Site
In `.eleventy.js`, Eleventy is configured with asset passthroughs, collection rules, and template bindings:

```javascript
module.exports = function (eleventyConfig) {
  // Passthrough copy: Static assets transferred verbatim to _site/
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Date filter for Nunjucks templates
  eleventyConfig.addFilter("readableDate", (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  });

  // Posts Collection: collects Markdown posts, filters drafts, sorts newest first
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("./posts/*.md")
      .filter((post) => post.data.published !== false)
      .sort((a, b) => {
        const dateA = new Date(a.data.date || a.date);
        const dateB = new Date(b.data.date || b.date);
        return (dateB.getTime() - dateA.getTime()) || (b.inputPath.localeCompare(a.inputPath));
      });
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
  };
};
```

### Directory Defaults via `posts/posts.json`
To eliminate redundant front matter in every article, Eleventy supports directory data files. In `posts/posts.json`, defaults are defined for all Markdown posts in that directory:

```json
{
  "layout": "post.njk",
  "tags": ["posts"],
  "permalink": "/posts/{{ page.fileSlug }}.html"
}
```

Whenever a new `.md` file is added to `posts/`, Eleventy automatically:
1. Wraps the content in `_includes/post.njk`.
2. Tags it into `collections.posts`.
3. Derives its public URL as `/posts/<slug>.html` from its filename.

---

## 7. Content Management & Headless Publishing with Pages CMS

While writing raw Markdown files in VS Code is standard for developers, having an accessible web-based content editor is valuable for drafting posts on mobile or without opening a code editor.

To achieve this without compromising Git as the source of truth, I integrated **Pages CMS** ([pagescms.org](https://pagescms.org)).

[SCREENSHOT: Pages CMS Article Editor Interface]

### How Git-Backed Headless CMS Works
Unlike traditional CMS platforms (which store posts in a database), Pages CMS connects directly to the GitHub repository via the GitHub API:
1. When I log into Pages CMS and create an article, Pages CMS displays a visual editing interface.
2. When I click **Save**, Pages CMS does not write to a database; it constructs a Git commit containing the Markdown file and commits it directly to the `main` branch of my GitHub repository.
3. The commit to `main` triggers GitHub Actions, which builds the Eleventy site and deploys it live.

### The Schema Definition: `.pages.yml`
Pages CMS reads its configuration from `.pages.yml` in the repository root:

```yaml
media:
  input: images
  output: /images
  categories:
    - image
  extensions:
    - png
    - jpg
    - jpeg
    - webp
    - svg
    - gif

content:
  - name: posts
    label: Blog Posts
    type: collection
    path: posts
    filename: "{fields.slug}.md"

    view:
      fields:
        - title
        - display_date
        - category
        - published
      primary: title
      default:
        sort: date
        order: desc

    fields:
      - name: title
        label: Post Title
        type: string
        required: true
      - name: slug
        label: Slug / URL Name
        type: string
        required: true
        pattern: "^[a-z0-9-]+$"
      - name: subtitle
        label: Subtitle
        type: string
        required: true
      - name: excerpt
        label: Excerpt
        type: text
        required: true
      - name: category
        label: Category
        type: select
        required: true
      - name: display_date
        label: Display Date
        type: string
        required: true
      - name: date
        label: Publication Date
        type: date
        default: now
        required: true
      - name: read_time
        label: Read Time
        type: string
        required: true
      - name: post_tags
        label: Tags
        type: select
        options:
          multiple: true
      - name: published
        label: Published
        type: boolean
        default: true
      - name: body
        label: Article Body
        type: rich-text
        required: true
        options:
          format: markdown
          switcher: true
          media: images
          path: posts
```

### Stored Metadata vs. Rendered Elements
It is important to understand that `.pages.yml` defines the **data schema** accepted by the editor. Some fields (such as `title`, `subtitle`, `excerpt`, `category`, `display_date`, `read_time`, `post_tags`, and `body`) are directly consumed and rendered by the live template (`_includes/post.njk` and `blog.njk`). Other fields (such as `author`, `updated`, or `series`) store structured metadata in front matter, ready to be utilized whenever the templates are expanded to display them.

---

## 8. Authoring Articles: Structured Markdown & Component Layouts

When creating an article, the writer does not need a separate CMS form field for every paragraph, list, or code snippet. All editorial structure belongs naturally inside the `body` field using standard Markdown.

### Example Markdown Post Structure
````markdown
---
title: "Zero-Drift Infrastructure with Terraform"
slug: "zero-drift-infrastructure"
subtitle: "Managing cloud resources declaratively from code."
excerpt: "How declarative state files eliminate manual configuration drift."
category: "INFRASTRUCTURE AS CODE"
display_date: "November 2026"
date: 2026-11-01
read_time: "5 min read"
post_tags:
  - "#Terraform"
  - "#AWS"
  - "#DevOps"
published: true
---

Introduction paragraph explaining the architectural problem.

## 1. Declarative vs. Imperative Models

Modern infrastructure favors declarative configuration over imperative scripts.

- **Reproducibility**: Identical state across staging and production.
- **Auditability**: Git commit history tracks every change.

```bash
# Verify infrastructure drift
terraform plan -detailed-exitcode
```

<div class="blog-callout-box">
  <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 800; display: block; margin-bottom: 8px; color: var(--text-muted); text-transform: uppercase;">// Architecture Note</span>
  <strong style="font-size: 18px; display: block; margin-bottom: 8px;">State Locking Matters</strong>
  <p style="font-size: 15px; margin-bottom: 0; line-height: 1.6;">
    Always use distributed DynamoDB locking to prevent concurrent state updates.
  </p>
</div>
````

When compiled by Eleventy, the Markdown converts to semantic HTML, injects into `{{ content | safe }}` inside `_includes/post.njk`, and inherits the site's typography, navigation, and styling.

---

## 9. Static Pagination & Collection Architecture

In `blog.njk`, pagination is executed entirely at build time using Eleventy's pagination engine.

```yaml
---
pagination:
  data: collections.posts
  size: 5
  alias: posts
permalink: "/blog/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---
```

### How Static Pagination Works
- **Page 1 (`pageNumber == 0`)**: Resolves to `/blog/index.html` (public URL `/blog/`).
- **Page 2 (`pageNumber == 1`)**: Resolves to `/blog/2/index.html` (public URL `/blog/2/`).
- **Page 3 (`pageNumber == 2`)**: Resolves to `/blog/3/index.html` (public URL `/blog/3/`).

Because pagination is calculated during compilation:
1. There is no client-side JavaScript required to render the list.
2. The page numbers and links (`← Previous`, `1`, `2`, `...`, `Next →`) are static HTML hyperlinks, making them indexable by search engines and instantly navigable.
3. As new articles are published in Pages CMS, Eleventy automatically calculates the total count, slices the array into batches of 5, and generates additional subdirectories as needed.

---

## 10. Automated CI/CD Pipeline: GitHub Actions

Automation is the cornerstone of DevOps engineering. Every push to the `main` branch triggers the GitHub Actions workflow configured in `.github/workflows/deploy.yml`.

[SCREENSHOT: GitHub Actions Successful Deployment Workflow Run]

```yaml
name: Deploy Eleventy to GitHub Pages

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
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Eleventy
        run: npx @11ty/eleventy

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload site
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./_site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Breakdown of the Pipeline Stages:

1. **Trigger & Concurrency Guard**:
   - `on: push: branches: [main]`: Executes on every commit merged to production.
   - `concurrency: group: pages, cancel-in-progress: true`: If two commits are pushed in rapid succession, the previous in-flight build is cancelled immediately to save runner compute minutes and prevent deployment races.
2. **Permissions Context**:
   - `contents: read`: Allows cloning the source repository.
   - `pages: write` & `id-token: write`: Allows writing the artifact to GitHub Pages and generating the OIDC authentication token.
3. **`actions/checkout@v4`**:
   - Clones the Git repository into the clean virtual runner environment.
4. **`actions/setup-node@v4`**:
   - Provisions Node.js version 22 and configures automatic caching for `~/.npm` based on `package-lock.json` hash to accelerate build speeds.
5. **`run: npm ci`**:
   - Performs a clean, deterministic install of project dependencies.
6. **`run: npx @11ty/eleventy`**:
   - Compiles templates, processes Markdown, copies passthrough assets, and writes the complete production site to `./_site`.
7. **`actions/configure-pages@v5`**:
   - Injects GitHub Pages base URL metadata and compatibility settings.
8. **`actions/upload-pages-artifact@v3`**:
   - Packages the `./_site` folder into a compressed artifact (`github-pages`) and uploads it to GitHub's artifact store.
9. **`actions/deploy-pages@v4`**:
   - The `deploy` job runs in the protected `github-pages` environment, unpacks the artifact, and updates the live web edge with zero downtime.

---

## 11. Deep-Dive: `npm ci` vs. `npm install` in CI/CD

A subtle but crucial distinction in automated build engineering is why production pipelines use `npm ci` instead of `npm install`:

| Feature | `npm install` | `npm ci` (Clean Install) |
| :--- | :--- | :--- |
| **Purpose** | Local package addition & updates | Automated CI/CD production pipelines |
| **Lockfile Handling** | Can update or overwrite `package-lock.json` | Strictly enforces `package-lock.json`; fails if out of sync |
| **Existing `node_modules`** | Modifies existing modules in-place | Completely deletes `node_modules` before installing |
| **Determinism** | May install newer minor versions based on `^` ranges | Guarantees identical dependencies on every build machine |

In CI/CD, builds must be **strictly deterministic**. If an upstream dependency releases a buggy patch between builds, `npm install` could silently install it, breaking the deployment. By using `npm ci`, the workflow guarantees that the exact package versions verified on my local machine are identical to those used in production.

---

## 12. Build Artifacts & Storage Separation

In software engineering, a **build artifact** is the compiled output generated by a build process, ready for deployment or execution.

In this project, the source repository contains human-written code:
- `.eleventy.js`
- `blog.njk`
- `posts/*.md`

The build artifact is the generated `./_site` directory containing:
- Pure `.html` files
- Compressed `.css` and `.js`
- Optimized SVGs and image assets
- `CNAME`

GitHub Pages does not serve files directly from the Git repository branch; it serves files exclusively from the **uploaded build artifact**. Decoupling the source code from the deployed artifact ensures that development files, test scripts, and build configuration files are never exposed to public web requests.

---

## 13. GitHub Pages: Static Web Hosting & Delivery

GitHub Pages acts as the production static web server. It provides:
- High-availability static file hosting.
- Distributed edge routing.
- Native TLS termination.
- Automatic routing of directory requests (e.g. mapping requests for `/about/` to `/about/index.html`).

### What I Configured vs. What the Platform Manages
In DevOps, it is essential to be honest about where your configuration ends and managed platform services begin:
- **What I Configured**:
  - The static build pipeline in `.github/workflows/deploy.yml`.
  - The Eleventy static site compiler and template architecture.
  - The repository `CNAME` configuration file.
  - The DNS records in Cloudflare.
- **What GitHub Pages Manages**:
  - The physical server infrastructure and network hardware.
  - The underlying Nginx/web server daemon that handles HTTP requests.
  - Automatic Let's Encrypt SSL/TLS certificate renewal challenges.
  - Edge network routing across GitHub's global points of presence.

---

## 14. Custom Domain Binding & HTTPS / TLS

Binding `wvrner.com` to GitHub Pages requires coordination between the repository and the web server:

[SCREENSHOT: GitHub Pages Custom Domain Settings & Certificate Status]

1. **The `CNAME` File**: The repository contains a single-line file named `CNAME` containing:
   ```text
   wvrner.com
   ```
2. **Eleventy Passthrough Copy**: In `.eleventy.js`, `eleventyConfig.addPassthroughCopy("CNAME")` ensures this file is copied into the root of `_site/` on every build.
3. **GitHub Pages Routing Table**: When GitHub Pages deploys the artifact, it reads `_site/CNAME` and updates its internal ingress routing table to accept traffic with the `Host: wvrner.com` header.
4. **Automated TLS Certificate Provisioning**: Once domain ownership is verified, GitHub Pages automatically requests an SSL/TLS certificate from Let's Encrypt. All HTTP traffic is automatically redirected to secure HTTPS (`Enforce HTTPS` enabled).

---

## 15. What Happens When I Push? (End-to-End Walkthrough)

To understand how all these systems interact, here is the complete journey of a single change from keyboard to live visitor:

```text
  [1] Developer edits code locally (or drafts post in Pages CMS)
                     │
                     ▼
  [2] Git stages and commits change to 'main'
                     │
                     ▼
  [3] GitHub receives push event on 'main'
                     │
                     ▼
  [4] GitHub Actions runner boots (ubuntu-latest)
      ├── actions/checkout@v4 clones repository
      ├── actions/setup-node@v4 initializes Node.js 22 with npm cache
      ├── npm ci executes deterministic clean dependency install
      └── npx @11ty/eleventy compiles templates & Markdown into ./_site
                     │
                     ▼
  [5] actions/upload-pages-artifact packages ./_site
                     │
                     ▼
  [6] actions/deploy-pages publishes artifact to GitHub Pages
                     │
                     ▼
  [7] Visitor requests 'https://wvrner.com/about/'
      ├── Cloudflare DNS resolves 'wvrner.com' to GitHub Pages Anycast IP
      ├── Browser establishes TLS 1.3 encrypted handshake
      └── GitHub Pages web server serves '_site/about/index.html'
```

### In Plain Prose:
1. I write an article or update a template on my Mac (or click **Publish** inside Pages CMS).
2. Git tracks the modified files. I commit the change and push to `origin main`.
3. GitHub's webhook engine catches the push event and matches the trigger in `.github/workflows/deploy.yml`.
4. A clean Ubuntu runner spins up in GitHub's cloud, clones my repository, and configures Node.js 22.
5. `npm ci` reads `package-lock.json` and installs the exact versions of Eleventy and related tooling.
6. Eleventy compiles every Nunjucks template and Markdown post, processes collections, and writes the final static assets into `./_site`.
7. The workflow compresses `./_site` and passes it to the deployment job.
8. GitHub Pages updates its static storage with the new artifact.
9. When a visitor opens `https://wvrner.com`, their recursive DNS queries Cloudflare to get the IP, establishes an encrypted HTTPS connection to GitHub Pages, and receives the freshly compiled HTML in milliseconds.

---

## 16. Real-World Troubleshooting & Debugging Log

Infrastructure engineering is defined not by when everything works on the first try, but by how methodically you troubleshoot when systems fail. During the development of this platform, I encountered several real engineering challenges:

### 1. Relative Asset Paths Breaking on Nested Routes
- **The Symptom**: The homepage (`/`) rendered with full styling, but navigating to the About page (`/about/`) produced completely unstyled raw text.
- **The Cause**: In `about.html`, stylesheets were linked relatively:
  ```html
  <link rel="stylesheet" href="styles/main.css" />
  ```
  When compiled by Eleventy, `about.html` was output to `_site/about/index.html`. When loading `wvrner.com/about/`, the browser's base URL was `/about/`. The browser attempted to resolve the relative path as:
  ```text
  https://wvrner.com/about/styles/main.css  (404 Not Found)
  ```
- **The Solution**: Converted all asset links (CSS, JS, icons) across all templates to **root-absolute URLs**:
  ```html
  <link rel="stylesheet" href="/styles/main.css" />
  <script src="/js/main.js"></script>
  ```
  Root-absolute paths always resolve from the web root (`/`), functioning identically whether the visitor is on `/`, `/about/`, or `/posts/my-post.html`.

### 2. Git Remote/Local Divergence with Pages CMS
- **The Symptom**: Attempting to push local template modifications failed with:
  ```text
  ! [rejected] main -> main (fetch first)
  error: failed to push some refs to 'github.com:WVRNER/portfolio.git'
  ```
- **The Cause**: Pages CMS commits articles directly to GitHub remotely. While I was editing CSS locally, a new post had been published through the CMS, placing the remote `origin/main` ahead of my local branch.
- **The Solution**: Rather than creating messy merge commits or blindly force-pushing (which would destroy remote articles created by the CMS), I used:
  ```bash
  git pull --rebase origin main
  ```
  Rebase temporarily pauses local commits, fast-forwards local `main` to match the latest remote commits, and replays local commits cleanly on top, maintaining a linear Git history.

### 3. Pages CMS File Extension Mismatch
- **The Symptom**: Newly published CMS posts did not appear on the blog feed, and URLs were broken.
- **The Cause**: `.pages.yml` was originally configured with:
  ```yaml
  filename: "{fields.slug}.html"
  ```
  This caused Pages CMS to save articles as `.html` files in `posts/`. However, Eleventy's collection was configured as:
  ```javascript
  collectionApi.getFilteredByGlob("./posts/*.md");
  ```
  Because the files ended in `.html`, Eleventy ignored them completely.
- **The Solution**: Corrected `.pages.yml` to:
  ```yaml
  filename: "{fields.slug}.md"
  ```
  Ensuring that all CMS articles are created as Markdown source files for the compiler.

### 4. Broken Permalink Variable Evaluation
- **The Symptom**: A post front matter contained literal `{fields.slug}` strings in its output path (`/posts/{fields.slug}.html`).
- **The Cause**: The CMS form had a permalink field with an unparsed variable template.
- **The Solution**: Removed manual permalink entry entirely and shifted the responsibility to Eleventy's directory data file (`posts/posts.json`):
  ```json
  {
    "layout": "post.njk",
    "tags": ["posts"],
    "permalink": "/posts/{{ page.fileSlug }}.html"
  }
  ```
  Eleventy automatically computes `/posts/<slug>.html` from the Markdown filename, eliminating human input error.

### 5. Fragile Client-Side Pagination vs. Robust Build-Time Pagination
- **The Symptom**: The blog listing initially relied on a client-side JavaScript script (`initBlogPagination`) to show/hide cards with `display: none`. This caused visual layout shifts, broke browser history, and made pagination invisible to search engines.
- **The Cause**: Mixing client-side DOM manipulation with a static site generator.
- **The Solution**: Replaced the client-side script with native Eleventy build-time pagination in `blog.njk`:
  ```yaml
  pagination:
    data: collections.posts
    size: 5
    alias: posts
  permalink: "/blog/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
  ```
  Eleventy compiles dedicated, static HTML pages (`/blog/`, `/blog/2/`, `/blog/3/`) during the build, providing instantaneous load times and zero reliance on client-side JavaScript.

### 6. Browser JavaScript Caching
- **The Symptom**: Local source code contained updated JavaScript logic, and `_site/` contained the new file, but refreshing the live browser continued executing older, buggy JavaScript.
- **The Diagnostic**: I inspected the response headers using `curl -I`:
  ```bash
  curl -I https://wvrner.com/js/main.js
  ```
  The response showed aggressive browser caching (`Cache-Control: max-age=86400`). The browser assumed the resource had not changed and served it from disk cache without querying the server.
- **The Solution**: Implemented version query cache-busting on the script reference:
  ```html
  <script src="/js/main.js?v=20261005a"></script>
  ```
  When the query string changes, the browser treats the asset as a distinct URL and is forced to fetch the fresh file from the network.

---

## 17. Final Architecture Diagram

[DIAGRAM: End-to-End Deployment Architecture Flowchart]

```text
+-------------------------------------------------------------------------+
|                        CONTENT & CODE CREATION                          |
|                                                                         |
|    Local Development (Mac)                     Pages CMS (Web UI)       |
|    - HTML, CSS, Vanilla JS                     - Visual Editor          |
|    - Eleventy Templates (.njk)                 - Markdown Body          |
|    - Markdown Articles (.md)                   - YAML Metadata          |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                        VERSION CONTROL & REPO                           |
|                                                                         |
|    Git: Atomic commits, linear rebase workflow                          |
|    GitHub: Central source of truth (WVRNER/portfolio)                   |
+-------------------------------------------------------------------------+
                                     │  (Push to main branch)
                                     ▼
+-------------------------------------------------------------------------+
|                        CI/CD AUTOMATION PIPELINE                        |
|                                                                         |
|    GitHub Actions Runner (ubuntu-latest)                                |
|    ├── actions/checkout@v4                                              |
|    ├── actions/setup-node@v4 (Node.js 22 + npm cache)                   |
|    ├── npm ci (deterministic clean install)                             |
|    ├── npx @11ty/eleventy (compiles Markdown + Nunjucks into ./_site)   |
|    ├── actions/configure-pages@v5                                       |
|    └── actions/upload-pages-artifact@v3 (packages ./_site)              |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                        HOSTING & INGRESS                                |
|                                                                         |
|    GitHub Pages Hosting Environment                                     |
|    ├── actions/deploy-pages@v4                                          |
|    ├── Matches CNAME record (wvrner.com)                                |
|    └── Terminates TLS / Automatic Let's Encrypt HTTPS Certificate       |
+-------------------------------------------------------------------------+
                                     │
                                     ▲
+-------------------------------------------------------------------------+
|                        NETWORK ROUTING & VISITOR                        |
|                                                                         |
|    Visitor requests: https://wvrner.com                                 |
|    └── Cloudflare DNS resolves Anycast A/AAAA records                   |
+-------------------------------------------------------------------------+
```

---

## 18. Technology Breakdown: What, Why & Role

### Git
- **WHAT**: Distributed version control system.
- **WHY**: Tracks changes atomically, prevents configuration drift, and allows safe experimentation.
- **ROLE IN PROJECT**: Manages local code and content history; synchronizes with GitHub via rebase.

### GitHub
- **WHAT**: Cloud-hosted Git repository and developer platform.
- **WHY**: Provides a reliable remote repository, access controls, webhooks, and issue tracking.
- **ROLE IN PROJECT**: Functions as the single source of truth for all source files, templates, and deployment automation.

### GitHub Actions
- **WHAT**: Native CI/CD workflow automation platform.
- **WHY**: Removes manual build steps; ensures that code pushed to production is built in a sterile environment.
- **ROLE IN PROJECT**: Executes `.github/workflows/deploy.yml` on every push to `main`, compiles the site, and deploys the artifact.

### Eleventy (11ty)
- **WHAT**: Lightweight, flexible static site generator built on Node.js.
- **WHY**: Fast compile times, zero client-side framework bloat, supports multiple template engines (Nunjucks + Markdown).
- **ROLE IN PROJECT**: Reads `posts/*.md` and templates, processes collections, and outputs static HTML into `_site/`.

### Pages CMS
- **WHAT**: Open-source, Git-backed headless content management system.
- **WHY**: Provides an intuitive visual editing interface without requiring a database backend.
- **ROLE IN PROJECT**: Writes Markdown posts directly to `posts/{slug}.md` via the GitHub API.

### Cloudflare DNS
- **WHAT**: High-performance authoritative DNS management service.
- **WHY**: Low latency Anycast DNS resolution and intuitive zone record management.
- **ROLE IN PROJECT**: Maps `wvrner.com` and `www.wvrner.com` to GitHub Pages via `A`, `AAAA`, and `CNAME` records.

### GitHub Pages
- **WHAT**: Static web hosting service integrated with GitHub.
- **WHY**: Low operational maintenance, free hosting, and automatic HTTPS certificate provisioning.
- **ROLE IN PROJECT**: Serves the deployed `_site` artifact to visitors over HTTPS.

---

## 19. Practical Lessons for Junior DevOps Engineers

1. **DNS and Hosting Are Distinct Systems**: DNS only resolves names to IP addresses; hosting serves the bytes. Separating the two conceptually makes troubleshooting routing issues substantially faster.
2. **Git Must Remain the Authoritative Truth**: The moment you edit a file live on a server or make manual changes outside version control, you have introduced drift. Automate deployments from Git so the repository always reflects reality.
3. **Deterministic Dependencies Prevent Broken Builds**: Using `npm install` in CI pipelines is a gamble. `npm ci` guarantees that your automated runner installs the exact dependency tree specified in `package-lock.json`.
4. **Static Sites Offer Elite Security and Reliability**: By removing dynamic application servers and databases from the production runtime, you eliminate entire classes of vulnerabilities and operational failures.
5. **Debug by Comparing Layers Systematically**: When something looks broken (like missing styles or stale JavaScript), don't change random code. Verify each layer in order: local source $\rightarrow$ local build $\rightarrow$ live headers via `curl` $\rightarrow$ browser cache.

---

## 20. Verified Technologies Summary

- **Version Control**: Git
- **Code Repository**: GitHub ([WVRNER/portfolio](https://github.com/WVRNER/portfolio))
- **CI/CD Platform**: GitHub Actions
- **Static Hosting**: GitHub Pages
- **DNS Management**: Cloudflare DNS
- **Static Site Generator**: Eleventy (11ty) v3.1.6
- **Runtime & Package Manager**: Node.js 22 & npm
- **Content Management**: Pages CMS
- **Content Format**: Markdown with YAML front matter
- **Templating**: Nunjucks (`.njk`) & Semantic HTML5
- **Styling**: Vanilla Neubrutalist CSS

---

## 21. Future Architecture & DevOps Improvements

While the current pipeline is stable and automated, potential future enhancements include:
- **Pre-Deployment Linting**: Adding HTML/CSS validation and Markdown spellcheck steps to GitHub Actions before running the build.
- **Lighthouse Performance CI**: Running automated Google Lighthouse audits in the PR pipeline to catch performance regressions.
- **Automated Broken Link Checking**: Adding a step to crawl `_site` and flag broken internal links or missing images before deploying.
- **Automated Dependency Updates**: Configuring Dependabot to keep npm dependencies updated and patched against security vulnerabilities.

---

## 22. Project Resources & Links

- **Live Website**: [https://wvrner.com](https://wvrner.com)
- **Source Code Repository**: [https://github.com/WVRNER/portfolio](https://github.com/WVRNER/portfolio)
- **Author**: Nima Hosseini ([@wvrner](https://github.com/wvrner))
