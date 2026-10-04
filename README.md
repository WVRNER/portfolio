# wvrner · Nima Hosseini (@wvrner) — Gumroad Edition

A complete redesign of Nima Hosseini's DevOps & Infrastructure portfolio using the authentic **Gumroad** neubrutalist design system.

---

## 🎨 Design System: Gumroad Neubrutalism

Inspired directly by [gumroad.com](https://gumroad.com):

### 1. Typography
* **Headings & Display**: `Plus Jakarta Sans` (Weights: 700, 800, 900) with tight line-heights and negative letter spacing (`-0.03em` to `-0.04em`).
* **Expressive Accents**: `Fraunces` (Editorial serif italic) for punchy phrases (*"from the network up"*, *"the WVRNER way"*).
* **Technical Monospace**: `Space Mono` for tags, telemetry status, code blocks, and the interactive terminal CLI.

### 2. Signature Color Palette
* **Canvas Background**: `#F4F4F0` (Gumroad signature warm off-white) / `#0A0A0C` in Dark Mode.
* **Candy High-Saturation Accents**:
  * Mustard Gold / Yellow: `#FFC900`
  * Bubblegum Pink: `#FF90E8`
  * Electric Mint / Green: `#90E8D0` & `#23A094`
  * Periwinkle Sky Blue: `#90A8ED`
  * Coral: `#FF6B6B`
  * Deep Royal Indigo: `#27187E` (Preserved from the original portfolio)
* **Borders & Shadows**:
  * Solid `2px` and `3px` black borders (`border: 2px solid #000000;`)
  * Sharp 0-blur hard offset shadows (`box-shadow: 4px 4px 0px #000000;` and `6px 6px 0px #000000;`)
  * Tactile hover elevations (`transform: translate(-2px, -2px); box-shadow: 7px 7px 0px #000000;`) and active click presses (`transform: translate(2px, 2px); box-shadow: 1px 1px 0px #000000;`).

### 3. Iconic Gumroad Components
1. **Sticky Gumroad Navigation**:
   * Brand pill with custom "W" monogram, search bar filter, pill links, audio toggle, and theme switch.
2. **"Go from 0 to $1" Hero Reinterpretation**:
   * "Go from the network up to resilient cloud systems."
   * Floating stickers with gentle bobbing animations (`float-gentle`, `float-reverse`).
   * 3D spinning gold monogram coin (`coin-spin-anim`).
3. **Dual Marquee Ribbons**:
   * Continuous looping ticker banners in yellow and pink displaying active tracks and disciplines.
4. **4-Panel Feature Quad Grid ("Sell Anything" Layout)**:
   * AWS, Terraform, Docker, and GitHub Actions presented as candy-colored high-contrast cards with thick black borders.
5. **The WVRNER Way / Small Bets Section**:
   * "Instead of building snowflakes... start writing declarative code!"
   * Step pills: `Start Small` → `Understand Connections` → `Automate Everything` → `Zero Drift`.
6. **Stat Counter Banner ($1,964,052 Style)**:
   * `450+ Edge PoPs` and `99.992% Nominal SLA`.
7. **Currently Learning Exhibition (4 Chapters)**:
   * Interactive chapter selector tabs, SVG blueprints, and code configuration toggle (HCL, Dockerfile, YAML).
8. **Real Cloud Architecture Showcase (This Website)**:
   * Interactive 4-Node flow strip: Client Browser → Route 53 → CloudFront CDN → AWS S3 Bucket.
   * Multi-tab code console with one-click code copy and clipboard feedback.
9. **Unlimited Possibilities Filter Matrix**:
   * Clickable topic tags for all cloud, container, and infrastructure technologies.
10. **Interactive Cloud Terminal (`nimactl`)**:
    * Functional command-line interface supporting commands: `help`, `status`, `aws`, `terraform`, `docker`, `actions`, `mesh`, `projects`, `whoami`, `contact`, `clear`.
11. **Web Audio Synthesizer**:
    * Tactile retro chimes and beeps generated via Web Audio API.
12. **Signature 3-Column Footer**:
    * Live NYC Local (EST) and UTC world clocks, telemetry health, direct transmission links, and giant typographic horizon wordmark `WVRNER`.

---

## 📁 Project Structure

```
documents/wvrner-gumroad/
├── index.html              # Main Gumroad-styled homepage
├── about.html              # Dedicated Biography & Curriculum Vitae page
├── README.md               # Documentation and design system overview
├── package.json            # Project manifest
├── styles/
│   ├── main.css            # Gumroad design system styles, grid, cards, and theme
│   └── animations.css      # Marquees, floating stickers, coin spin, audio waves
├── js/
│   └── main.js             # Theme toggle, audio synthesizer, tabs, terminal CLI, clocks
├── infra/                  # Terraform configuration files (S3, CloudFront, OAC, IAM)
└── .github/                # GitHub Actions automated keyless OIDC CI/CD workflow
```

---

## 🔤 Typography & Fonts Used

The portfolio uses three Google Fonts paired with robust system fallback stacks to deliver the authentic Gumroad editorial and technical aesthetic:

1. **Plus Jakarta Sans** (Google Fonts)
   - **Weights**: `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold), `800` (Extra-Bold), `900` (Black)
   - **Role**: Primary display & interface font (`--font-display`). Used across all navigation, hero typography, section headers, card titles, buttons, badges, and primary body text.
   - **Fallback Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

2. **Fraunces** (Google Fonts)
   - **Weights**: `700` (Bold Italic)
   - **Role**: Expressive editorial serif accent font (`--font-serif`). Used for punchy emphasis phrases (*"from the network up"*, *"the WVRNER way"*).
   - **Fallback Stack**: `Georgia, serif`

3. **Space Mono** (Google Fonts)
   - **Weights**: `400` (Regular), `700` (Bold), `400` (Italic)
   - **Role**: Technical monospace font (`--font-mono`). Used for system status tags, live telemetry, chapter indices, interactive terminal CLI (`nimactl`), HCL/YAML/Dockerfile code blocks, and technical metadata.
   - **Fallback Stack**: `Menlo, Consolas, Monaco, monospace`
