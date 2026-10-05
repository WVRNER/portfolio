module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("CNAME");

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
      .getFilteredByGlob("./posts/*.md")
      .filter((post) => post.data.published !== false)
      .sort((a, b) => {
        // Featured posts on top
        const isFeaturedA = a.data.featured ? 1 : 0;
        const isFeaturedB = b.data.featured ? 1 : 0;
        if (isFeaturedB !== isFeaturedA) {
          return isFeaturedB - isFeaturedA;
        }

        // Then sort newest first
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
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
  };
};
