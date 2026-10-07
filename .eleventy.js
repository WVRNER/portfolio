function enhanceRichTables(content, outputPath) {
  if (!outputPath || !outputPath.endsWith(".html") || !content.includes("<table")) {
    return content;
  }

  return content.replace(/(<div class="[^"]*post-body-section[^"]*">)([\s\S]*?)(<\/div>\s*<!-- Article Footer)/i, (match, openDiv, body, closeDiv) => {
    let searchStart = 0;
    const updatedBody = body.replace(/<table>([\s\S]*?)<\/table>/gi, (tableHtml) => {
      if (tableHtml.includes("rich-table-card")) return tableHtml;

      const tablePos = body.indexOf(tableHtml, searchStart);
      searchStart = tablePos + tableHtml.length;

      const precedingText = body.slice(0, tablePos);
      const headings = Array.from(precedingText.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi));
      const rawTitle = headings.length ? headings[headings.length - 1][1].replace(/<[^>]+>/g, "").trim() : "Technical Specification Matrix";
      const tableTitle = rawTitle.replace(/^\d+\.\s*/, "");

      let icon = "📊";
      if (/npm|ci|install/i.test(tableTitle)) icon = "📦";
      else if (/architecture|static|dynamic/i.test(tableTitle)) icon = "⚡";
      else if (/technology|breakdown|component/i.test(tableTitle)) icon = "🛠️";
      else if (/database|storage|s3/i.test(tableTitle)) icon = "🗄️";
      else if (/security|auth|oidc/i.test(tableTitle)) icon = "🔒";

      const rowMatches = tableHtml.match(/<tr[^>]*>/gi) || [];
      const rowCount = Math.max(1, rowMatches.length - 1);

      let enhancedTable = tableHtml.replace(/<th([^>]*)>(.*?)<\/th>/gi, (thMatch, attrs, rawTh) => {
        const text = rawTh.replace(/<span class="sort-icon".*?<\/span>/gi, "").trim();
        return `<th${attrs} role="columnheader" tabindex="0" title="Click to sort by ${text}">${text} <span class="sort-icon" aria-hidden="true">⇅</span></th>`;
      });

      enhancedTable = enhancedTable.replace(/<td([^>]*)>(.*?)<\/td>/gi, (tdMatch, attrs, rawText) => {
        let text = rawText.trim();
        let badgeHtml = null;

        if (/^(Zero|Pre-compiled|100%|Instant|Sub-10ms|\$0\.00|Zero hosting overhead|Zero cost|Read-only|High availability|100% byte-for-byte deterministic|Zero \(Read-only static files; no server runtime\))$/i.test(text)) {
          badgeHtml = `<span class="tbl-badge tbl-badge-green"><span class="tbl-badge-dot"></span>${text}</span>`;
        } else if (/^(High|SQL injection|Complex|Non-deterministic|Vulnerabilities|High \(SQL injection, XSS, plugin CVEs\))$/i.test(text)) {
          badgeHtml = `<span class="tbl-badge tbl-badge-red"><span class="tbl-badge-dot"></span>${text}</span>`;
        } else if (/^(15ms\s*–\s*50ms|200ms\s*–\s*1200ms|15ms\s*–\s*50ms \(served directly from Anycast edge\)|200ms\s*–\s*1200ms \(dependent on DB & cache\))$/i.test(text)) {
          badgeHtml = `<span class="tbl-badge tbl-badge-blue">${text}</span>`;
        } else if (/^(Git|GitHub|Eleventy \(11ty\)|GitHub Actions|GitHub Pages|Cloudflare DNS|Pages CMS|Neubrutalist CSS)$/i.test(text)) {
          badgeHtml = `<span class="tbl-badge tbl-badge-teal">${text}</span>`;
        }

        if (badgeHtml) {
          return `<td${attrs}>${badgeHtml}</td>`;
        }
        return tdMatch;
      });

      return `\n<div class="rich-table-card">\n  <div class="rich-table-header">\n    <div class="rich-table-title-group">\n      <span class="rich-table-icon" aria-hidden="true">${icon}</span>\n      <h4 class="rich-table-title">${tableTitle}</h4>\n      <span class="rich-table-count">${rowCount} ${rowCount === 1 ? "record" : "records"}</span>\n    </div>\n    <div class="rich-table-search-box">\n      <span class="rich-table-search-icon" aria-hidden="true">🔍</span>\n      <input type="text" class="rich-table-search-input" placeholder="Search table..." aria-label="Search ${tableTitle}" />\n    </div>\n  </div>\n  <div class="rich-table-scroll-area">\n    ${enhancedTable}\n  </div>\n  <div class="rich-table-footer-hint">\n    <span>⇄ Swipe horizontally to explore full table</span>\n  </div>\n</div>\n`;
    });
    return openDiv + updatedBody + closeDiv;
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("admin");

  // Keep Markdown content 100% pure (disables template preprocessing),
  // while allowing directory-data permalinks like /posts/{{ page.fileSlug }}.html to resolve
  const nunjucks = require("nunjucks");
  eleventyConfig.addExtension("md", {
    compileOptions: {
      permalink: function (permalinkString, inputPath) {
        return function (data) {
          if (typeof permalinkString === "string" && permalinkString.includes("{{")) {
            return nunjucks.renderString(permalinkString, data);
          }
          return permalinkString;
        };
      },
    },
  });

  // Automatically collect every Markdown blog post, sorted with featured on top, then newest first
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob([
        "./posts/*.md",
        "./posts/ghost/*.html"
      ])
      .filter((post) => post.data.published !== false)
      .sort((a, b) => {
        // Featured posts on top
        const isFeaturedA = (a.data.featured === true || a.data.featured === "true") ? 1 : 0;
        const isFeaturedB = (b.data.featured === true || b.data.featured === "true") ? 1 : 0;
        if (isFeaturedB !== isFeaturedA) {
          return isFeaturedB - isFeaturedA;
        }

        // Then sort newest first
        const timeA = new Date(a.data.date || a.date).getTime() || 0;
        const timeB = new Date(b.data.date || b.date).getTime() || 0;
        return (timeB - timeA) || b.inputPath.localeCompare(a.inputPath);
      });
  });

  // Automatically transform markdown tables in articles into dashboard-grade rich tables
  eleventyConfig.addTransform("rich-tables", enhanceRichTables);

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
  };
};
