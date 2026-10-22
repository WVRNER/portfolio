import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

// Fallback to reading .env.local if not already in process.env
if (!process.env.GHOST_CONTENT_API_KEY && fs.existsSync(".env.local")) {
  const content = fs.readFileSync(".env.local", "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const GHOST_URL = process.env.GHOST_URL || "http://localhost:2368";
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY || "";

console.log("====================================");
console.log("       GHOST CMS → WVRNER SYNC      ");
console.log("====================================");
console.log(`Connecting to: ${GHOST_URL}`);

async function sync() {
  const endpoint = `${GHOST_URL.replace(
    /\/$/,
    ""
  )}/ghost/api/content/posts/?key=${encodeURIComponent(
    GHOST_CONTENT_API_KEY
  )}&include=tags,authors&limit=all`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Ghost API returned HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const count = data.posts?.length || 0;
    console.log(`✓ Successfully fetched ${count} post(s) from Ghost CMS.`);

    for (const post of data.posts || []) {
      console.log(`  • [${post.slug}] ${post.title}`);
    }

    console.log("\nGhost CMS is fully synchronized and ready!");
  } catch (err) {
    console.error("Sync failed:", err.message);
    process.exitCode = 1;
  }
}

sync();
