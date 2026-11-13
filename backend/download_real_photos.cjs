const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const baseDir = __dirname;
const photoDir = path.join(baseDir, 'product_photos');

// Exact photo mapping (name to download -> direct image URL)
const IMAGES = {
  // Hostel Essentials (Fixing the kettle on cooktop/fridge/iron/chair)
  'induction-cooktop-1800w.jpg': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80',
  'steam-iron-1000w.jpg': 'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=600&q=80',
  'plastic-chair-armless.jpg': 'https://images.unsplash.com/photo-1580481077195-c9a7d30f36f6?w=600&q=80',
  'table-fan-400mm.jpg': 'https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?w=600&q=80',
  'room-heater-1000w.jpg': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  'lamp.jpg': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',

  // Computer Accessories (Fixing laptop photo on keyboard/mouse)
  'keyboard.jpg': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  'mouse.jpg': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
  'monitor.jpg': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
  'earphones.jpg': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
  'speaker.jpg': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
  'phone.jpg': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  'tablet.jpg': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
  'power-bank.jpg': 'https://images.unsplash.com/photo-1609592807664-84618e404b90?w=600&q=80',

  // Books (Fixing DSA book on all subjects)
  'book-python.jpg': 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&q=80',
  'book-dbms.jpg': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  'book-java.jpg': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  'book-os.jpg': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
  'book-networks.jpg': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',

  // Daily Use & Sports (Fixing backpack on winter jacket & badminton on cricket)
  'winter-jacket-size-m.jpg': 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80',
  'hoodie-size-l.jpg': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
  'steel-water-bottle-1-litre.jpg': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
  'umbrella-large-windproof.jpg': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&q=80',
  'cricket.jpg': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
  'football.jpg': 'https://images.unsplash.com/photo-1553778263-73a86bef667c?w=600&q=80',
  'sports-shoes.jpg': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'acoustic-guitar-with-bag.jpg': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
  'chess-set-folding-board.jpg': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80',
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;

    const request = (currUrl) => {
      client.get(currUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return request(response.headers.location);
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`Status ${response.statusCode}`));
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

async function main() {
  console.log('Downloading accurate product photos...\n');
  let count = 0;
  for (const [filename, url] of Object.entries(IMAGES)) {
    const dest = path.join(photoDir, filename);
    process.stdout.write(`Downloading ${filename}... `);
    try {
      await downloadFile(url, dest);
      console.log('OK');
      count++;
    } catch (e) {
      console.log(`FAILED (${e.message})`);
    }
  }

  console.log(`\nDownloaded ${count} photos.`);
  console.log('Now syncing photos into demo uploads...');

  // Run sync
  require('./sync_photos.cjs');
}

main().catch(console.error);
