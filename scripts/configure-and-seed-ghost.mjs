import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { BLOG_POSTS } from "../lib/blogData.ts";

const GHOST_DB_PATH = "/Users/wvrner/ghost-local/content/data/ghost-local.db";

if (!fs.existsSync(GHOST_DB_PATH)) {
  console.error("Ghost database not found at", GHOST_DB_PATH);
  process.exit(1);
}

// Generate editorial HTML for a blog post
function generatePostHtml(post) {
  let html = "";
  
  if (post.subtitle) {
    html += `<p class="editorial-subtitle" style="font-size: 20px; color: #6B6B6B; line-height: 1.4; margin-bottom: 24px;">${post.subtitle}</p>`;
  }

  if (post.pullQuote) {
    html += `<blockquote style="border-left: 3px solid #161617; padding-left: 20px; font-style: italic; margin: 32px 0; color: #242424; font-size: 20px; line-height: 1.45;">“${post.pullQuote}”</blockquote>`;
  }

  if (post.content?.lead) {
    html += `<p style="font-size: 19px; line-height: 1.65; color: #242424; margin-bottom: 24px;">${post.content.lead}</p>`;
  }

  if (post.content?.sections) {
    for (const sec of post.content.sections) {
      if (sec.heading) {
        html += `<h2 style="font-size: 24px; font-weight: 700; margin-top: 40px; margin-bottom: 16px; color: #242424; letter-spacing: -0.02em;">${sec.heading}</h2>`;
      }
      if (sec.paragraphs) {
        for (const p of sec.paragraphs) {
          html += `<p style="font-size: 18px; line-height: 1.7; color: #242424; margin-bottom: 20px;">${p}</p>`;
        }
      }
      if (sec.codeBlock) {
        html += `<pre style="background: #161617; color: #EDEDED; padding: 18px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13.5px; margin: 24px 0;"><code class="language-${sec.codeBlock.language}">${sec.codeBlock.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
      }
      if (sec.callout) {
        html += `<div style="background: #F9F9F9; border-left: 3px solid #161617; padding: 16px 20px; border-radius: 6px; margin: 28px 0;"><strong style="display:block; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #161617;">${sec.callout.title}</strong><p style="margin: 0; font-size: 15px; color: #404040; line-height: 1.6;">${sec.callout.body}</p></div>`;
      }
      if (sec.list && sec.list.length > 0) {
        html += `<ol style="margin: 24px 0; padding-left: 24px; color: #242424; font-size: 17px; line-height: 1.7;">`;
        for (const item of sec.list) {
          html += `<li style="margin-bottom: 10px;">${item}</li>`;
        }
        html += `</ol>`;
      }
    }
  }

  return html;
}

// Write a python helper to execute SQLite transactions safely
const pythonScript = `
import sqlite3
import json
import uuid
import time
import os

DB_PATH = "${GHOST_DB_PATH}"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 1. Configure publication settings
settings_updates = [
    ("title", "WVRNER"),
    ("description", "Engineering automated cloud systems, declarative infrastructure, and site reliability."),
    ("accent_color", "#161617"),
    ("navigation", json.dumps([
        {"label": "Home", "url": "http://localhost:3000/"},
        {"label": "Stories", "url": "http://localhost:3000/blog"},
        {"label": "Systems", "url": "http://localhost:3000/#systems"},
        {"label": "About", "url": "http://localhost:3000/#about"}
    ])),
    ("secondary_navigation", json.dumps([
        {"label": "GitHub", "url": "https://github.com/wvrner"},
        {"label": "LinkedIn", "url": "https://linkedin.com/in/wvrner"}
    ]))
]

for key, val in settings_updates:
    cursor.execute("UPDATE settings SET value = ? WHERE key = ?", (val, key))

# 2. Update author profile
cursor.execute("""
    UPDATE users SET 
        name = 'Nima Hosseini',
        slug = 'wvrner',
        bio = 'Cloud & DevOps Engineer • AWS, Terraform, Kubernetes, CI/CD • Engineering quiet infrastructure and deterministic cloud state.',
        location = 'Toronto / Remote',
        website = 'http://localhost:3000'
    WHERE slug = 'wvrner' OR email = 'wvrner@pm.me';
""")

cursor.execute("SELECT id FROM users WHERE slug = 'wvrner' OR email = 'wvrner@pm.me' LIMIT 1")
user_row = cursor.fetchone()
author_id = user_row[0] if user_row else "6ac5f65a65f85662b1a2578e"

print(f"Configured Ghost publication settings & author {author_id}")

# 3. Read posts JSON
with open('/tmp/ghost_posts_seed.json', 'r') as f:
    posts = json.load(f)

for idx, p in enumerate(posts):
    slug = p['slug']
    title = p['title']
    html = p['html']
    excerpt = p['excerpt']
    feature_image = p.get('featureImage', '')
    reading_time = int(p.get('readingTime', '6').split()[0])
    featured = 1 if p.get('featured') else 0
    now = time.strftime('%Y-%m-%d %H:%M:%S')

    # Check if exists
    cursor.execute("SELECT id FROM posts WHERE slug = ?", (slug,))
    existing = cursor.fetchone()

    if existing:
        post_id = existing[0]
        cursor.execute("""
            UPDATE posts SET
                title = ?,
                html = ?,
                custom_excerpt = ?,
                plaintext = ?,
                feature_image = ?,
                featured = ?,
                status = 'published',
                type = 'post',
                visibility = 'public',
                reading_time = ?,
                updated_at = ?
            WHERE id = ?
        """, (title, html, excerpt, excerpt, feature_image, featured, reading_time, now, post_id))
    else:
        post_id = uuid.uuid4().hex[:24]
        post_uuid = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO posts (
                id, uuid, title, slug, html, plaintext, custom_excerpt,
                feature_image, featured, type, status, locale, visibility,
                email_recipient_filter, created_at, updated_at, published_at,
                reading_time, show_title_and_feature_image
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, 'post', 'published', 'en', 'public',
                'none', ?, ?, ?,
                ?, 1
            )
        """, (
            post_id, post_uuid, title, slug, html, excerpt, excerpt,
            feature_image, featured, now, now, now, reading_time
        ))

    # Link Author
    cursor.execute("DELETE FROM posts_authors WHERE post_id = ?", (post_id,))
    author_link_id = uuid.uuid4().hex[:24]
    cursor.execute("""
        INSERT INTO posts_authors (id, post_id, author_id, sort_order)
        VALUES (?, ?, ?, 0)
    """, (author_link_id, post_id, author_id))

    # Tags
    cursor.execute("DELETE FROM posts_tags WHERE post_id = ?", (post_id,))
    tags = [p['category']] + p.get('tags', [])
    for t_idx, tag_name in enumerate(tags):
        tag_slug = tag_name.lower().replace(" ", "-").replace("/", "-")
        cursor.execute("SELECT id FROM tags WHERE slug = ?", (tag_slug,))
        t_row = cursor.fetchone()
        if t_row:
            tag_id = t_row[0]
        else:
            tag_id = uuid.uuid4().hex[:24]
            cursor.execute("""
                INSERT INTO tags (id, name, slug, visibility, created_at, updated_at)
                VALUES (?, ?, ?, 'public', ?, ?)
            """, (tag_id, tag_name, tag_slug, now, now))
        
        post_tag_id = uuid.uuid4().hex[:24]
        cursor.execute("""
            INSERT INTO posts_tags (id, post_id, tag_id, sort_order)
            VALUES (?, ?, ?, ?)
        """, (post_tag_id, post_id, tag_id, t_idx))

conn.commit()
conn.close()
print(f"Successfully seeded {len(posts)} posts into Ghost CMS database!")
`;

// Build posts payload
const seedData = BLOG_POSTS.map((post) => ({
  slug: post.slug,
  title: post.title,
  subtitle: post.subtitle || "",
  excerpt: post.excerpt,
  pullQuote: post.pullQuote || "",
  readingTime: post.readingTime,
  category: post.category,
  tags: post.tags,
  featureImage: post.featureImage || "",
  featured: post.featured || false,
  html: generatePostHtml(post),
}));

fs.writeFileSync("/tmp/ghost_posts_seed.json", JSON.stringify(seedData, null, 2));
fs.writeFileSync("/tmp/seed_ghost.py", pythonScript);

console.log("Seeding Ghost database...");
execSync("python3 /tmp/seed_ghost.py", { stdio: "inherit" });

console.log("Restarting Ghost instance to reload cache...");
try {
  execSync("cd /Users/wvrner/ghost-local && ghost restart", { stdio: "inherit" });
} catch (e) {
  console.log("Ghost restart output:", e.message);
}

console.log("Done!");
