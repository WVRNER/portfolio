const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const ENV_FILE = path.join(ROOT, ".ghost.env");
const POSTS_DIR = path.join(ROOT, "posts", "ghost");
const MEDIA_DIR = path.join(ROOT, "images", "ghost");

function loadEnv() {
  const text = fs.readFileSync(ENV_FILE, "utf8");

  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter(line => line.trim() && !line.trim().startsWith("#"))
      .map(line => {
        const i = line.indexOf("=");
        return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
      })
  );
}

function yamlString(value = "") {
  return JSON.stringify(String(value));
}

function safeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destination), { recursive: true });

    const client = url.startsWith("https:") ? https : http;

    const request = client.get(url, response => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume();

        const redirected = new URL(response.headers.location, url).href;

        download(redirected, destination)
          .then(resolve)
          .catch(reject);

        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      const file = fs.createWriteStream(destination);

      response.pipe(file);

      file.on("finish", () => {
        file.close(resolve);
      });
    });

    request.on("error", reject);
  });
}

async function localizeGhostMedia(html, ghostUrl, slug) {
  const urls = new Set();

  const regex =
    /(?:src|href)=["']([^"']*\/content\/images\/[^"']+)["']/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    urls.add(match[1]);
  }

  let output = html;

  for (const original of urls) {
    const absolute = original.startsWith("http")
      ? original
      : new URL(original, ghostUrl).href;

    const parsed = new URL(absolute);
    const filename = path.basename(parsed.pathname);
    const postFolder = safeSlug(slug);

    const diskPath = path.join(
      MEDIA_DIR,
      postFolder,
      filename
    );

    const publicPath =
      `/images/ghost/${postFolder}/${filename}`;

    console.log(`  ↓ media ${filename}`);

    await download(absolute, diskPath);

    output = output.split(original).join(publicPath);
    output = output.split(absolute).join(publicPath);
  }

  return output;
}

async function localizeFeatureImage(url, ghostUrl, slug) {
  if (!url) return "";

  let absolute;

  try {
    absolute = url.startsWith("http")
      ? url
      : new URL(url, ghostUrl).href;
  } catch {
    return url;
  }

  const parsed = new URL(absolute);

  /*
   * Only copy media belonging to our local Ghost installation.
   * External images such as static.ghost.org remain external.
   */
  if (
    parsed.origin !== new URL(ghostUrl).origin &&
    !parsed.pathname.includes("/content/images/")
  ) {
    return url;
  }

  if (!parsed.pathname.includes("/content/images/")) {
    return url;
  }

  const filename = path.basename(parsed.pathname);
  const postFolder = safeSlug(slug);

  const diskPath = path.join(
    MEDIA_DIR,
    postFolder,
    filename
  );

  const publicPath =
    `/images/ghost/${postFolder}/${filename}`;

  console.log(`  ↓ feature ${filename}`);

  await download(absolute, diskPath);

  return publicPath;
}

async function main() {
  if (!fs.existsSync(ENV_FILE)) {
    throw new Error(".ghost.env not found");
  }

  const env = loadEnv();

  const ghostUrl = env.GHOST_URL?.replace(/\/$/, "");
  const key = env.GHOST_CONTENT_API_KEY;

  if (!ghostUrl || !key) {
    throw new Error(
      "Missing GHOST_URL or GHOST_CONTENT_API_KEY"
    );
  }

  const endpoint =
    `${ghostUrl}/ghost/api/content/posts/` +
    `?key=${encodeURIComponent(key)}` +
    `&limit=all` +
    `&include=tags,authors`;

  console.log("===== GHOST → WVRNER SYNC =====");

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      `Ghost API: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(MEDIA_DIR, { recursive: true });

  /*
   * Only this directory is Ghost-managed.
   * Existing posts/*.md and other site files are untouched.
   */
  for (const oldFile of fs.readdirSync(POSTS_DIR)) {
    if (oldFile.endsWith(".html")) {
      fs.rmSync(path.join(POSTS_DIR, oldFile));
    }
  }

  for (const post of data.posts) {
    const slug = safeSlug(post.slug);
    const tags = (post.tags || []).map(tag => (tag.name || "").replace(/^#/, ""));

    console.log(`\n→ ${post.title}`);

    let html = post.html || "";

    html = await localizeGhostMedia(
      html,
      ghostUrl,
      slug
    );

    const featureImage =
      await localizeFeatureImage(
        post.feature_image,
        ghostUrl,
        slug
      );

    /*
     * Ghost commonly emits portal links such as #/portal/.
     * They don't belong on the static WVRNER site.
     */
    html = html
      .replace(/href=["']#\/portal\/?["']/gi, 'href="/blog/"')
      .replace(
        /https?:\/\/localhost:2368\/content\/images\//gi,
        "/images/ghost/"
      );

    const publishedDate =
      post.published_at || post.created_at || new Date().toISOString();

    const displayDate = new Date(publishedDate)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
      });

    const excerpt =
      post.custom_excerpt ||
      post.excerpt ||
      "";

    const category =
      tags[0] || "Dispatch";

    const frontmatter = `---
layout: post.njk
permalink: "/posts/${slug}.html"
title: ${yamlString(post.title)}
subtitle: ${yamlString(excerpt)}
excerpt: ${yamlString(excerpt)}
published: true
featured: ${post.featured ? "true" : "false"}
date: ${yamlString(publishedDate)}
display_date: ${yamlString(displayDate)}
read_time: ${yamlString(
      `${Math.max(1, post.reading_time || 1)} min read`
    )}
cover_image: ${yamlString(featureImage)}
ghost_id: ${yamlString(post.id)}
ghost_slug: ${yamlString(post.slug)}
ghost_managed: true
---

${html}
`;

    const destination =
      path.join(POSTS_DIR, `${slug}.html`);

    fs.writeFileSync(
      destination,
      frontmatter,
      "utf8"
    );

    console.log(
      `  ✓ posts/ghost/${slug}.html`
    );
  }

  console.log(
    `\n✅ Synced ${data.posts.length} Ghost post(s).`
  );
}

main().catch(error => {
  console.error("\n❌ Ghost sync failed:");
  console.error(error.message);
  process.exitCode = 1;
});
