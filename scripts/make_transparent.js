import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const guideDir = path.resolve('public/images/guide');
const files = ['khalid_welcome.jpg', 'khalid_pointing.jpg', 'khalid_thinking.jpg', 'khalid_waving.jpg'];

async function processFile(filename) {
  const inputPath = path.join(guideDir, filename);
  const outName = filename.replace('.jpg', '.png');
  const outputPath = path.join(guideDir, outName);

  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const totalPixels = width * height;
  const isBg = new Uint8Array(totalPixels);
  const visited = new Uint8Array(totalPixels);

  // BFS from borders to strictly find outer background
  const queue = [];

  function isWhiteLike(idx) {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    // Distance from pure white (255,255,255)
    return r >= 238 && g >= 238 && b >= 238;
  }

  // Push border pixels
  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const botIdx = (height - 1) * width + x;
    if (isWhiteLike(topIdx)) { queue.push(topIdx); visited[topIdx] = 1; isBg[topIdx] = 1; }
    if (isWhiteLike(botIdx)) { queue.push(botIdx); visited[botIdx] = 1; isBg[botIdx] = 1; }
  }
  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const rightIdx = y * width + (width - 1);
    if (isWhiteLike(leftIdx) && !visited[leftIdx]) { queue.push(leftIdx); visited[leftIdx] = 1; isBg[leftIdx] = 1; }
    if (isWhiteLike(rightIdx) && !visited[rightIdx]) { queue.push(rightIdx); visited[rightIdx] = 1; isBg[rightIdx] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        visited[n] = 1;
        if (isWhiteLike(n)) {
          isBg[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // Apply transparency with feather
  for (let i = 0; i < totalPixels; i++) {
    if (isBg[i]) {
      data[i * 4 + 3] = 0; // Completely transparent
    } else {
      // Check if near background for subtle feathering
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const minVal = Math.min(r, g, b);
      if (minVal > 225) {
        // Feather near edges
        const factor = (255 - minVal) / 30; // 0 to 1
        data[i * 4 + 3] = Math.max(0, Math.min(255, Math.round(255 * factor)));
      }
    }
  }

  await sharp(data, {
    raw: { width, height, channels: 4 }
  }).png({ compressionLevel: 9 }).toFile(outputPath);

  console.log(`Saved transparent PNG: ${outName}`);
}

async function run() {
  for (const f of files) {
    await processFile(f);
  }
  console.log('All poses processed successfully!');
}

run();
