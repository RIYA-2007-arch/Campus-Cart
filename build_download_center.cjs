// build_download_center.cjs
const fs = require('fs');
const path = require('path');

const DFD_DIR = path.join(__dirname, 'dfd-diagrams');
const ARTIFACT_DIR = 'C:\\Users\\shita\\.gemini\\antigravity\\brain\\bda58eda-eb11-4a37-896f-edd0f9ae8388';

const l0Png = fs.readFileSync(path.join(DFD_DIR, 'DFD_Level_0_Clear.png')).toString('base64');
const l1Png = fs.readFileSync(path.join(DFD_DIR, 'DFD_Level_1_Clear.png')).toString('base64');
const l2Png = fs.readFileSync(path.join(DFD_DIR, 'DFD_Level_2_Clear.png')).toString('base64');

const l0Svg = fs.readFileSync(path.join(DFD_DIR, 'DFD_Level_0_Clear.svg'), 'utf8');
const l1Svg = fs.readFileSync(path.join(DFD_DIR, 'DFD_Level_1_Clear.svg'), 'utf8');
const l2Svg = fs.readFileSync(path.join(DFD_DIR, 'DFD_Level_2_Clear.svg'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusCart — Ultra-Sharp DFD Download Studio</title>
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
            ✓ 100% Ultra-Clear Retina
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
            Word Report Format
          </span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
          CampusCart — DFD Diagrams (Level 0, 1, 2)
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Compact, high-contrast, bold typography. No blur, direct 1-click download.
        </p>
      </div>

      <!-- Quick Action Buttons -->
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
        <span>Level 0: Context Diagram</span>
      </button>
      <button onclick="switchTab(1)" id="tab-1" class="tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2">
        <span>Level 1: Major Processes</span>
      </button>
      <button onclick="switchTab(2)" id="tab-2" class="tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2">
        <span>Level 2: Order &amp; Handover OTP</span>
      </button>
    </div>

    <!-- Active Diagram Preview & Action Bar -->
    <div class="p-4 sm:p-6 space-y-4">
      
      <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div id="meta-text" class="font-medium text-slate-800 dark:text-slate-200">
          <!-- Text -->
        </div>
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
        <img id="diagram-img" src="" alt="CampusCart DFD Diagram" class="w-full max-h-[520px] object-contain rounded select-none">
      </div>

      <!-- Quick Guidance -->
      <div class="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
        <span>💡 <strong>Word me paste karein:</strong> Upar <strong>Download Image (PNG)</strong> dabayein aur Word file me <code>Insert -> Picture</code> kar dein, bilkul clear aur sharp aayega.</span>
      </div>

    </div>

  </div>

  <script>
    const list = [
      {
        title: "Level 0 — Context Diagram",
        desc: "High-level system boundary with Process 0.0 & 4 External Entities (Buyer, Seller, AI, Admin)",
        pngName: "CampusCart_DFD_Level_0_Clear.png",
        svgName: "CampusCart_DFD_Level_0_Clear.svg",
        base64: "data:image/png;base64,${l0Png}",
        svgData: \`${l0Svg.replace(/`/g, '\\`')}\`
      },
      {
        title: "Level 1 — Major Functional Processes",
        desc: "7 Process Modules (1.0 Auth, 2.0 Product, 3.0 Search, 4.0 Orders, 5.0 OTP Handover, 6.0 AI, 7.0 Admin) + 4 Stores",
        pngName: "CampusCart_DFD_Level_1_Clear.png",
        svgName: "CampusCart_DFD_Level_1_Clear.svg",
        base64: "data:image/png;base64,${l1Png}",
        svgData: \`${l1Svg.replace(/`/g, '\\`')}\`
      },
      {
        title: "Level 2 — Order & Handover OTP Engine",
        desc: "Deep-Dive of Process 4.0 & 5.0: In-Memory Dynamic UPI QR Generation & 6-Digit OTP Handover Flow",
        pngName: "CampusCart_DFD_Level_2_Clear.png",
        svgName: "CampusCart_DFD_Level_2_Clear.svg",
        base64: "data:image/png;base64,${l2Png}",
        svgData: \`${l2Svg.replace(/`/g, '\\`')}\`
      }
    ];

    let current = 0;

    function switchTab(idx) {
      current = idx;
      for (let i = 0; i < 3; i++) {
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

fs.writeFileSync(path.join(DFD_DIR, 'dfd_download_center.html'), html, 'utf8');
fs.writeFileSync(path.join(ARTIFACT_DIR, 'dfd_download_center.html'), html, 'utf8');

console.log('✓ Updated dfd_download_center.html with Ultra-Sharp images!');
