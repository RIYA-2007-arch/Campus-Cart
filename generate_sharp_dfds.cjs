// generate_sharp_dfds.cjs
// Generates Short, Compact, High-Contrast, Crystal-Clear DFD Diagrams (Level 0, 1, 2)
// Specifically optimized for Word/Google Docs project reports:
// - Compact dimensions (1000-1100px width)
// - Bold, high-legibility fonts (14-18px bold text)
// - Ultra sharp 2x Retina PNG screenshots via Chrome headless (zero blur)

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DFD_DIR = path.join(__dirname, 'dfd-diagrams');
const ARTIFACT_DIR = 'C:\\Users\\shita\\.gemini\\antigravity\\brain\\bda58eda-eb11-4a37-896f-edd0f9ae8388';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(DFD_DIR)) {
  fs.mkdirSync(DFD_DIR, { recursive: true });
}

// Crisp styling template
function getSvgWrapper(w, h, title, subtitle, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <style>
      * { font-family: 'Segoe UI', Arial, sans-serif; }
      .bg { fill: #ffffff; }
      .border-box { stroke: #0f172a; stroke-width: 2.2; fill: none; }
      
      /* Entities */
      .ent-rect { fill: #f8fafc; stroke: #0f172a; stroke-width: 2.2; rx: 6; ry: 6; }
      .ent-head { fill: #e2e8f0; stroke: #0f172a; stroke-width: 2; }
      .ent-title { font-size: 15px; font-weight: bold; fill: #0f172a; text-anchor: middle; }
      .ent-sub { font-size: 12px; fill: #334155; text-anchor: middle; font-weight: 500; }
      
      /* Processes */
      .proc-box { fill: #ffffff; stroke: #0f172a; stroke-width: 2.4; rx: 16; ry: 16; }
      .proc-head { fill: #f1f5f9; stroke: #0f172a; stroke-width: 2; }
      .proc-id { font-size: 14px; font-weight: bold; fill: #0f172a; text-anchor: middle; }
      .proc-name { font-size: 14px; font-weight: bold; fill: #0f172a; text-anchor: middle; }
      .proc-desc { font-size: 12px; fill: #475569; text-anchor: middle; }

      /* Data Stores */
      .store-line { stroke: #0f172a; stroke-width: 2.2; }
      .store-id-bg { fill: #e2e8f0; stroke: #0f172a; stroke-width: 1.8; }
      .store-id-txt { font-size: 13px; font-weight: bold; fill: #0f172a; text-anchor: middle; font-family: monospace; }
      .store-name-txt { font-size: 13px; font-weight: bold; fill: #0f172a; text-anchor: start; }

      /* Arrows & Labels */
      .arrow-line { stroke: #0f172a; stroke-width: 2.2; fill: none; }
      .lbl-box { fill: #ffffff; stroke: #64748b; stroke-width: 1; rx: 4; ry: 4; }
      .lbl-txt { font-size: 12.5px; font-weight: bold; fill: #0f172a; text-anchor: middle; }
    </style>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0f172a" />
    </marker>
  </defs>

  <!-- Canvas Background -->
  <rect width="${w}" height="${h}" class="bg"/>

  <!-- Outer Formal Border -->
  <rect x="15" y="15" width="${w - 30}" height="${h - 30}" class="border-box"/>
  <rect x="20" y="20" width="${w - 40}" height="${h - 40}" stroke="#94a3b8" stroke-width="0.8" fill="none"/>

  <!-- Header Banner -->
  <rect x="30" y="30" width="${w - 60}" height="55" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" rx="4"/>
  <text x="${w / 2}" y="55" font-size="18px" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="0.5px">CAMPUSCART — ${title.toUpperCase()}</text>
  <text x="${w / 2}" y="74" font-size="12.5px" fill="#475569" text-anchor="middle">${subtitle}</text>

  <!-- Diagram Content -->
  ${content}

  <!-- Footer -->
  <rect x="30" y="${h - 45}" width="${w - 60}" height="30" fill="#f8fafc" stroke="#0f172a" stroke-width="1.2" rx="4"/>
  <text x="45" y="${h - 26}" font-size="12px" font-weight="bold" fill="#0f172a">CampusCart Project Report</text>
  <text x="${w / 2}" y="${h - 26}" font-size="11.5px" fill="#475569" text-anchor="middle">Standard: Gane-Sarson / IEEE Academic Specification</text>
  <text x="${w - 45}" y="${h - 26}" font-size="12px" font-weight="bold" fill="#0f172a" text-anchor="end">${title}</text>
</svg>`;
}

// -------------------------------------------------------------
// 1. CLEAR & COMPACT LEVEL 0 (CONTEXT DIAGRAM)
// -------------------------------------------------------------
function getLevel0Svg() {
  const w = 1000;
  const h = 680;
  const cx = 500;
  const cy = 340;

  const content = `
  <!-- CENTER PROCESS: 0.0 CAMPUSCART SYSTEM -->
  <g id="proc-main">
    <rect x="${cx - 130}" y="${cy - 75}" width="260" height="150" class="proc-box" stroke-width="2.6"/>
    <rect x="${cx - 130}" y="${cy - 75}" width="260" height="38" rx="16" ry="16" class="proc-head"/>
    <rect x="${cx - 130}" y="${cy - 52}" width="260" height="15" fill="#f1f5f9" stroke="none"/>
    <line x1="${cx - 130}" y1="${cy - 37}" x2="${cx + 130}" y2="${cy - 37}" stroke="#0f172a" stroke-width="1.8"/>
    <text x="${cx}" y="${cy - 50}" class="proc-id">0.0</text>
    <text x="${cx}" y="${cy - 8}" class="proc-name" font-size="17px">CAMPUSCART SYSTEM</text>
    <text x="${cx}" y="${cy + 22}" class="proc-desc" font-size="13px">Peer-to-Peer Campus Marketplace</text>
    <text x="${cx}" y="${cy + 42}" class="proc-desc" font-size="12px">&amp; Dynamic OTP Handover Engine</text>
  </g>

  <!-- ENTITY 1: BUYER (STUDENT) [LEFT] -->
  <g id="ent-buyer">
    <rect x="45" y="${cy - 80}" width="190" height="160" class="ent-rect"/>
    <rect x="45" y="${cy - 80}" width="190" height="36" rx="6" ry="6" class="ent-head"/>
    <rect x="45" y="${cy - 60}" width="190" height="16" fill="#e2e8f0" stroke="none"/>
    <line x1="45" y1="${cy - 44}" x2="235" y2="${cy - 44}" stroke="#0f172a" stroke-width="1.5"/>
    <text x="140" y="${cy - 57}" class="ent-title">BUYER (STUDENT)</text>
    <text x="140" y="${cy - 18}" class="ent-sub">• Search &amp; Filter Items</text>
    <text x="140" y="${cy + 7}" class="ent-sub">• Place Order &amp; Pay</text>
    <text x="140" y="${cy + 32}" class="ent-sub">• Inspect &amp; Share OTP</text>
    <text x="140" y="${cy + 57}" class="ent-sub">• Chat with CartMate AI</text>
  </g>

  <!-- ENTITY 2: SELLER (STUDENT) [RIGHT] -->
  <g id="ent-seller">
    <rect x="765" y="${cy - 80}" width="190" height="160" class="ent-rect"/>
    <rect x="765" y="${cy - 80}" width="190" height="36" rx="6" ry="6" class="ent-head"/>
    <rect x="765" y="${cy - 60}" width="190" height="16" fill="#e2e8f0" stroke="none"/>
    <line x1="765" y1="${cy - 44}" x2="955" y2="${cy - 44}" stroke="#0f172a" stroke-width="1.5"/>
    <text x="860" y="${cy - 57}" class="ent-title">SELLER (STUDENT)</text>
    <text x="860" y="${cy - 18}" class="ent-sub">• List Used Study Items</text>
    <text x="860" y="${cy + 7}" class="ent-sub">• Receive Order Alert</text>
    <text x="860" y="${cy + 32}" class="ent-sub">• Handover Item at Meetup</text>
    <text x="860" y="${cy + 57}" class="ent-sub">• Input OTP to Mark SOLD</text>
  </g>

  <!-- ENTITY 3: CARTMATE AI (TOP) -->
  <g id="ent-ai">
    <rect x="360" y="105" width="280" height="90" class="ent-rect"/>
    <rect x="360" y="105" width="280" height="30" rx="6" ry="6" class="ent-head"/>
    <rect x="360" y="120" width="280" height="15" fill="#e2e8f0" stroke="none"/>
    <line x1="360" y1="135" x2="640" y2="135" stroke="#0f172a" stroke-width="1.5"/>
    <text x="500" y="126" class="ent-title">CARTMATE AI (GEMINI 2.5)</text>
    <text x="500" y="157" class="ent-sub">• Intelligent Syllabus Matching</text>
    <text x="500" y="177" class="ent-sub">• Real-Time Inventory Recommendations</text>
  </g>

  <!-- ENTITY 4: ADMINISTRATOR (BOTTOM) -->
  <g id="ent-admin">
    <rect x="360" y="485" width="280" height="90" class="ent-rect"/>
    <rect x="360" y="485" width="280" height="30" rx="6" ry="6" class="ent-head"/>
    <rect x="360" y="500" width="280" height="15" fill="#e2e8f0" stroke="none"/>
    <line x1="360" y1="515" x2="640" y2="515" stroke="#0f172a" stroke-width="1.5"/>
    <text x="500" y="506" class="ent-title">SYSTEM ADMINISTRATOR</text>
    <text x="500" y="537" class="ent-sub">• Listing Moderation &amp; Policy Control</text>
    <text x="500" y="557" class="ent-sub">• Safety Flags &amp; Audit Logs</text>
  </g>

  <!-- ================= ARROWS & BOLD LABELS ================= -->
  <!-- Buyer -> System (Top: Credentials & Search) -->
  <path d="M 235 290 Q 300 270 370 290" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="250" y="258" width="165" height="24" class="lbl-box"/>
  <text x="332" y="275" class="lbl-txt">1. Login &amp; Search Queries</text>

  <!-- Buyer -> System (Middle: Order & OTP) -->
  <path d="M 235 340 L 370 340" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="245" y="328" width="175" height="24" class="lbl-box"/>
  <text x="332" y="345" class="lbl-txt">2. Order Request &amp; Meetup OTP</text>

  <!-- System -> Buyer (Bottom: Catalog & UPI QR) -->
  <path d="M 370 390 Q 300 410 235 390" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="245" y="398" width="175" height="24" class="lbl-box"/>
  <text x="332" y="415" class="lbl-txt">3. Dynamic UPI QR &amp; OTP</text>

  <!-- Seller -> System (Top: Item Details) -->
  <path d="M 765 290 Q 700 270 630 290" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="635" y="258" width="160" height="24" class="lbl-box"/>
  <text x="715" y="275" class="lbl-txt">4. Product Listing &amp; Price</text>

  <!-- Seller -> System (Middle: Submit OTP) -->
  <path d="M 765 340 L 630 340" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="640" y="328" width="150" height="24" class="lbl-box"/>
  <text x="715" y="345" class="lbl-txt">5. Verify Buyer's OTP</text>

  <!-- System -> Seller (Bottom: Order Alert) -->
  <path d="M 630 390 Q 700 410 765 390" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="635" y="398" width="160" height="24" class="lbl-box"/>
  <text x="715" y="415" class="lbl-txt">6. Order Alert &amp; SOLD State</text>

  <!-- AI <-> System -->
  <path d="M 460 265 L 460 195" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="365" y="215" width="90" height="24" class="lbl-box"/>
  <text x="410" y="232" class="lbl-txt">User Query</text>

  <path d="M 540 195 L 540 265" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="545" y="215" width="105" height="24" class="lbl-box"/>
  <text x="597" y="232" class="lbl-txt">Catalog Match</text>

  <!-- Admin <-> System -->
  <path d="M 460 485 L 460 415" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="375" y="440" width="80" height="24" class="lbl-box"/>
  <text x="415" y="457" class="lbl-txt">Policy Fix</text>

  <path d="M 540 415 L 540 485" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="545" y="440" width="95" height="24" class="lbl-box"/>
  <text x="592" y="457" class="lbl-txt">Audit Reports</text>
  `;

  return getSvgWrapper(w, h, 'Level 0 — Context Diagram', 'Single Central System Boundary & High-Level Entity Interactions', content);
}

// -------------------------------------------------------------
// 2. CLEAR & COMPACT LEVEL 1 (MAJOR PROCESSES DIAGRAM)
// -------------------------------------------------------------
function getLevel1Svg() {
  const w = 1080;
  const h = 780;

  function proc(id, num, name, x, y, pw = 195, ph = 70) {
    return `
    <g id="${id}">
      <rect x="${x}" y="${y}" width="${pw}" height="${ph}" class="proc-box"/>
      <rect x="${x}" y="${y}" width="${pw}" height="24" rx="14" ry="14" class="proc-head"/>
      <rect x="${x}" y="${y + 12}" width="${pw}" height="12" fill="#f1f5f9" stroke="none"/>
      <line x1="${x}" y1="${y + 24}" x2="${x + pw}" y2="${y + 24}" stroke="#0f172a" stroke-width="1.8"/>
      <text x="${x + pw / 2}" y="${y + 17}" class="proc-id">${num}</text>
      <text x="${x + pw / 2}" y="${y + 48}" class="proc-name" font-size="13px">${name}</text>
    </g>`;
  }

  function store(id, code, name, x, y, sw = 200, sh = 42) {
    return `
    <g id="${id}">
      <line x1="${x}" y1="${y}" x2="${x + sw}" y2="${y}" class="store-line"/>
      <line x1="${x}" y1="${y + sh}" x2="${x + sw}" y2="${y + sh}" class="store-line"/>
      <rect x="${x}" y="${y}" width="42" height="${sh}" class="store-id-bg"/>
      <text x="${x + 21}" y="${y + 26}" class="store-id-txt">${code}</text>
      <rect x="${x + 42}" y="${y + 1}" width="${sw - 42}" height="${sh - 2}" fill="#ffffff"/>
      <text x="${x + 55}" y="${y + 26}" class="store-name-txt">${name}</text>
    </g>`;
  }

  const content = `
  <!-- ENTITIES -->
  <!-- Buyer (Left) -->
  <g id="ent-b1">
    <rect x="35" y="240" width="130" height="150" class="ent-rect"/>
    <rect x="35" y="240" width="130" height="30" rx="6" ry="6" class="ent-head"/>
    <line x1="35" y1="270" x2="165" y2="270" stroke="#0f172a" stroke-width="1.5"/>
    <text x="100" y="261" class="ent-title" font-size="13px">BUYER</text>
    <text x="100" y="295" class="ent-sub">• Search Items</text>
    <text x="100" y="320" class="ent-sub">• Place Order</text>
    <text x="100" y="345" class="ent-sub">• Pay UPI / Cash</text>
    <text x="100" y="370" class="ent-sub">• Handover OTP</text>
  </g>

  <!-- Seller (Right) -->
  <g id="ent-s1">
    <rect x="915" y="240" width="130" height="150" class="ent-rect"/>
    <rect x="915" y="240" width="130" height="30" rx="6" ry="6" class="ent-head"/>
    <line x1="915" y1="270" x2="1045" y2="270" stroke="#0f172a" stroke-width="1.5"/>
    <text x="980" y="261" class="ent-title" font-size="13px">SELLER</text>
    <text x="980" y="295" class="ent-sub">• Post Listings</text>
    <text x="980" y="320" class="ent-sub">• Order Alerts</text>
    <text x="980" y="345" class="ent-sub">• Handover Item</text>
    <text x="980" y="370" class="ent-sub">• Submit OTP</text>
  </g>

  <!-- PROCESSES -->
  ${proc('p1', '1.0', 'User Auth & Profile', 210, 110)}
  ${proc('p2', '2.0', 'Product Catalog', 670, 110)}
  ${proc('p3', '3.0', 'Search & Browse', 210, 270)}
  ${proc('p4', '4.0', 'Order & UPI QR Engine', 210, 430)}
  ${proc('p5', '5.0', 'Handover & OTP Engine', 670, 430)}
  ${proc('p6', '6.0', 'CartMate AI Assistant', 670, 270)}
  ${proc('p7', '7.0', 'Admin Safety Moderation', 440, 610)}

  <!-- DATA STORES -->
  ${store('st1', 'D1', 'Users (MySQL)', 440, 125)}
  ${store('st2', 'D2', 'Products (MySQL)', 440, 285)}
  ${store('st3', 'D3', 'Orders (MySQL)', 440, 415)}
  ${store('st4', 'D4', 'Handover OTPs', 440, 485)}

  <!-- ARROWS & LABELS -->
  <!-- Buyer -> 1.0 Auth -->
  <path d="M 100 240 L 100 145 L 210 145" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="115" y="133" width="85" height="24" class="lbl-box"/>
  <text x="157" y="150" class="lbl-txt">Login Info</text>

  <!-- 1.0 Auth <-> D1 -->
  <path d="M 405 145 L 440 145" class="arrow-line" marker-end="url(#arr)"/>

  <!-- Seller -> 2.0 Product -->
  <path d="M 980 240 L 980 145 L 865 145" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="880" y="133" width="90" height="24" class="lbl-box"/>
  <text x="925" y="150" class="lbl-txt">Listing Data</text>

  <!-- 2.0 Product -> D2 -->
  <path d="M 670 145 L 590 145 L 590 285" class="arrow-line" marker-end="url(#arr)"/>

  <!-- Buyer -> 3.0 Search -->
  <path d="M 165 305 L 210 305" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="168" y="293" width="40" height="24" class="lbl-box"/>
  <text x="188" y="310" class="lbl-txt">Query</text>

  <!-- D2 -> 3.0 Search -->
  <path d="M 440 305 L 405 305" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 3.0 Search -> Buyer -->
  <path d="M 210 335 L 165 335" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="168" y="323" width="40" height="24" class="lbl-box"/>
  <text x="188" y="340" class="lbl-txt">Items</text>

  <!-- Buyer -> 4.0 Orders -->
  <path d="M 100 390 L 100 465 L 210 465" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="110" y="453" width="90" height="24" class="lbl-box"/>
  <text x="155" y="470" class="lbl-txt">Order Request</text>

  <!-- 4.0 Orders -> D3 Orders -->
  <path d="M 405 445 L 440 445" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 4.0 Orders -> D4 OTPs -->
  <path d="M 310 500 L 310 505 L 440 505" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="325" y="493" width="95" height="24" class="lbl-box"/>
  <text x="372" y="510" class="lbl-txt">Save 6-Dig OTP</text>

  <!-- 4.0 Orders -> Buyer (UPI QR) -->
  <path d="M 210 485 L 140 485 L 140 390" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="145" y="430" width="60" height="24" class="lbl-box"/>
  <text x="175" y="447" class="lbl-txt">UPI QR</text>

  <!-- Seller -> 5.0 Handover OTP -->
  <path d="M 980 390 L 980 465 L 865 465" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="880" y="453" width="90" height="24" class="lbl-box"/>
  <text x="925" y="470" class="lbl-txt">Submit OTP</text>

  <!-- 5.0 Handover <-> D4 OTP -->
  <path d="M 670 475 L 640 475 L 640 505" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 5.0 Handover -> D2 & D3 (Mark SOLD) -->
  <path d="M 770 430 L 770 370 L 640 370" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="670" y="358" width="100" height="24" class="lbl-box"/>
  <text x="720" y="375" class="lbl-txt">Set Item SOLD</text>

  <!-- 6.0 AI -> D2 Product Catalog -->
  <path d="M 670 305 L 640 305" class="arrow-line" marker-end="url(#arr)"/>

  <!-- Admin -> 7.0 Moderation -->
  <rect x="235" y="620" width="120" height="50" class="ent-rect"/>
  <text x="295" y="650" class="ent-title" font-size="13px">ADMIN</text>
  <path d="M 355 645 L 440 645" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="365" y="633" width="70" height="24" class="lbl-box"/>
  <text x="400" y="650" class="lbl-txt">Policies</text>
  `;

  return getSvgWrapper(w, h, 'Level 1 — Major Functional Processes', '7 Functional Process Modules & 4 Central Data Stores', content);
}

// -------------------------------------------------------------
// 3. CLEAR & COMPACT LEVEL 2 (ORDER & HANDOVER OTP ENGINE)
// -------------------------------------------------------------
function getLevel2Svg() {
  const w = 1040;
  const h = 700;

  function proc(id, num, name, x, y, pw = 190, ph = 65) {
    return `
    <g id="${id}">
      <rect x="${x}" y="${y}" width="${pw}" height="${ph}" class="proc-box"/>
      <rect x="${x}" y="${y}" width="${pw}" height="22" rx="14" ry="14" class="proc-head"/>
      <rect x="${x}" y="${y + 11}" width="${pw}" height="11" fill="#f1f5f9" stroke="none"/>
      <line x1="${x}" y1="${y + 22}" x2="${x + pw}" y2="${y + 22}" stroke="#0f172a" stroke-width="1.8"/>
      <text x="${x + pw / 2}" y="${y + 16}" class="proc-id">${num}</text>
      <text x="${x + pw / 2}" y="${y + 45}" class="proc-name" font-size="12.5px">${name}</text>
    </g>`;
  }

  function store(id, code, name, x, y, sw = 180, sh = 40) {
    return `
    <g id="${id}">
      <line x1="${x}" y1="${y}" x2="${x + sw}" y2="${y}" class="store-line"/>
      <line x1="${x}" y1="${y + sh}" x2="${x + sw}" y2="${y + sh}" class="store-line"/>
      <rect x="${x}" y="${y}" width="40" height="${sh}" class="store-id-bg"/>
      <text x="${x + 20}" y="${y + 25}" class="store-id-txt">${code}</text>
      <rect x="${x + 40}" y="${y + 1}" width="${sw - 40}" height="${sh - 2}" fill="#ffffff"/>
      <text x="${x + 50}" y="${y + 25}" class="store-name-txt">${name}</text>
    </g>`;
  }

  const content = `
  <!-- ENTITIES -->
  <!-- Buyer -->
  <g id="ent-b2">
    <rect x="40" y="230" width="130" height="180" class="ent-rect"/>
    <rect x="40" y="230" width="130" height="32" rx="6" ry="6" class="ent-head"/>
    <line x1="40" y1="262" x2="170" y2="262" stroke="#0f172a" stroke-width="1.5"/>
    <text x="105" y="252" class="ent-title">BUYER</text>
    <text x="105" y="285" class="ent-sub">1. Select Product</text>
    <text x="105" y="315" class="ent-sub">2. Scan UPI QR</text>
    <text x="105" y="345" class="ent-sub">3. Inspect Goods</text>
    <text x="105" y="375" class="ent-sub">4. Share OTP</text>
  </g>

  <!-- Seller -->
  <g id="ent-s2">
    <rect x="870" y="230" width="130" height="180" class="ent-rect"/>
    <rect x="870" y="230" width="130" height="32" rx="6" ry="6" class="ent-head"/>
    <line x1="870" y1="262" x2="1000" y2="262" stroke="#0f172a" stroke-width="1.5"/>
    <text x="935" y="252" class="ent-title">SELLER</text>
    <text x="935" y="285" class="ent-sub">1. Receive Alert</text>
    <text x="935" y="315" class="ent-sub">2. Campus Meetup</text>
    <text x="935" y="345" class="ent-sub">3. Take Buyer OTP</text>
    <text x="935" y="375" class="ent-sub">4. Complete Sale</text>
  </g>

  <!-- SUB-PROCESSES (LEFT: 4.x ORDER PLACEMENT) -->
  ${proc('p41', '4.1', 'Check Availability', 230, 140)}
  ${proc('p42', '4.2', 'Generate Dynamic UPI QR', 230, 275)}
  ${proc('p43', '4.3', 'Generate 6-Digit OTP', 230, 410)}

  <!-- SUB-PROCESSES (RIGHT: 5.x HANDOVER OTP) -->
  ${proc('p51', '5.1', 'Receive Meetup OTP', 650, 275)}
  ${proc('p52', '5.2', 'Verify Cryptographic OTP', 650, 410)}
  ${proc('p53', '5.3', 'Atomic State: SOLD', 650, 545)}

  <!-- DATA STORES (CENTER) -->
  ${store('st-p', 'D2', 'Products Store', 450, 152)}
  ${store('st-o', 'D3', 'Orders Store', 450, 287)}
  ${store('st-h', 'D4', 'Handover OTPs', 450, 422)}

  <!-- ARROWS & FLOWS -->
  <!-- Buyer -> 4.1 -->
  <path d="M 170 240 L 230 175" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="175" y="195" width="60" height="24" class="lbl-box"/>
  <text x="205" y="212" class="lbl-txt">Select</text>

  <!-- 4.1 <-> D2 -->
  <path d="M 420 172 L 450 172" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 4.1 -> 4.2 -->
  <path d="M 325 205 L 325 275" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="290" y="230" width="70" height="24" class="lbl-box"/>
  <text x="325" y="247" class="lbl-txt">Available</text>

  <!-- 4.2 -> D3 -->
  <path d="M 420 307 L 450 307" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 4.2 -> Buyer (UPI QR) -->
  <path d="M 230 310 L 170 310" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="175" y="298" width="50" height="24" class="lbl-box"/>
  <text x="200" y="315" class="lbl-txt">UPI QR</text>

  <!-- 4.2 -> 4.3 -->
  <path d="M 325 340 L 325 410" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 4.3 -> D4 OTPs -->
  <path d="M 420 442 L 450 442" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 4.3 -> Buyer (6-Digit OTP) -->
  <path d="M 230 440 L 140 440 L 140 410" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="150" y="428" width="75" height="24" class="lbl-box"/>
  <text x="187" y="445" class="lbl-txt">6-Digit OTP</text>

  <!-- Physical Meetup Visual Indicator -->
  <rect x="445" y="500" width="190" height="60" rx="8" ry="8" fill="#f8fafc" stroke="#475569" stroke-dasharray="4,3" stroke-width="1.5"/>
  <text x="540" y="525" font-size="12px" font-weight="bold" fill="#0f172a" text-anchor="middle">Physical Meetup</text>
  <text x="540" y="545" font-size="11px" fill="#475569" text-anchor="middle">Buyer shares OTP on delivery</text>

  <!-- Seller -> 5.1 Enter OTP -->
  <path d="M 870 310 L 840 310" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="842" y="298" width="55" height="24" class="lbl-box"/>
  <text x="870" y="315" class="lbl-txt">Type OTP</text>

  <!-- 5.1 -> 5.2 -->
  <path d="M 745 340 L 745 410" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 5.2 <-> D4 OTP -->
  <path d="M 650 442 L 630 442" class="arrow-line" marker-end="url(#arr)"/>

  <!-- 5.2 -> 5.3 -->
  <path d="M 745 475 L 745 545" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="710" y="500" width="70" height="24" class="lbl-box"/>
  <text x="745" y="517" class="lbl-txt">OTP Valid</text>

  <!-- 5.3 -> D2 & D3 (Mark SOLD) -->
  <path d="M 650 577 L 540 577 L 540 327" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="545" y="370" width="100" height="24" class="lbl-box"/>
  <text x="595" y="387" class="lbl-txt">Mark Item SOLD</text>

  <!-- 5.3 -> Seller (Sale Complete) -->
  <path d="M 840 577 L 935 577 L 935 410" class="arrow-line" marker-end="url(#arr)"/>
  <rect x="850" y="565" width="85" height="24" class="lbl-box"/>
  <text x="892" y="582" class="lbl-txt">Sale Success</text>
  `;

  return getSvgWrapper(w, h, 'Level 2 — Order & Handover OTP Decomposition', 'Sub-Process Flow: In-Memory UPI QR Generation & Secure OTP Handover', content);
}

// Generate the 3 SVGs
const s0 = getLevel0Svg();
const s1 = getLevel1Svg();
const s2 = getLevel2Svg();

fs.writeFileSync(path.join(DFD_DIR, 'DFD_Level_0_Clear.svg'), s0, 'utf8');
fs.writeFileSync(path.join(DFD_DIR, 'DFD_Level_1_Clear.svg'), s1, 'utf8');
fs.writeFileSync(path.join(DFD_DIR, 'DFD_Level_2_Clear.svg'), s2, 'utf8');

console.log('✓ Wrote 3 Sharp SVGs');

// Render Retina PNGs with Chrome headless (--force-device-scale-factor=2 for razor-sharp text)
const list = [
  { name: 'DFD_Level_0_Clear', svg: s0, w: 1000, h: 680 },
  { name: 'DFD_Level_1_Clear', svg: s1, w: 1080, h: 780 },
  { name: 'DFD_Level_2_Clear', svg: s2, w: 1040, h: 700 },
];

list.forEach(item => {
  const htmlPath = path.join(DFD_DIR, `${item.name}.html`);
  const pngPath = path.join(DFD_DIR, `${item.name}.png`);
  const artifactPng = path.join(ARTIFACT_DIR, `${item.name}.png`);

  const page = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #ffffff; overflow: hidden; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${item.svg}
</body>
</html>`;

  fs.writeFileSync(htmlPath, page, 'utf8');

  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--force-device-scale-factor=2',
      `--window-size=${item.w},${item.h}`,
      `--screenshot=${pngPath}`,
      htmlPath,
    ], { stdio: 'ignore' });

    fs.copyFileSync(pngPath, artifactPng);
    console.log(`✓ Rendered Ultra-Sharp PNG: ${item.name}.png (${fs.statSync(pngPath).size} bytes)`);
  } catch (err) {
    console.error(`Error rendering ${item.name}:`, err.message);
  }
});

console.log('ALL SHARP DFDs READY!');
