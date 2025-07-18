import * as path from "node:path";
import { globSync } from "glob";
import * as url from "node:url";
import * as fs from "node:fs";
import fm from "front-matter";
import { parseDate } from "./template-helpers.js";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";

const convertWinPathToUnix = (p) => path.normalize(p).replace(/\\/g, "/");
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsDir = path.join(__dirname, "./posts");
const globPattern = path.join(postsDir, "**/*.md");
const markdownFiles = globSync(convertWinPathToUnix(globPattern));

const md = MarkdownIt({ html: true });

Shiki({ theme: "github-light" }).then((plugin) => md.use(plugin));

class Post {
  constructor(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const frontmatter = fm(fileContent);
    this.data = frontmatter.attributes;

    this.html = md.render(frontmatter.body);
    this.slug = convertWinPathToUnix(
      filePath.replace(postsDir, "").replace(".md", ""),
    );
    this.excerpt = this.html.split("<!-- more -->").at(0);
  }
}

export function getPosts() {
  const posts = [];
  for (const file of markdownFiles) {
    const p = new Post(file);
    if (p.data.published !== false) {
      posts.push(p);
    }
  }
  return posts.sort((a, b) => parseDate(b.data.date) - parseDate(a.data.date));
}
