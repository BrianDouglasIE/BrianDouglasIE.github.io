import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { Buffer } from "node:buffer";
import { readdir, readFile, writeFile, mkdir, copyFile, cp } from 'node:fs/promises'

import sharp from 'sharp'
import matter from 'gray-matter'
import showdown from 'showdown'
import showdownHighlight from 'showdown-highlight'

const postsDir = './posts'
const outDir = './docs'
const viewDir = './views'
const assetsDir = './assets'
const includeDir = join(viewDir, './includes')
const markdown = new showdown.Converter({
    extensions: [showdownHighlight({
        pre: true, auto_detection: true
    })]
})

const ogSvgMaxLineLength = 20;
const ogSvgFontSize = 60;
const ogSvgLineHeight = 1.2;
const ogSvgStartX = 520;
const ogSvgStartY = 270;

/*
 * View engine
 */

const includes = {}

const templateHelpers = {
    include: (name, data) => includes[name](data),
    formatDate, parseDate, groupPostsByYear
}

function compileTemplate(template, ...varNames) {
    const fn = new Function('helpers', ...varNames, `return \`${template}\``)
    return (...args) => fn(templateHelpers, ...args)
}

for (const entry of await readdir(includeDir)) {
    if (!entry.endsWith('.html')) continue

    includes[entry.replace('.html', '')] = compileTemplate(await readFile(join(includeDir, entry)), 'data')
}

const views = {}
for (const entry of await readdir(viewDir)) {
    if (!entry.endsWith('.html')) continue

    views[entry.replace('.html', '')] = compileTemplate(await readFile(join(viewDir, entry), 'utf8'), 'data')
}

function view(name, data) {
    return views[name](data)
}

/*
 * Read and write post files
 */

if (!existsSync(outDir)) await mkdir(outDir)

export const posts = []
const ogImageQueue = []
const postWriteQueue = []
for (const entry of await readdir(postsDir)) {
    if (!entry.endsWith('.md')) continue

    const path = join(postsDir, entry)
    const post = matter.read(path, { excerpt_separator: '<!-- more -->' })
    post.html = markdown.makeHtml(post.content)
    post.excerptHtml = markdown.makeHtml(post.excerpt)
    post.slug = entry.replace('.md', '')
    posts.push(post)

    const targetDir = join(outDir, post.slug)
    if (!existsSync(targetDir)) await mkdir(targetDir)

    postWriteQueue.push(writeFile(join(targetDir, 'index.html'), view('post', post)))
    if (!existsSync(getOgImagePath(post))) ogImageQueue.push(generateOgImage(post))
}

await Promise.all([...ogImageQueue, ...postWriteQueue])

const postsDateDesc = posts.toSorted((a, b) =>
    parseDate(a.data.date) > parseDate(b.data.date) ? -1 : 1)

await writeFile(join(outDir, 'index.html'), view('index', { posts: postsDateDesc }))

const sitemap = compileTemplate(await readFile('./sitemap.xml'), 'data')
await writeFile(join(outDir, 'sitemap.xml'), sitemap({ posts: postsDateDesc }))

await copyFile('./CNAME', join(outDir, 'CNAME'))
await cp(assetsDir, outDir, { recursive: true })

async function generateOgImage(post) {
    try {
        const templateImage = join(assetsDir, '/images/open-graph-template.png')
        const image = sharp(templateImage)
        const metadata = await image.metadata()

        const svgText = createWrappedSvg(post.data.title, metadata.width, metadata.height);
        const targetDir = join(outDir, 'images/og-images')
        if (!existsSync(targetDir)) await mkdir(targetDir, { recursive: true })

        return image
            .composite([
                {
                    input: Buffer.from(svgText),
                    top: 0,
                    left: 0
                }
            ])
            .resize(metadata.width, metadata.height)
            .toFile(getOgImagePath(post));
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

/*
 * Helpers
 */

function formatDate(dateStr) {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const [day, month, year] = dateStr.split("/").map(Number);

    const monthName = months[month - 1];
    const dayWithSuffix = getDaySuffix(day);

    return `${monthName} ${dayWithSuffix}, ${year}`;
}

function getDaySuffix(day) {
    if (day > 3 && day < 21) return day + "th";
    switch (day % 10) {
        case 1:
            return day + "st";
        case 2:
            return day + "nd";
        case 3:
            return day + "rd";
        default:
            return day + "th";
    }
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split("/");
    const formattedDate = `${year}-${month}-${day}`;
    return new Date(formattedDate);
}

function wrapText(text, maxLineLength) {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (const word of words) {
        const testLine = line + word + ' ';
        if (testLine.length > maxLineLength) {
            lines.push(line.trim());
            line = word + ' ';
        } else {
            line = testLine;
        }
    }

    if (line) lines.push(line.trim());

    return lines;
}

function createWrappedSvg(text, width, height) {
    const lines = wrapText(text, ogSvgMaxLineLength);
    const tspanLines = lines.map((line, index) => {
        const y = ogSvgStartY + index * ogSvgFontSize * ogSvgLineHeight;
        return `<tspan x="${ogSvgStartX}" y="${y}">${line}</tspan>`;
    }).join('');

    return `
    <svg width="${width}" height="${height}">
      <style>
        .title { fill: #222; font-size: ${ogSvgFontSize}px; font-weight: bold; font-family: Arial, Verdana, sans-serif; }
      </style>
      <text class="title">
        ${tspanLines}
      </text>
    </svg>
  `;
}

function getOgImagePath(post) {
    return join(outDir, 'images/og-images', post.slug + '.png')
}

function groupPostsByYear(posts) {
	const postsByYear = {}
	for(const post of posts) {
		const year = post.data.date.split('/').pop()
		if(postsByYear[year]) postsByYear[year].push(post)
		else postsByYear[year] = [post]
	}
	return postsByYear
}
