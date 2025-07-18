import { dest, parallel, src, watch, series } from "gulp";
import { deleteAsync } from "del";
import ejs from "gulp-ejs";
import { getPosts } from "./posts.js";
import * as fs from "node:fs";
import * as path from "node:path";
import connect from "gulp-connect";
import rename from "gulp-rename";
import * as templateHelpers from "./template-helpers.js";
import { generateSitemap } from "./sitemap.js";
import { Worker } from 'worker_threads';

let POSTS = getPosts();
const DIST = "./docs";
const INCLUDE_DIR = path.join(process.cwd(), "/theme/templates/includes");

export function clean() {
  return deleteAsync([DIST]);
}

export function buildIndex() {
  return src("./theme/index.ejs")
    .pipe(rename("index.html"))
    .pipe(
      ejs({ posts: POSTS, helpers: templateHelpers }, { views: [INCLUDE_DIR] }),
    )
    .pipe(dest(DIST))
    .pipe(connect.reload());
}

export function buildPosts() {
  POSTS = getPosts();
  const tasks = POSTS.map((post) => {
    const outputPath = path.join(DIST, post.slug, "index.html");

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath));
    }

    return new Promise((resolve, reject) => {
      src("./theme/templates/post.ejs")
        .pipe(rename("index.html"))
        .pipe(ejs({ post, helpers: templateHelpers }, { views: [INCLUDE_DIR] }))
        .pipe(dest(path.dirname(outputPath)))
        .pipe(connect.reload())
        .on("end", resolve)
        .on("error", reject);
    });
  });

  return Promise.all(tasks);
}

export function copyAssets() {
  return src("./theme/assets/**/*", { encoding: false })
    .pipe(dest(DIST))
    .pipe(connect.reload());
}

export function sitemap() {
  return new Promise((resolve, reject) => {
    generateSitemap(POSTS, DIST);
    resolve();
  });
}

function runWorker(file, data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(file, { workerData: data });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

export async function generateOGImages() {
  const promises = POSTS.map((post) => 
    runWorker('./og-image-generator.worker.js', post)
  );
  await Promise.all(promises);
}

export const build = series([
  buildIndex,
  buildPosts,
  copyAssets,
  sitemap,
  generateOGImages,
]);

function serve() {
  connect.server({
    root: DIST,
    port: 8080,
    livereload: true,
  });
}

function watchFiles() {
  watch("./posts/**/*.md", buildPosts);
  watch("./theme/index.ejs", buildIndex);
  watch("./theme/assets/**/*", copyAssets);
  watch("./theme/templates/**/*", series(buildIndex, buildPosts));
}

export default series(build, parallel(serve, watchFiles));
