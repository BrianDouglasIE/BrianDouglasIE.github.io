import fs from "node:fs";
import * as path from "node:path";
import {parseDate} from "./template-helpers.js";

export function generateSitemap(posts, outputDirectory) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for(const post of posts) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>https://www.briandouglas.ie${post.slug}</loc>\n`;
    sitemap += `    <lastmod>${parseDate(post.data.date).toISOString()}</lastmod>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;
  }

  sitemap += `</urlset>`;

  fs.writeFileSync(path.join(outputDirectory, "sitemap.xml"), sitemap);
}

