const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = __dirname;
const photoDir = path.join(baseDir, 'product_photos');
const uploadDir = path.join(baseDir, 'uploads');
const seedFile = path.join(baseDir, 'seed_demo.py');

const PALETTES = {
  electronic: ['#0b7a82', '#12304a'],
  sport: ['#f59e0b', '#b45309'],
  book: ['#6366f1', '#312e81'],
  study: ['#10b981', '#065f46'],
  calculator: ['#ef4444', '#7f1d1d'],
  college: ['#3b82f6', '#1e3a8a'],
  hostel: ['#ec4899', '#831843'],
  other: ['#8b5cf6', '#4c1d95'],
};

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function makeSvg(emoji, title, keyword) {
  const [start, end] = PALETTES[keyword] || PALETTES.other;
  const short = title.length <= 34 ? title : title.slice(0, 31) + '...';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${start}"/>
  <stop offset="1" stop-color="${end}"/></linearGradient></defs>
  <rect width="600" height="450" fill="url(#g)"/>
  <text x="300" y="240" font-size="150" text-anchor="middle">${emoji}</text>
  <text x="300" y="375" font-size="26" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">${escapeXml(short)}</text>
</svg>`;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function findPhoto(title, group) {
  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  const keys = [slugify(title), group];
  for (const k of keys) {
    for (const ext of exts) {
      const p = path.join(photoDir, k + ext);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

const py = fs.readFileSync(seedFile, 'utf8');

const sectionRegex = /\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*\[([\s\S]*?)\]\s*\)/g;
let match;
let totalItems = 0;
let photosApplied = 0;
let svgReverted = 0;

while ((match = sectionRegex.exec(py)) !== null) {
  const keywords = match[1].split('|')[0].trim();
  const group = match[2];
  const emoji = match[3];
  const entriesStr = match[4];
  const itemRegex = /\(\s*"([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*\)/g;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(entriesStr)) !== null) {
    totalItems++;
    const title = itemMatch[1];
    const digest = crypto.createHash('md5').update(title, 'utf8').digest('hex').slice(0, 12);
    const photoPath = findPhoto(title, group);

    const targetSvg = path.join(uploadDir, `demo-${digest}.svg`);

    if (photoPath) {
      const ext = path.extname(photoPath).toLowerCase();
      if (ext === '.svg') {
        fs.copyFileSync(photoPath, targetSvg);
        // remove old jpg if any
        for (const e of ['.jpg', '.jpeg', '.png', '.webp']) {
          const f = path.join(uploadDir, `demo-${digest}${e}`);
          if (fs.existsSync(f)) fs.unlinkSync(f);
        }
      } else {
        const targetJpg = path.join(uploadDir, `demo-${digest}${ext}`);
        fs.copyFileSync(photoPath, targetJpg);

        const imgData = fs.readFileSync(photoPath);
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        const base64 = `data:${mime};base64,${imgData.toString('base64')}`;
        
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="450" viewBox="0 0 600 450">
  <image width="600" height="450" preserveAspectRatio="xMidYMid slice" href="${base64}" xlink:href="${base64}"/>
</svg>`;
        fs.writeFileSync(targetSvg, svgContent, 'utf8');
      }
      photosApplied++;
    } else {
      // Remove any previously copied mismatched JPG file
      for (const e of ['.jpg', '.jpeg', '.png', '.webp']) {
        const f = path.join(uploadDir, `demo-${digest}${e}`);
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
        }
      }
      // Revert to clean accurate SVG placeholder card
      fs.writeFileSync(targetSvg, makeSvg(emoji, title, keywords), 'utf8');
      svgReverted++;
    }
  }
}

console.log(`\nTotal items: ${totalItems}`);
console.log(`Real photos applied: ${photosApplied}`);
console.log(`Clean cards with correct title/emoji: ${svgReverted}`);
