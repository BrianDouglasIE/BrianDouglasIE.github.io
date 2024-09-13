import * as PImage from "pureimage";
import * as fs from "fs";
import path from "node:path";

const OUT_DIR = "./docs/images/og-images";
const FONT = PImage.registerFont(
  "C:\\Users\\brian\\AppData\\Local\\Microsoft\\Windows\\Fonts\\JetBrainsMono-Bold.ttf",
  "MyFont",
);

FONT.loadSync();

export async function generateOGImage(post) {
  const pImage = PImage.make(1280, 640);
  const ctx = pImage.getContext("2d");
  const image = await PImage.decodePNGFromStream(
    fs.createReadStream("./theme/assets/images/open-graph-template.png"),
  );
  ctx.drawImage(image, 0, 0);

  const text = post.data.title;
  const maxWidth = 700;
  const lineHeight = 80;
  const x = 520;
  const y = 270;

  ctx.font = "80px MyFont";
  ctx.fillStyle = "black";
  wrapText(ctx, text, x, y, maxWidth, lineHeight);

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
  }

  await PImage.encodePNGToStream(
    pImage,
    fs.createWriteStream(path.join(OUT_DIR, `${post.slug}.png`)),
  );
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let testLine, metrics, testWidth;

  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + " ";
    metrics = ctx.measureText(testLine);
    testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
