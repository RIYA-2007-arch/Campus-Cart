// generate_formal_dfds.cjs
// Generates Formal, Textbook-Standard DFD Level 0, Level 1, Level 2 diagrams
// Adhering strictly to Gane-Sarson / IEEE software engineering academic report standards.
// Typography: 12pt flow labels, clean balanced geometry, zero clutter.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, 'dfd-diagrams');
const ARTIFACT_DIR = 'C:\\Users\\shita\\.gemini\\antigravity\\brain\\bda58eda-eb11-4a37-896f-edd0f9ae8388';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Common styles for academic DFD
const COMMON_STYLE = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
      * { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; }
      .bg { fill: #ffffff; }
      .border-academic { stroke: #000000; stroke-width: 2; fill: none; }
      .title-main { font-size: 16pt; font-weight: bold; fill: #000000; text-anchor: middle; letter-spacing: 0.5px; }
      .title-sub { font-size: 12pt; font-weight: normal; fill: #333333; text-anchor: middle; }
      
      /* External Entities (Rectangles) */
      .entity-rect { fill: #f8fafc; stroke: #000000; stroke-width: 2; }
      .entity-text { font-size: 12pt; font-weight: bold; fill: #000000; text-anchor: middle; }
      .entity-subtext { font-size: 10pt; font-style: italic; fill: #475569; text-anchor: middle; }

      /* Processes (Rounded Rectangles / Circles) */
      .proc-shape { fill: #ffffff; stroke: #000000; stroke-width: 2; }
      .proc-num { font-size: 12pt; font-weight: bold; fill: #000000; text-anchor: middle; }
      .proc-title { font-size: 12pt; font-weight: bold; fill: #000000; text-anchor: middle; }
      .proc-divider { stroke: #000000; stroke-width: 1.5; }

      /* Data Stores (Open-ended parallel lines) */
      .store-rect { fill: #fdfdfd; stroke: #000000; stroke-width: 1.8; }
      .store-id-box { fill: #f1f5f9; stroke: #000000; stroke-width: 1.5; }
      .store-id-text { font-size: 12pt; font-weight: bold; fill: #000000; text-anchor: middle; font-family: 'Courier New', monospace; }
      .store-name-text { font-size: 12pt; font-weight: bold; fill: #000000; text-anchor: start; }

      /* Data Flow Arrows & 12pt Labels */
      .flow-arrow { stroke: #000000; stroke-width: 1.6; fill: none; }
      .label-bg { fill: #ffffff; stroke: #d1d5db; stroke-width: 0.8; rx: 4; ry: 4; }
      .label-text { font-size: 12pt; fill: #000000; font-weight: 600; text-anchor: middle; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#000000" />
    </marker>
  </defs>
`;

function getHeader(width, height, title, subtitle, levelText) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${COMMON_STYLE}
  <!-- Canvas Background -->
  <rect width="${width}" height="${height}" class="bg"/>

  <!-- Academic Standard Border -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" class="border-academic"/>
  <rect x="25" y="25" width="${width - 50}" height="${height - 50}" stroke="#000000" stroke-width="0.8" fill="none"/>

  <!-- Academic Header -->
  <rect x="35" y="35" width="${width - 70}" height="65" fill="#f8fafc" stroke="#000000" stroke-width="1.5"/>
  <text x="${width / 2}" y="65" class="title-main">CAMPUSCART SYSTEM — ${title.toUpperCase()}</text>
  <text x="${width / 2}" y="88" class="title-sub">${subtitle} | Formal Standard (12pt Font Layout)</text>
`;
}

function getFooter(width, height, levelText) {
  return `
  <!-- Academic Bottom Footer -->
  <rect x="35" y="${height - 55}" width="${width - 70}" height="35" fill="#f8fafc" stroke="#000000" stroke-width="1.2"/>
  <text x="50" y="${height - 33}" font-size="11pt" font-weight="bold" fill="#000000">Project: CampusCart</text>
  <text x="${width / 2}" y="${height - 33}" font-size="11pt" fill="#000000" text-anchor: "middle" text-anchor="middle">Standard: Gane-Sarson / IEEE Software Engineering Notation</text>
  <text x="${width - 50}" y="${height - 33}" font-size="11pt" font-weight="bold" fill="#000000" text-anchor="end">${levelText}</text>
</svg>`;
}

// -------------------------------------------------------------
// 1. DFD LEVEL 0 (CONTEXT DIAGRAM)
// -------------------------------------------------------------
function buildLevel0() {
  const W = 1600;
  const H = 1050;
  let svg = getHeader(W, H, 'Data Flow Diagram — Level 0 (Context Diagram)', 'High-Level Boundary & External Entity Interface', 'Level 0 Context Diagram');

  // Center Process (0.0 CampusCart System)
  const cx = 800;
  const cy = 520;

  svg += `
  <!-- ================= PROCESS 0.0 (CAMPUSCART SYSTEM) ================= -->
  <g id="proc-0">
    <rect x="${cx - 150}" y="${cy - 90}" width="300" height="180" rx="20" ry="20" class="proc-shape" stroke-width="2.5"/>
    <rect x="${cx - 150}" y="${cy - 90}" width="300" height="45" rx="20" ry="20" fill="#f1f5f9" stroke="#000000" stroke-width="2"/>
    <rect x="${cx - 150}" y="${cy - 65}" width="300" height="20" fill="#f1f5f9" stroke="none"/>
    <line x1="${cx - 150}" y1="${cy - 45}" x2="${cx + 150}" y2="${cy - 45}" class="proc-divider"/>
    <text x="${cx}" y="${cy - 60}" class="proc-num">0.0</text>
    <text x="${cx}" y="${cy - 10}" class="proc-title" font-size="14pt">CAMPUSCART SYSTEM</text>
    <text x="${cx}" y="${cy + 22}" class="title-sub" font-size="11pt">Peer-to-Peer Campus Marketplace</text>
    <text x="${cx}" y="${cy + 45}" class="title-sub" font-size="11pt">&amp; Secure OTP Handover Engine</text>
  </g>

  <!-- ================= EXTERNAL ENTITY 1: BUYER (STUDENT) [LEFT] ================= -->
  <g id="entity-buyer">
    <rect x="70" y="420" width="220" height="200" class="entity-rect"/>
    <rect x="70" y="420" width="220" height="45" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="180" y="448" class="entity-text">BUYER (STUDENT)</text>
    <text x="180" y="495" class="entity-subtext">[External Entity]</text>
    <text x="180" y="530" font-size="11pt" fill="#1e293b" text-anchor="middle">• Registered Student</text>
    <text x="180" y="555" font-size="11pt" fill="#1e293b" text-anchor="middle">• Browse &amp; Purchase</text>
    <text x="180" y="580" font-size="11pt" fill="#1e293b" text-anchor="middle">• Collects via Handover OTP</text>
  </g>

  <!-- ================= EXTERNAL ENTITY 2: SELLER (STUDENT) [RIGHT] ================= -->
  <g id="entity-seller">
    <rect x="1310" y="420" width="220" height="200" class="entity-rect"/>
    <rect x="1310" y="420" width="220" height="45" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="1420" y="448" class="entity-text">SELLER (STUDENT)</text>
    <text x="1420" y="495" class="entity-subtext">[External Entity]</text>
    <text x="1420" y="530" font-size="11pt" fill="#1e293b" text-anchor="middle">• Verified Campus Student</text>
    <text x="1420" y="555" font-size="11pt" fill="#1e293b" text-anchor="middle">• Lists Used Study Items</text>
    <text x="1420" y="580" font-size="11pt" fill="#1e293b" text-anchor="middle">• Verifies Handover OTP</text>
  </g>

  <!-- ================= EXTERNAL ENTITY 3: CARTMATE AI (TOP) ================= -->
  <g id="entity-gemini">
    <rect x="650" y="140" width="300" height="120" class="entity-rect"/>
    <rect x="650" y="140" width="300" height="40" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="800" y="166" class="entity-text">CARTMATE AI SERVICE</text>
    <text x="800" y="200" class="entity-subtext">[Gemini AI Natural Language Assistant]</text>
    <text x="800" y="225" font-size="11pt" fill="#1e293b" text-anchor="middle">• Semantic Product Recommendations</text>
    <text x="800" y="245" font-size="11pt" fill="#1e293b" text-anchor="middle">• Syllabus &amp; Pricing Guidance</text>
  </g>

  <!-- ================= EXTERNAL ENTITY 4: ADMINISTRATOR (BOTTOM) ================= -->
  <g id="entity-admin">
    <rect x="650" y="780" width="300" height="120" class="entity-rect"/>
    <rect x="650" y="780" width="300" height="40" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="800" y="806" class="entity-text">SYSTEM ADMINISTRATOR</text>
    <text x="800" y="840" class="entity-subtext">[University Campus Admin]</text>
    <text x="800" y="865" font-size="11pt" fill="#1e293b" text-anchor="middle">• User &amp; Product Safety Moderation</text>
    <text x="800" y="885" font-size="11pt" fill="#1e293b" text-anchor="middle">• Campus Domain &amp; Audit Oversight</text>
  </g>

  <!-- ================= DATA FLOW ARROWS (12pt Font Standard) ================= -->

  <!-- BUYER -> SYSTEM -->
  <!-- 1. Reg / Login -->
  <path d="M 290 460 Q 480 430 650 480" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="360" y="420" width="220" height="26" class="label-bg"/>
  <text x="470" y="438" class="label-text">1. User Credentials &amp; Profile</text>

  <!-- 2. Search & Filter -->
  <path d="M 290 510 L 650 510" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="370" y="497" width="200" height="26" class="label-bg"/>
  <text x="470" y="515" class="label-text">2. Product Search Queries</text>

  <!-- 3. Order & Meetup Handover -->
  <path d="M 290 560 Q 480 570 650 545" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="350" y="555" width="240" height="26" class="label-bg"/>
  <text x="470" y="573" class="label-text">3. Order Request &amp; Handover OTP</text>

  <!-- SYSTEM -> BUYER -->
  <!-- 4. Responses to Buyer -->
  <path d="M 650 580 Q 480 620 290 590" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="350" y="605" width="250" height="26" class="label-bg"/>
  <text x="475" y="623" class="label-text">4. Dynamic UPI QR &amp; Product Catalog</text>

  <!-- SELLER -> SYSTEM -->
  <!-- 5. Product Listing -->
  <path d="M 1310 460 Q 1120 430 950 480" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1030" y="420" width="210" height="26" class="label-bg"/>
  <text x="1135" y="438" class="label-text">5. Product Listing &amp; Photos</text>

  <!-- 6. OTP Verification by Seller -->
  <path d="M 1310 510 L 950 510" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1025" y="497" width="220" height="26" class="label-bg"/>
  <text x="1135" y="515" class="label-text">6. Handover OTP Verification</text>

  <!-- SYSTEM -> SELLER -->
  <!-- 7. Order notification & confirmation -->
  <path d="M 950 560 Q 1120 580 1310 560" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1020" y="565" width="230" height="26" class="label-bg"/>
  <text x="1135" y="583" class="label-text">7. Order Notification &amp; SOLD State</text>

  <!-- TOP: CARTMATE AI <-> SYSTEM -->
  <!-- System -> AI -->
  <path d="M 750 430 L 750 260" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="580" y="325" width="160" height="26" class="label-bg"/>
  <text x="660" y="343" class="label-text">Student Query &amp; Intent</text>

  <!-- AI -> System -->
  <path d="M 850 260 L 850 430" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="860" y="325" width="180" height="26" class="label-bg"/>
  <text x="950" y="343" class="label-text">Catalog Recommendation</text>

  <!-- BOTTOM: ADMIN <-> SYSTEM -->
  <!-- Admin -> System -->
  <path d="M 750 780 L 750 610" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="570" y="680" width="170" height="26" class="label-bg"/>
  <text x="655" y="698" class="label-text">Moderation &amp; Removal</text>

  <!-- System -> Admin -->
  <path d="M 850 610 L 850 780" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="860" y="680" width="180" height="26" class="label-bg"/>
  <text x="950" y="698" class="label-text">Flagged Items &amp; Reports</text>
  `;

  svg += getFooter(W, H, 'DFD Level 0 — Context Diagram');
  return svg;
}

// -------------------------------------------------------------
// 2. DFD LEVEL 1 (MAJOR FUNCTIONAL PROCESSES)
// -------------------------------------------------------------
function buildLevel1() {
  const W = 1680;
  const H = 1180;
  let svg = getHeader(W, H, 'Data Flow Diagram — Level 1 (Major Processes)', 'Decomposition into Core Processes & Data Stores', 'Level 1 Major Processes');

  // Helper for drawing processes
  function drawProc(id, num, title, x, y, w = 220, h = 90) {
    return `
    <g id="${id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" ry="14" class="proc-shape"/>
      <rect x="${x}" y="${y}" width="${w}" height="28" rx="14" ry="14" fill="#f1f5f9" stroke="#000000" stroke-width="1.8"/>
      <rect x="${x}" y="${y + 14}" width="${w}" height="14" fill="#f1f5f9" stroke="none"/>
      <line x1="${x}" y1="${y + 28}" x2="${x + w}" y2="${y + 28}" class="proc-divider"/>
      <text x="${x + w / 2}" y="${y + 20}" class="proc-num">${num}</text>
      <text x="${x + w / 2}" y="${y + 55}" class="proc-title" font-size="12pt">${title}</text>
    </g>`;
  }

  // Helper for Data Store (Open-ended box Gane-Sarson)
  function drawStore(id, storeId, name, x, y, w = 240, h = 48) {
    return `
    <g id="${id}">
      <!-- Top & Bottom border with right open or simple box -->
      <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#000000" stroke-width="2"/>
      <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="#000000" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="55" height="${h}" class="store-id-box"/>
      <text x="${x + 27}" y="${y + 30}" class="store-id-text">${storeId}</text>
      <rect x="${x + 55}" y="${y + 1}" width="${w - 55}" height="${h - 2}" fill="#ffffff"/>
      <text x="${x + 70}" y="${y + 30}" class="store-name-text">${name}</text>
    </g>`;
  }

  // External Entities
  svg += `
  <!-- External Entity: Buyer -->
  <g id="entity-buyer-1">
    <rect x="50" y="320" width="160" height="140" class="entity-rect"/>
    <rect x="50" y="320" width="160" height="35" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="130" y="344" class="entity-text">BUYER (STUDENT)</text>
    <text x="130" y="380" font-size="11pt" fill="#334155" text-anchor="middle">• Search Catalog</text>
    <text x="130" y="405" font-size="11pt" fill="#334155" text-anchor="middle">• Order &amp; Pay</text>
    <text x="130" y="430" font-size="11pt" fill="#334155" text-anchor="middle">• Provide OTP</text>
  </g>

  <!-- External Entity: Seller -->
  <g id="entity-seller-1">
    <rect x="1470" y="320" width="160" height="140" class="entity-rect"/>
    <rect x="1470" y="320" width="160" height="35" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="1550" y="344" class="entity-text">SELLER (STUDENT)</text>
    <text x="1550" y="380" font-size="11pt" fill="#334155" text-anchor="middle">• List Products</text>
    <text x="1550" y="405" font-size="11pt" fill="#334155" text-anchor="middle">• Receive Orders</text>
    <text x="1550" y="430" font-size="11pt" fill="#334155" text-anchor="middle">• Verify OTP</text>
  </g>

  <!-- External Entity: CartMate AI -->
  <g id="entity-ai-1">
    <rect x="1330" y="130" width="240" height="90" class="entity-rect"/>
    <rect x="1330" y="130" width="240" height="32" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="1450" y="152" class="entity-text">CARTMATE AI (GEMINI)</text>
    <text x="1450" y="185" font-size="11pt" fill="#334155" text-anchor="middle">• NLP Recommendations</text>
    <text x="1450" y="205" font-size="11pt" fill="#334155" text-anchor="middle">• Course Syllabus Match</text>
  </g>

  <!-- External Entity: Admin -->
  <g id="entity-admin-1">
    <rect x="50" y="930" width="180" height="110" class="entity-rect"/>
    <rect x="50" y="930" width="180" height="32" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="140" y="952" class="entity-text">ADMINISTRATOR</text>
    <text x="140" y="985" font-size="11pt" fill="#334155" text-anchor="middle">• Moderate Listings</text>
    <text x="140" y="1010" font-size="11pt" fill="#334155" text-anchor="middle">• Safety Oversight</text>
  </g>
  `;

  // Draw 7 Major Processes
  svg += drawProc('p1', '1.0', 'User Authentication &amp; Profile', 270, 140, 240, 85);
  svg += drawProc('p2', '2.0', 'Product Listing &amp; Catalog', 990, 140, 240, 85);
  svg += drawProc('p3', '3.0', 'Search, Filter &amp; Recommendations', 270, 360, 240, 85);
  svg += drawProc('p4', '4.0', 'Order Placement &amp; UPI QR Engine', 270, 580, 250, 85);
  svg += drawProc('p5', '5.0', 'Physical Handover &amp; OTP Engine', 990, 580, 250, 85);
  svg += drawProc('p6', '6.0', 'CartMate AI Assistance Service', 990, 360, 240, 85);
  svg += drawProc('p7', '7.0', 'Safety Moderation &amp; Auditing', 400, 930, 240, 85);

  // Draw 5 Core Data Stores
  svg += drawStore('s1', 'D1', 'User Store (MySQL)', 630, 160, 260, 48);
  svg += drawStore('s2', 'D2', 'Product Store (MySQL)', 630, 280, 260, 48);
  svg += drawStore('s3', 'D3', 'Orders Store (MySQL)', 630, 600, 260, 48);
  svg += drawStore('s4', 'D4', 'Handover OTPs (Redis/DB)', 630, 720, 260, 48);
  svg += drawStore('s5', 'D5', 'Flagged Items &amp; Logs', 750, 950, 260, 48);

  // Arrows and 12pt Labels
  svg += `
  <!-- Flow 1: Buyer -> 1.0 Auth -->
  <path d="M 130 320 L 130 180 L 270 180" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="140" y="167" width="120" height="26" class="label-bg"/>
  <text x="200" y="185" class="label-text">Login Request</text>

  <!-- Flow 2: 1.0 Auth <-> D1 Users -->
  <path d="M 510 175 L 630 175" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="525" y="162" width="90" height="26" class="label-bg"/>
  <text x="570" y="180" class="label-text">Verify User</text>

  <!-- Flow 3: Seller -> 2.0 Product Listing -->
  <path d="M 1550 320 L 1550 180 L 1230 180" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1270" y="167" width="130" height="26" class="label-bg"/>
  <text x="1335" y="185" class="label-text">Product Details</text>

  <!-- Flow 4: 2.0 Product -> D2 Products -->
  <path d="M 990 190 L 890 190 L 890 280" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="880" y="225" width="100" height="26" class="label-bg"/>
  <text x="930" y="243" class="label-text">Save Listing</text>

  <!-- Flow 5: Buyer -> 3.0 Search -->
  <path d="M 210 390 L 270 390" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="205" y="377" width="70" height="26" class="label-bg"/>
  <text x="240" y="395" class="label-text">Query</text>

  <!-- Flow 6: D2 Products -> 3.0 Search -->
  <path d="M 630 300 L 510 300 L 510 380" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="490" y="330" width="100" height="26" class="label-bg"/>
  <text x="540" y="348" class="label-text">Item Catalog</text>

  <!-- Flow 7: 3.0 Search -> Buyer -->
  <path d="M 270 420 L 210 420" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="205" y="407" width="80" height="26" class="label-bg"/>
  <text x="245" y="425" class="label-text">Results</text>

  <!-- Flow 8: Buyer -> 4.0 Orders -->
  <path d="M 130 460 L 130 620 L 270 620" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="140" y="607" width="120" height="26" class="label-bg"/>
  <text x="200" y="625" class="label-text">Order Request</text>

  <!-- Flow 9: 4.0 Orders -> D3 Orders -->
  <path d="M 520 620 L 630 620" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="535" y="607" width="80" height="26" class="label-bg"/>
  <text x="575" y="625" class="label-text">Save Order</text>

  <!-- Flow 10: 4.0 Orders -> D4 Handover OTP -->
  <path d="M 390 665 L 390 740 L 630 740" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="440" y="727" width="140" height="26" class="label-bg"/>
  <text x="510" y="745" class="label-text">Generate 6-Digit OTP</text>

  <!-- Flow 11: 4.0 Orders -> Buyer (UPI QR & OTP) -->
  <path d="M 270 645 L 170 645 L 170 460" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="150" y="540" width="110" height="26" class="label-bg"/>
  <text x="205" y="558" class="label-text">UPI QR &amp; OTP</text>

  <!-- Flow 12: Seller -> 5.0 Handover OTP Verify -->
  <path d="M 1550 460 L 1550 620 L 1240 620" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1270" y="607" width="140" height="26" class="label-bg"/>
  <text x="1340" y="625" class="label-text">Submit Buyer OTP</text>

  <!-- Flow 13: 5.0 Handover <-> D4 Handover OTP -->
  <path d="M 990 640 L 890 640 L 890 730 L 890 730" class="flow-arrow" marker-end="url(#arrow)"/>
  <path d="M 890 730 L 890 730" stroke="#000" stroke-width="2"/>
  <rect x="880" y="675" width="100" height="26" class="label-bg"/>
  <text x="930" y="693" class="label-text">Verify OTP</text>

  <!-- Flow 14: 5.0 Handover -> D2 & D3 (Mark SOLD & Completed) -->
  <path d="M 1110 580 L 1110 490 L 760 490 L 760 328" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="860" y="477" width="150" height="26" class="label-bg"/>
  <text x="935" y="495" class="label-text">Mark Item SOLD (D2)</text>

  <!-- Flow 15: 6.0 CartMate AI <-> External AI -->
  <path d="M 1230 380 L 1450 380 L 1450 220" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1270" y="367" width="140" height="26" class="label-bg"/>
  <text x="1340" y="385" class="label-text">Query / Response</text>

  <!-- Flow 16: Admin -> 7.0 Safety Moderation -->
  <path d="M 230 970 L 400 970" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="250" y="957" width="130" height="26" class="label-bg"/>
  <text x="315" y="975" class="label-text">Moderation Policy</text>

  <!-- Flow 17: 7.0 Moderation <-> D5 Flagged Items -->
  <path d="M 640 970 L 750 970" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="655" y="957" width="80" height="26" class="label-bg"/>
  <text x="695" y="975" class="label-text">Audit Logs</text>
  `;

  svg += getFooter(W, H, 'DFD Level 1 — Major Functional Processes');
  return svg;
}

// -------------------------------------------------------------
// 3. DFD LEVEL 2 (ORDER PROCESSING & OTP HANDOVER VERIFICATION)
// -------------------------------------------------------------
function buildLevel2() {
  const W = 1680;
  const H = 1100;
  let svg = getHeader(W, H, 'Data Flow Diagram — Level 2 (Order & Handover OTP Engine)', 'Sub-Process Decomposition of Processes 4.0 & 5.0', 'Level 2 Detailed DFD');

  function drawProc2(id, num, title, x, y, w = 230, h = 90) {
    return `
    <g id="${id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" ry="14" class="proc-shape"/>
      <rect x="${x}" y="${y}" width="${w}" height="28" rx="14" ry="14" fill="#f1f5f9" stroke="#000000" stroke-width="1.8"/>
      <rect x="${x}" y="${y + 14}" width="${w}" height="14" fill="#f1f5f9" stroke="none"/>
      <line x1="${x}" y1="${y + 28}" x2="${x + w}" y2="${y + 28}" class="proc-divider"/>
      <text x="${x + w / 2}" y="${y + 20}" class="proc-num">${num}</text>
      <text x="${x + w / 2}" y="${y + 55}" class="proc-title" font-size="12pt">${title}</text>
    </g>`;
  }

  function drawStore2(id, storeId, name, x, y, w = 240, h = 48) {
    return `
    <g id="${id}">
      <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#000000" stroke-width="2"/>
      <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="#000000" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="55" height="${h}" class="store-id-box"/>
      <text x="${x + 27}" y="${y + 30}" class="store-id-text">${storeId}</text>
      <rect x="${x + 55}" y="${y + 1}" width="${w - 55}" height="${h - 2}" fill="#ffffff"/>
      <text x="${x + 70}" y="${y + 30}" class="store-name-text">${name}</text>
    </g>`;
  }

  // External Entities
  svg += `
  <!-- Entity: Buyer -->
  <g id="entity-buyer-2">
    <rect x="60" y="350" width="180" height="180" class="entity-rect"/>
    <rect x="60" y="350" width="180" height="38" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="150" y="375" class="entity-text">BUYER (STUDENT)</text>
    <text x="150" y="420" font-size="11pt" fill="#334155" text-anchor="middle">1. Place Order</text>
    <text x="150" y="450" font-size="11pt" fill="#334155" text-anchor="middle">2. Scan UPI QR</text>
    <text x="150" y="480" font-size="11pt" fill="#334155" text-anchor="middle">3. Physical Inspection</text>
    <text x="150" y="510" font-size="11pt" fill="#334155" text-anchor="middle">4. Reveal OTP on Campus</text>
  </g>

  <!-- Entity: Seller -->
  <g id="entity-seller-2">
    <rect x="1440" y="350" width="180" height="180" class="entity-rect"/>
    <rect x="1440" y="350" width="180" height="38" fill="#e2e8f0" stroke="#000000" stroke-width="1.8"/>
    <text x="1530" y="375" class="entity-text">SELLER (STUDENT)</text>
    <text x="1530" y="420" font-size="11pt" fill="#334155" text-anchor="middle">1. Order Alert</text>
    <text x="1530" y="450" font-size="11pt" fill="#334155" text-anchor="middle">2. Handover Item</text>
    <text x="1530" y="480" font-size="11pt" fill="#334155" text-anchor="middle">3. Take Buyer's OTP</text>
    <text x="1530" y="510" font-size="11pt" fill="#334155" text-anchor="middle">4. Finalize Sale</text>
  </g>
  `;

  // Sub-Processes
  svg += drawProc2('p41', '4.1', 'Validate Item Availability', 330, 200, 230, 85);
  svg += drawProc2('p42', '4.2', 'Generate Dynamic UPI QR', 330, 390, 230, 85);
  svg += drawProc2('p43', '4.3', 'Generate 6-Digit Secure OTP', 330, 580, 230, 85);

  svg += drawProc2('p51', '5.1', 'Receive Campus Handover OTP', 1110, 390, 240, 85);
  svg += drawProc2('p52', '5.2', 'Cryptographic OTP Verification', 1110, 580, 240, 85);
  svg += drawProc2('p53', '5.3', 'Atomic State Update (SOLD)', 1110, 770, 240, 85);

  // Data Stores
  svg += drawStore2('s2-prod', 'D2', 'Products Store', 720, 220, 250, 48);
  svg += drawStore2('s3-ord', 'D3', 'Orders Store', 720, 410, 250, 48);
  svg += drawStore2('s4-otp', 'D4', 'Handover OTPs Store', 720, 600, 250, 48);

  // Data Flows
  svg += `
  <!-- Buyer -> 4.1 Check Item -->
  <path d="M 150 350 L 150 240 L 330 240" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="180" y="227" width="130" height="26" class="label-bg"/>
  <text x="245" y="245" class="label-text">Select Product</text>

  <!-- 4.1 Check <-> D2 Products -->
  <path d="M 560 240 L 720 240" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="585" y="227" width="110" height="26" class="label-bg"/>
  <text x="640" y="245" class="label-text">Check Stock</text>

  <!-- 4.1 -> 4.2 Generate UPI QR -->
  <path d="M 445 285 L 445 390" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="385" y="325" width="120" height="26" class="label-bg"/>
  <text x="445" y="343" class="label-text">Order Initialized</text>

  <!-- 4.2 UPI QR -> Buyer -->
  <path d="M 330 430 L 240 430" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="245" y="417" width="80" height="26" class="label-bg"/>
  <text x="285" y="435" class="label-text">UPI QR Code</text>

  <!-- 4.2 -> D3 Orders -->
  <path d="M 560 430 L 720 430" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="590" y="417" width="100" height="26" class="label-bg"/>
  <text x="640" y="435" class="label-text">Record Order</text>

  <!-- 4.2 -> 4.3 OTP Gen -->
  <path d="M 445 475 L 445 580" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="385" y="515" width="120" height="26" class="label-bg"/>
  <text x="445" y="533" class="label-text">Create OTP Task</text>

  <!-- 4.3 OTP Gen -> D4 OTP Store -->
  <path d="M 560 620 L 720 620" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="590" y="607" width="100" height="26" class="label-bg"/>
  <text x="640" y="625" class="label-text">Store Hash OTP</text>

  <!-- 4.3 OTP Gen -> Buyer -->
  <path d="M 330 625 L 150 625 L 150 530" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="180" y="612" width="130" height="26" class="label-bg"/>
  <text x="245" y="630" class="label-text">Display 6-Digit OTP</text>

  <!-- Campus Physical Handover Box (Visual Grouping) -->
  <rect x="670" y="740" width="350" height="90" rx="8" ry="8" fill="#f8fafc" stroke="#475569" stroke-width="1.5" stroke-dasharray="6,4"/>
  <text x="845" y="770" font-size="12pt" font-weight="bold" fill="#0f172a" text-anchor="middle">Campus Physical Meetup</text>
  <text x="845" y="795" font-size="11pt" fill="#475569" text-anchor="middle">• Buyer inspects goods &amp; shares OTP</text>
  <text x="845" y="815" font-size="11pt" fill="#475569" text-anchor="middle">• Cash exchange or Instant UPI</text>

  <!-- Seller -> 5.1 Input OTP -->
  <path d="M 1440 430 L 1350 430" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1355" y="417" width="80" height="26" class="label-bg"/>
  <text x="1395" y="435" class="label-text">Input OTP</text>

  <!-- 5.1 -> 5.2 Verify -->
  <path d="M 1230 475 L 1230 580" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1170" y="515" width="120" height="26" class="label-bg"/>
  <text x="1230" y="533" class="label-text">Send for Match</text>

  <!-- 5.2 Verify <-> D4 OTP Store -->
  <path d="M 1110 620 L 970 620" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1000" y="607" width="80" height="26" class="label-bg"/>
  <text x="1040" y="625" class="label-text">Verify OTP</text>

  <!-- 5.2 Verify -> 5.3 Atomic Update -->
  <path d="M 1230 665 L 1230 770" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1170" y="705" width="120" height="26" class="label-bg"/>
  <text x="1230" y="723" class="label-text">OTP Match (Valid)</text>

  <!-- 5.3 Update -> D2 & D3 (Mark SOLD & Completed) -->
  <path d="M 1110 815 L 845 815 L 845 460" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="855" y="515" width="150" height="26" class="label-bg"/>
  <text x="930" y="533" class="label-text">Update Orders (D3)</text>

  <!-- 5.3 Update -> Seller Alert -->
  <path d="M 1340 815 L 1530 815 L 1530 530" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1380" y="802" width="130" height="26" class="label-bg"/>
  <text x="1445" y="820" class="label-text">Sale Finalized Alert</text>
  `;

  svg += getFooter(W, H, 'DFD Level 2 — Order & Handover OTP Decomposition');
  return svg;
}

// Generate files
const l0 = buildLevel0();
const l1 = buildLevel1();
const l2 = buildLevel2();

fs.writeFileSync(path.join(OUTPUT_DIR, 'DFD_Level_0_Formal.svg'), l0, 'utf8');
fs.writeFileSync(path.join(OUTPUT_DIR, 'DFD_Level_1_Formal.svg'), l1, 'utf8');
fs.writeFileSync(path.join(OUTPUT_DIR, 'DFD_Level_2_Formal.svg'), l2, 'utf8');

console.log('✓ Wrote SVGs to dfd-diagrams');

// Render PNGs via Chrome headless
const renderList = [
  { name: 'DFD_Level_0_Formal', svg: l0, w: 2400, h: 1575 },
  { name: 'DFD_Level_1_Formal', svg: l1, w: 2520, h: 1770 },
  { name: 'DFD_Level_2_Formal', svg: l2, w: 2520, h: 1650 },
];

renderList.forEach(item => {
  const htmlFile = path.join(OUTPUT_DIR, `${item.name}.html`);
  const pngFile = path.join(OUTPUT_DIR, `${item.name}.png`);
  const artifactPng = path.join(ARTIFACT_DIR, `${item.name}.png`);

  const pageHtml = `<!DOCTYPE html>
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

  fs.writeFileSync(htmlFile, pageHtml, 'utf8');

  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      `--window-size=${item.w},${item.h}`,
      `--screenshot=${pngFile}`,
      htmlFile,
    ], { stdio: 'ignore' });

    // Copy to artifact directory as well
    fs.copyFileSync(pngFile, artifactPng);
    console.log(`✓ Rendered PNG: ${item.name}.png (${fs.statSync(pngFile).size} bytes)`);
  } catch (e) {
    console.error(`Error rendering ${item.name}:`, e.message);
  }
});

console.log('ALL FORMAL DFDs GENERATED SUCCESSFULLY!');
