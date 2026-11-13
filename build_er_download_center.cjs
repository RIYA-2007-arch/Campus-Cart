// build_er_download_center.cjs
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'dfd-diagrams');
const ARTIFACT_DIR = 'C:\\Users\\shita\\.gemini\\antigravity\\brain\\bda58eda-eb11-4a37-896f-edd0f9ae8388';

const schemaPng = fs.readFileSync(path.join(OUT_DIR, 'ER_Diagram_Schema_CrowsFoot.png')).toString('base64');
const chenPng = fs.readFileSync(path.join(OUT_DIR, 'ER_Diagram_Conceptual_Chen.png')).toString('base64');

const schemaSvg = fs.readFileSync(path.join(OUT_DIR, 'ER_Diagram_Schema_CrowsFoot.svg'), 'utf8');
const chenSvg = fs.readFileSync(path.join(OUT_DIR, 'ER_Diagram_Conceptual_Chen.svg'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusCart — ER Diagram Download Studio</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .tab-btn.active { background-color: #0f172a; color: #ffffff; }
  </style>
</head>
<body class="bg-transparent text-[var(--foreground)] antialiased p-2 sm:p-4">
  <div class="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
    
    <!-- Header -->
    <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
            ✓ 2x Retina Ultra-Sharp
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
            Real CampusCart MySQL Schema
          </span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
          CampusCart — ER Diagrams (Schema &amp; Conceptual)
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Dono standard formats taiyaar hain: Crow's Foot (Tables + PK/FK) aur Chen Notation (Rectangles + Diamonds + Ovals).
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="downloadActivePng()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download Image (PNG)
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 p-2 gap-2 overflow-x-auto">
      <button onclick="switchTab(0)" id="tab-0" class="tab-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2">
        <span>1. Database Schema ER (Crow's Foot - PK/FK)</span>
      </button>
      <button onclick="switchTab(1)" id="tab-1" class="tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2">
        <span>2. Conceptual ER (Chen Notation - Diamonds &amp; Ovals)</span>
      </button>
    </div>

    <!-- Preview & Action Bar -->
    <div class="p-4 sm:p-6 space-y-4">
      
      <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div id="meta-text" class="font-medium text-slate-800 dark:text-slate-200"></div>
        <div class="flex items-center gap-2">
          <button onclick="copyToClipboard()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            <span id="copy-label">Copy to Word</span>
          </button>
          <button onclick="downloadActiveSvg()" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs border border-slate-300 dark:border-slate-600 transition">
            Download SVG
          </button>
        </div>
      </div>

      <!-- Preview Image -->
      <div class="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2 sm:p-4 bg-white flex justify-center items-center shadow-inner overflow-hidden">
        <img id="diagram-img" src="" alt="CampusCart ER Diagram" class="w-full max-h-[540px] object-contain rounded select-none">
      </div>

    </div>

  </div>

  <script>
    const list = [
      {
        title: "Database Schema ER Diagram (Crow's Foot)",
        desc: "Actual 8 CampusCart MySQL Tables (users, products, categories, cc_orders, cc_handover_otps, cc_wishlists, cc_product_reports, cc_chat_messages) with PK/FK & Cardinalities.",
        pngName: "CampusCart_ER_Schema_CrowsFoot.png",
        svgName: "CampusCart_ER_Schema_CrowsFoot.svg",
        base64: "data:image/png;base64,${schemaPng}",
        svgData: \`${schemaSvg.replace(/`/g, '\\`')}\`
      },
      {
        title: "Conceptual ER Diagram (Peter Chen Standard)",
        desc: "Classic university textbook ER style showing Entities (Rectangles), Relationships (Diamonds), Attributes (Ovals), and Underlined Primary Keys.",
        pngName: "CampusCart_ER_Conceptual_Chen.png",
        svgName: "CampusCart_ER_Conceptual_Chen.svg",
        base64: "data:image/png;base64,${chenPng}",
        svgData: \`${chenSvg.replace(/`/g, '\\`')}\`
      }
    ];

    let current = 0;

    function switchTab(idx) {
      current = idx;
      for (let i = 0; i < 2; i++) {
        const b = document.getElementById('tab-' + i);
        if (i === idx) {
          b.className = "tab-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2";
        } else {
          b.className = "tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2";
        }
      }
      const item = list[idx];
      document.getElementById('diagram-img').src = item.base64;
      document.getElementById('meta-text').innerHTML = '<strong>' + item.title + '</strong>: ' + item.desc;
      document.getElementById('copy-label').innerText = "Copy to Word";
    }

    function downloadActivePng() {
      const item = list[current];
      const a = document.createElement('a');
      a.href = item.base64;
      a.download = item.pngName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function downloadActiveSvg() {
      const item = list[current];
      const blob = new Blob([item.svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.svgName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    async function copyToClipboard() {
      const btn = document.getElementById('copy-label');
      try {
        const item = list[current];
        const res = await fetch(item.base64);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        btn.innerText = "✓ Copied! (Ctrl+V in Word)";
        setTimeout(() => { btn.innerText = "Copy to Word"; }, 2500);
      } catch (e) {
        downloadActivePng();
        btn.innerText = "Downloaded PNG";
        setTimeout(() => { btn.innerText = "Copy to Word"; }, 2500);
      }
    }

    switchTab(0);
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, 'er_download_center.html'), html, 'utf8');
fs.writeFileSync(path.join(ARTIFACT_DIR, 'er_download_center.html'), html, 'utf8');

console.log('✓ Built er_download_center.html!');
