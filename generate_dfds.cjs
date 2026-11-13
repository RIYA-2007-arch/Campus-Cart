// generate_dfds.cjs - Generates 3 Professional Black & White DFD diagrams for CampusCart (A3 Landscape)
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'dfd-diagrams');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Common styles & definitions for B&W Academic Report DFDs
function getSvgHeader(width, height, title, subtitle, levelText) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .title { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 24px; font-weight: bold; fill: #000; text-anchor: middle; letter-spacing: 0.5px; }
      .subtitle { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 15px; font-weight: normal; fill: #333; text-anchor: middle; }
      .meta { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 12px; fill: #444; }
      .proc-id { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 14px; font-weight: bold; fill: #000; text-anchor: middle; }
      .proc-name { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 14px; font-weight: bold; fill: #000; text-anchor: middle; }
      .proc-sub { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 11px; fill: #333; text-anchor: middle; }
      .entity-title { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 15px; font-weight: bold; fill: #000; text-anchor: middle; letter-spacing: 0.5px; }
      .entity-sub { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 11px; fill: #444; text-anchor: middle; }
      .store-id { font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; fill: #000; }
      .store-name { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 13px; font-weight: bold; fill: #000; }
      .flow-text { font-family: 'Arial', 'Segoe UI', sans-serif; font-size: 11px; fill: #000; font-weight: 600; }
      .flow-text-bg { fill: #ffffff; }
      .box-entity { fill: #fcfcfc; stroke: #000000; stroke-width: 2.2; }
      .box-entity-header { fill: #e6e6e6; stroke: #000000; stroke-width: 2.2; }
      .proc-circle { fill: #ffffff; stroke: #000000; stroke-width: 2.4; }
      .proc-gane { fill: #ffffff; stroke: #000000; stroke-width: 2.2; rx: 12; ry: 12; }
      .proc-gane-header { fill: #e6e6e6; stroke: #000000; stroke-width: 2.2; }
      .store-line { stroke: #000000; stroke-width: 2.4; fill: #ffffff; }
      .flow-arrow { stroke: #000000; stroke-width: 1.8; fill: none; }
      .flow-arrow-dashed { stroke: #000000; stroke-width: 1.6; stroke-dasharray: 5,4; fill: none; }
      .frame { fill: none; stroke: #000000; stroke-width: 2.5; }
      .inner-frame { fill: none; stroke: #000000; stroke-width: 1.0; }
      .table-border { stroke: #000000; stroke-width: 1.2; fill: #fdfdfd; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000" />
    </marker>
    <marker id="arrow-bi" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 10 1 L 0 5 L 10 9 z" fill="#000000" />
    </marker>
  </defs>

  <!-- Background Canvas -->
  <rect width="${width}" height="${height}" fill="#ffffff"/>

  <!-- Academic A3 Engineering Border -->
  <rect x="25" y="25" width="${width - 50}" height="${height - 50}" class="frame"/>
  <rect x="33" y="33" width="${width - 66}" height="${height - 66}" class="inner-frame"/>

  <!-- Title Header Block -->
  <rect x="50" y="45" width="${width - 100}" height="80" fill="#f8f8f8" stroke="#000" stroke-width="1.8"/>
  <text x="${width / 2}" y="75" class="title">CAMPUSCART — AKS UNIVERSITY STUDENT PEER-TO-PEER MARKETPLACE</text>
  <text x="${width / 2}" y="100" class="subtitle">${title} (${levelText})</text>
  <text x="${width / 2}" y="117" class="proc-sub">${subtitle}</text>

  <!-- Bottom Metadata / Signature Block -->
  <rect x="50" y="${height - 75}" width="${width - 100}" height="45" fill="#fcfcfc" stroke="#000" stroke-width="1.5"/>
  <text x="70" y="${height - 48}" class="meta"><tspan font-weight="bold">Project:</tspan> CampusCart Marketplace</text>
  <text x="320" y="${height - 48}" class="meta"><tspan font-weight="bold">Author:</tspan> Riya Kumari Soni (B2455R101A1020)</text>
  <text x="680" y="${height - 48}" class="meta"><tspan font-weight="bold">Guide:</tspan> Mr. Anmol Dubey (IBM Expert)</text>
  <text x="1010" y="${height - 48}" class="meta"><tspan font-weight="bold">HOD:</tspan> Dr. C.D. Gautam</text>
  <text x="1270" y="${height - 48}" class="meta"><tspan font-weight="bold">Standard:</tspan> Gane-Sarson / ISO 5807</text>
  <text x="1510" y="${height - 48}" class="meta"><tspan font-weight="bold">Format:</tspan> A3 Landscape</text>
`;
}

// -------------------------------------------------------------
// 1. DFD LEVEL 0 (CONTEXT DIAGRAM)
// -------------------------------------------------------------
function buildDfdLevel0() {
  const W = 1684;
  const H = 1190;
  let svg = getSvgHeader(W, H, 'DATA FLOW DIAGRAM (DFD) — LEVEL 0', 'High-Level Boundary & Context Diagram of CampusCart System', 'Context Level');

  // Central System Process (0.0 CampusCart System)
  const cx = 842;
  const cy = 600;
  const r = 160;

  svg += `
  <!-- Central Process: 0.0 CampusCart System -->
  <g id="process-0">
    <circle cx="${cx}" cy="${cy}" r="${r}" class="proc-circle"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="#000000" stroke-width="1.0"/>
    <line x1="${cx - r + 15}" y1="${cy - 45}" x2="${cx + r - 15}" y2="${cy - 45}" stroke="#000" stroke-width="1.5"/>
    <text x="${cx}" y="${cy - 60}" class="proc-id">PROCESS 0.0</text>
    <text x="${cx}" y="${cy - 12}" class="proc-name" font-size="20">CAMPUSCART</text>
    <text x="${cx}" y="${cy + 15}" class="proc-name" font-size="16">SYSTEM</text>
    <line x1="${cx - r + 15}" y1="${cy + 35}" x2="${cx + r - 15}" y2="${cy + 35}" stroke="#000" stroke-width="1.5"/>
    <text x="${cx}" y="${cy + 60}" class="proc-sub">AKS University Peer-to-Peer</text>
    <text x="${cx}" y="${cy + 78}" class="proc-sub">Marketplace &amp; Secure OTP Engine</text>
  </g>

  <!-- External Entity 1: Student (Buyer) [Left] -->
  <g id="entity-buyer">
    <rect x="70" y="420" width="250" height="360" class="box-entity"/>
    <rect x="70" y="420" width="250" height="50" class="box-entity-header"/>
    <text x="195" y="445" class="entity-title">STUDENT (BUYER)</text>
    <text x="195" y="462" class="entity-sub">External Entity (Student Body)</text>
    <line x1="85" y1="480" x2="305" y2="480" stroke="#aaa" stroke-width="1"/>
    <text x="85" y="510" class="proc-sub" text-anchor="start" font-weight="bold">• Features &amp; Actions:</text>
    <text x="85" y="535" class="proc-sub" text-anchor="start">1. Student Registration &amp; Login</text>
    <text x="85" y="560" class="proc-sub" text-anchor="start">2. Search &amp; Filter Products</text>
    <text x="85" y="585" class="proc-sub" text-anchor="start">3. Place Order (Cash / UPI)</text>
    <text x="85" y="610" class="proc-sub" text-anchor="start">4. Scan Dynamic UPI QR Code</text>
    <text x="85" y="635" class="proc-sub" text-anchor="start">5. Receive 6-Digit Handover OTP</text>
    <text x="85" y="660" class="proc-sub" text-anchor="start">6. Physical Inspection on Campus</text>
    <text x="85" y="685" class="proc-sub" text-anchor="start">7. Reveal OTP to Seller upon Delivery</text>
    <text x="85" y="710" class="proc-sub" text-anchor="start">8. Chat with CartMate AI Assistant</text>
    <text x="85" y="735" class="proc-sub" text-anchor="start">9. Wishlist &amp; Fraud Reporting</text>
  </g>

  <!-- External Entity 2: Student (Seller) [Right] -->
  <g id="entity-seller">
    <rect x="1364" y="420" width="250" height="360" class="box-entity"/>
    <rect x="1364" y="420" width="250" height="50" class="box-entity-header"/>
    <text x="1489" y="445" class="entity-title">STUDENT (SELLER)</text>
    <text x="1489" y="462" class="entity-sub">External Entity (Student Body)</text>
    <line x1="1379" y1="480" x2="1599" y2="480" stroke="#aaa" stroke-width="1"/>
    <text x="1379" y="510" class="proc-sub" text-anchor="start" font-weight="bold">• Features &amp; Actions:</text>
    <text x="1379" y="535" class="proc-sub" text-anchor="start">1. Authenticate with AKS Domain</text>
    <text x="1379" y="560" class="proc-sub" text-anchor="start">2. List Used Items &amp; Upload Photos</text>
    <text x="1379" y="585" class="proc-sub" text-anchor="start">3. Set Price, Condition &amp; Age</text>
    <text x="1379" y="610" class="proc-sub" text-anchor="start">4. Receive Order Notifications</text>
    <text x="1379" y="635" class="proc-sub" text-anchor="start">5. Agree on Campus Meetup Point</text>
    <text x="1379" y="660" class="proc-sub" text-anchor="start">6. Collect Cash or Direct UPI</text>
    <text x="1379" y="685" class="proc-sub" text-anchor="start">7. Input Buyer's 6-Digit OTP</text>
    <text x="1379" y="710" class="proc-sub" text-anchor="start">8. Mark Listing Automatically SOLD</text>
    <text x="1379" y="735" class="proc-sub" text-anchor="start">9. View Sales &amp; Listings History</text>
  </g>

  <!-- External Entity 3: CartMate AI (Gemini Assistant) [Top] -->
  <g id="entity-gemini">
    <rect x="642" y="155" width="400" height="135" class="box-entity"/>
    <rect x="642" y="155" width="400" height="42" class="box-entity-header"/>
    <text x="842" y="182" class="entity-title">CARTMATE AI (GEMINI 2.5 API)</text>
    <text x="842" y="215" class="proc-sub">• Provides intelligent product search, semantic filtering &amp; campus recommendations</text>
    <text x="842" y="235" class="proc-sub">• Advises students on syllabus books, electronic components &amp; pricing</text>
    <text x="842" y="255" class="proc-sub">• Zero-hallucination guardrail tied to live CampusCart MySQL inventory</text>
  </g>

  <!-- External Entity 4: System Administrator [Bottom] -->
  <g id="entity-admin">
    <rect x="642" y="930" width="400" height="135" class="box-entity"/>
    <rect x="642" y="930" width="400" height="42" class="box-entity-header"/>
    <text x="842" y="957" class="entity-title">SYSTEM ADMINISTRATOR (ADMIN)</text>
    <text x="842" y="990" class="proc-sub">• Platform Security, AKS Domain Verification &amp; Role Enforcement</text>
    <text x="842" y="1010" class="proc-sub">• Fraudulent Listing Moderation &amp; Flagged Product Removal</text>
    <text x="842" y="1030" class="proc-sub">• Category Management, User Audit Logs &amp; Platform Metrics</text>
  </g>

  <!-- ================= DATA FLOW ARROWS ================= -->

  <!-- BUYER -> SYSTEM (Top to Bottom of Buyer flows) -->
  <!-- 1. Reg/Login Credentials -->
  <path d="M 320 480 Q 500 480 690 540" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="360" y="475" width="220" height="20" class="flow-text-bg"/>
  <text x="470" y="490" class="flow-text" text-anchor="middle">1. Register / Login Credentials &amp; OTP</text>

  <!-- 2. Search & Order Request -->
  <path d="M 320 560 Q 480 560 682 585" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="360" y="550" width="220" height="20" class="flow-text-bg"/>
  <text x="470" y="565" class="flow-text" text-anchor="middle">2. Search Queries &amp; Order Placement</text>

  <!-- 3. Handover OTP (Physical meetup) -->
  <path d="M 320 640 Q 500 640 684 625" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="350" y="625" width="240" height="20" class="flow-text-bg"/>
  <text x="470" y="640" class="flow-text" text-anchor="middle">3. Cash / UPI Payment &amp; Handover OTP</text>

  <!-- SYSTEM -> BUYER -->
  <!-- 4. Auth token, catalog, OTP display -->
  <path d="M 690 660 Q 500 720 320 720" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="350" y="695" width="260" height="20" class="flow-text-bg"/>
  <text x="480" y="710" class="flow-text" text-anchor="middle">4. Catalog, UPI QR &amp; 6-Digit Handover OTP</text>


  <!-- SELLER <-> SYSTEM -->
  <!-- 1. Product Listing Details & Photos -->
  <path d="M 1364 480 Q 1184 480 994 540" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1100" y="475" width="225" height="20" class="flow-text-bg"/>
  <text x="1212" y="490" class="flow-text" text-anchor="middle">1. Product Specs, Photos &amp; Resale Price</text>

  <!-- 2. Verification OTP submission -->
  <path d="M 1364 560 Q 1204 560 1002 585" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1100" y="550" width="225" height="20" class="flow-text-bg"/>
  <text x="1212" y="565" class="flow-text" text-anchor="middle">2. Verify 6-Digit Handover OTP</text>

  <!-- 3. System to Seller: Order alert & SOLD confirmation -->
  <path d="M 1000 625 Q 1184 640 1364 640" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1080" y="625" width="245" height="20" class="flow-text-bg"/>
  <text x="1202" y="640" class="flow-text" text-anchor="middle">3. Order Alert &amp; "SOLD" Confirmation</text>

  <!-- 4. System to Seller: Dashboard & listing status -->
  <path d="M 994 660 Q 1184 720 1364 720" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1100" y="695" width="225" height="20" class="flow-text-bg"/>
  <text x="1212" y="710" class="flow-text" text-anchor="middle">4. Seller Dashboard &amp; Payment History</text>


  <!-- GEMINI AI <-> SYSTEM -->
  <!-- System -> Gemini -->
  <path d="M 810 440 L 810 290" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="670" y="350" width="135" height="20" class="flow-text-bg"/>
  <text x="737" y="365" class="flow-text" text-anchor="middle">User Prompt &amp; Context</text>

  <!-- Gemini -> System -->
  <path d="M 874 290 L 874 440" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="880" y="350" width="145" height="20" class="flow-text-bg"/>
  <text x="952" y="365" class="flow-text" text-anchor="middle">AI Smart Response</text>


  <!-- ADMIN <-> SYSTEM -->
  <!-- Admin -> System -->
  <path d="M 810 930 L 810 760" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="660" y="830" width="145" height="20" class="flow-text-bg"/>
  <text x="732" y="845" class="flow-text" text-anchor="middle">Moderation &amp; Category Edits</text>

  <!-- System -> Admin -->
  <path d="M 874 760 L 874 930" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="880" y="830" width="145" height="20" class="flow-text-bg"/>
  <text x="952" y="845" class="flow-text" text-anchor="middle">Audit Logs &amp; Fraud Reports</text>

  <!-- Legend Box (Top Right Corner) -->
  <g id="legend">
    <rect x="${W - 320}" y="145" width="265" height="150" class="table-border"/>
    <text x="${W - 187}" y="168" class="proc-name" font-size="13">DFD NOTATION KEY</text>
    <line x1="${W - 310}" y1="178" x2="${W - 65}" y2="178" stroke="#000" stroke-width="1"/>
    
    <!-- Circle: Process -->
    <circle cx="${W - 290}" cy="202" r="14" fill="#fff" stroke="#000" stroke-width="1.8"/>
    <text x="${W - 265}" y="206" class="proc-sub" text-anchor="start">Process / System Transform</text>

    <!-- Rect: Entity -->
    <rect x="${W - 302}" y="224" width="24" height="16" fill="#f4f4f4" stroke="#000" stroke-width="1.8"/>
    <text x="${W - 265}" y="236" class="proc-sub" text-anchor="start">External Entity (Source/Sink)</text>

    <!-- Arrow: Flow -->
    <line x1="${W - 302}" y1="262" x2="${W - 275}" y2="262" stroke="#000" stroke-width="1.8" marker-end="url(#arrow)"/>
    <text x="${W - 265}" y="266" class="proc-sub" text-anchor="start">Data Flow Direction</text>
  </g>
</svg>`;
  return svg;
}

// -------------------------------------------------------------
// 2. DFD LEVEL 1 (MAJOR SYSTEM PROCESSES)
// -------------------------------------------------------------
function buildDfdLevel1() {
  const W = 1684;
  const H = 1190;
  let svg = getSvgHeader(W, H, 'DATA FLOW DIAGRAM (DFD) — LEVEL 1', 'Functional Decomposition of CampusCart into 7 Core Processes & 6 Data Stores', 'Level 1');

  // Gane-Sarson Process Helper
  function makeProcess(id, name1, name2, x, y, w = 180, h = 95) {
    return `
    <g id="p-${id.replace('.', '-')}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" class="proc-gane"/>
      <path d="M ${x} ${y + 28} L ${x + w} ${y + 28}" stroke="#000" stroke-width="1.8"/>
      <path d="M ${x} ${y + 28} L ${x} ${y + 12} Q ${x} ${y} ${x + 12} ${y} L ${x + w - 12} ${y} Q ${x + w} ${y} ${x + w} ${y + 12} L ${x + w} ${y + 28} Z" fill="#e8e8e8"/>
      <text x="${x + w / 2}" y="${y + 19}" class="proc-id">${id}</text>
      <text x="${x + w / 2}" y="${y + 55}" class="proc-name">${name1}</text>
      <text x="${x + w / 2}" y="${y + 75}" class="proc-name">${name2}</text>
    </g>`;
  }

  // Gane-Sarson Open Data Store Helper (D1, D2...)
  function makeStore(id, name, x, y, w = 220, h = 48) {
    return `
    <g id="store-${id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fdfdfd"/>
      <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" class="store-line"/>
      <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" class="store-line"/>
      <line x1="${x + 45}" y1="${y}" x2="${x + 45}" y2="${y + h}" stroke="#000" stroke-width="1.8"/>
      <text x="${x + 22}" y="${y + 29}" class="store-id" text-anchor="middle">${id}</text>
      <text x="${x + 58}" y="${y + 29}" class="store-name" text-anchor="start">${name}</text>
    </g>`;
  }

  // Draw Entities
  // Buyer Left
  svg += `
  <!-- External Entity: Student (Buyer) -->
  <g id="entity-buyer">
    <rect x="55" y="380" width="165" height="420" class="box-entity"/>
    <rect x="55" y="380" width="165" height="40" class="box-entity-header"/>
    <text x="137" y="405" class="entity-title" font-size="13">STUDENT (BUYER)</text>
    <text x="70" y="445" class="proc-sub" text-anchor="start" font-weight="bold">Inputs / Outputs:</text>
    <text x="70" y="475" class="proc-sub" text-anchor="start">• Register / Login</text>
    <text x="70" y="505" class="proc-sub" text-anchor="start">• Browse Catalog</text>
    <text x="70" y="535" class="proc-sub" text-anchor="start">• Apply Search Filters</text>
    <text x="70" y="565" class="proc-sub" text-anchor="start">• Place Order</text>
    <text x="70" y="595" class="proc-sub" text-anchor="start">• View UPI QR</text>
    <text x="70" y="625" class="proc-sub" text-anchor="start">• Get 6-Digit OTP</text>
    <text x="70" y="655" class="proc-sub" text-anchor="start">• Physical Handover</text>
    <text x="70" y="685" class="proc-sub" text-anchor="start">• Chat with AI</text>
    <text x="70" y="715" class="proc-sub" text-anchor="start">• Wishlist Items</text>
    <text x="70" y="745" class="proc-sub" text-anchor="start">• Report Fraud</text>
  </g>

  <!-- External Entity: Student (Seller) -->
  <g id="entity-seller">
    <rect x="1460" y="380" width="165" height="420" class="box-entity"/>
    <rect x="1460" y="380" width="165" height="40" class="box-entity-header"/>
    <text x="1542" y="405" class="entity-title" font-size="13">STUDENT (SELLER)</text>
    <text x="1475" y="445" class="proc-sub" text-anchor="start" font-weight="bold">Inputs / Outputs:</text>
    <text x="1475" y="475" class="proc-sub" text-anchor="start">• Seller Login</text>
    <text x="1475" y="505" class="proc-sub" text-anchor="start">• Post Product Listing</text>
    <text x="1475" y="535" class="proc-sub" text-anchor="start">• Upload Real Photos</text>
    <text x="1475" y="565" class="proc-sub" text-anchor="start">• Set Pricing &amp; Age</text>
    <text x="1475" y="595" class="proc-sub" text-anchor="start">• Receive Orders</text>
    <text x="1475" y="625" class="proc-sub" text-anchor="start">• Collect Payment</text>
    <text x="1475" y="655" class="proc-sub" text-anchor="start">• Input Handover OTP</text>
    <text x="1475" y="685" class="proc-sub" text-anchor="start">• Verify Delivery</text>
    <text x="1475" y="715" class="proc-sub" text-anchor="start">• Listing Marked SOLD</text>
    <text x="1475" y="745" class="proc-sub" text-anchor="start">• View Sales Record</text>
  </g>

  <!-- External Entity: CartMate AI (Top Middle) -->
  <g id="entity-ai">
    <rect x="290" y="150" width="260" height="90" class="box-entity"/>
    <rect x="290" y="150" width="260" height="32" class="box-entity-header"/>
    <text x="420" y="172" class="entity-title" font-size="12">CARTMATE AI (GEMINI API)</text>
    <text x="420" y="202" class="proc-sub">Natural Language Query Processing</text>
    <text x="420" y="222" class="proc-sub">&amp; Live Database Recommendations</text>
  </g>

  <!-- External Entity: Admin (Bottom Right) -->
  <g id="entity-admin">
    <rect x="1130" y="150" width="260" height="90" class="box-entity"/>
    <rect x="1130" y="150" width="260" height="32" class="box-entity-header"/>
    <text x="1260" y="172" class="entity-title" font-size="12">SYSTEM ADMINISTRATOR</text>
    <text x="1260" y="202" class="proc-sub">User Moderation, Category Management</text>
    <text x="1260" y="222" class="proc-sub">&amp; Platform Compliance Auditing</text>
  </g>
  `;

  // Draw 7 Major Processes
  // 1.0 User Authentication (Top Left-Center)
  svg += makeProcess('1.0', 'User Registration', '&amp; Authentication', 300, 310, 210, 95);

  // 2.0 Product Management (Top Right-Center)
  svg += makeProcess('2.0', 'Product Listing &amp;', 'Catalog Management', 1170, 310, 210, 95);

  // 3.0 Search & Browse (Center Left)
  svg += makeProcess('3.0', 'Browse, Search &amp;', 'Filter Catalog', 300, 500, 210, 95);

  // 4.0 Order & UPI QR Generation (Center)
  svg += makeProcess('4.0', 'Order Placement &amp;', 'UPI QR Generation', 620, 500, 220, 95);

  // 5.0 Handover OTP Verification (Center Right)
  svg += makeProcess('5.0', 'Physical Handover', '&amp; OTP Verification', 960, 500, 220, 95);

  // 6.0 CartMate AI Assistant (Lower Left)
  svg += makeProcess('6.0', 'CartMate AI Chat', '&amp; Recommendation', 300, 710, 210, 95);

  // 7.0 Safety, Wishlist & Moderation (Lower Right)
  svg += makeProcess('7.0', 'Safety, Wishlist &amp;', 'Fraud Moderation', 1170, 710, 210, 95);

  // Draw 6 Data Stores (Arranged along bottom & center-line)
  svg += makeStore('D1', 'Users DB (users table)', 680, 290, 260, 48);
  svg += makeStore('D2', 'Products DB (products table)', 680, 380, 260, 48);
  svg += makeStore('D3', 'Categories DB (categories)', 680, 470, 260, 48);
  svg += makeStore('D4', 'Orders DB (cc_orders)', 680, 670, 260, 48);
  svg += makeStore('D5', 'Handover OTPs DB (cc_otps)', 680, 760, 260, 48);
  svg += makeStore('D6', 'Reports &amp; Wishlist DB', 680, 850, 260, 48);

  // ================= DATA FLOW ARROWS =================
  // Process 1.0 (Auth)
  svg += `
  <!-- Buyer -> 1.0 -->
  <path d="M 220 420 L 300 370" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="210" y="380" width="95" height="18" class="flow-text-bg"/>
  <text x="257" y="393" class="flow-text" text-anchor="middle">Credentials</text>

  <!-- 1.0 -> D1 (Write/Read User) -->
  <path d="M 510 330 L 680 315" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="545" y="310" width="105" height="18" class="flow-text-bg"/>
  <text x="597" y="323" class="flow-text" text-anchor="middle">Verify / Save User</text>

  <!-- 1.0 -> Buyer (Token) -->
  <path d="M 300 390 L 220 440" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="220" y="420" width="85" height="18" class="flow-text-bg"/>
  <text x="262" y="433" class="flow-text" text-anchor="middle">JWT Session</text>

  <!-- Seller -> 1.0 (Seller Auth) -->
  <path d="M 1460 410 Q 1150 250 510 320" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="940" y="245" width="120" height="18" class="flow-text-bg"/>
  <text x="1000" y="258" class="flow-text" text-anchor="middle">Seller Login Auth</text>
  `;

  // Process 2.0 (Product Manage)
  svg += `
  <!-- Seller -> 2.0 -->
  <path d="M 1460 440 L 1380 370" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1375" y="390" width="95" height="18" class="flow-text-bg"/>
  <text x="1422" y="403" class="flow-text" text-anchor="middle">Product Specs</text>

  <!-- 2.0 -> D2 (Save Product) -->
  <path d="M 1170 340 L 940 395" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1005" y="355" width="125" height="18" class="flow-text-bg"/>
  <text x="1067" y="368" class="flow-text" text-anchor="middle">Insert / Update Item</text>

  <!-- 2.0 -> Seller (Confirmation) -->
  <path d="M 1380 390 L 1460 460" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1375" y="435" width="95" height="18" class="flow-text-bg"/>
  <text x="1422" y="448" class="flow-text" text-anchor="middle">Listing Active</text>
  `;

  // Process 3.0 (Search & Browse)
  svg += `
  <!-- Buyer -> 3.0 (Search Query) -->
  <path d="M 220 520 L 300 535" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="225" y="515" width="75" height="18" class="flow-text-bg"/>
  <text x="262" y="528" class="flow-text" text-anchor="middle">Keywords</text>

  <!-- D2 -> 3.0 (Read Products) -->
  <path d="M 680 415 Q 520 440 440 500" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="520" y="435" width="105" height="18" class="flow-text-bg"/>
  <text x="572" y="448" class="flow-text" text-anchor="middle">Active Inventory</text>

  <!-- 3.0 -> Buyer (Results) -->
  <path d="M 300 565 L 220 550" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="220" y="565" width="85" height="18" class="flow-text-bg"/>
  <text x="262" y="578" class="flow-text" text-anchor="middle">Filtered Cards</text>
  `;

  // Process 4.0 (Order & UPI QR)
  svg += `
  <!-- Buyer -> 4.0 (Place Order) -->
  <path d="M 220 600 Q 420 620 620 565" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="360" y="595" width="130" height="18" class="flow-text-bg"/>
  <text x="425" y="608" class="flow-text" text-anchor="middle">Order Req (Payment Type)</text>

  <!-- 4.0 -> D4 (Create Order) -->
  <path d="M 730 595 L 730 670" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="670" y="625" width="85" height="18" class="flow-text-bg"/>
  <text x="712" y="638" class="flow-text" text-anchor="middle">Save Order</text>

  <!-- 4.0 -> D5 (Save Hashed OTP) -->
  <path d="M 760 595 Q 760 740 760 760" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="765" y="690" width="90" height="18" class="flow-text-bg"/>
  <text x="810" y="703" class="flow-text" text-anchor="middle">Store 6-Digit OTP</text>

  <!-- 4.0 -> Buyer (Display Handover OTP & QR) -->
  <path d="M 620 535 Q 400 510 220 630" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="340" y="525" width="145" height="18" class="flow-text-bg"/>
  <text x="412" y="538" class="flow-text" text-anchor="middle">UPI QR &amp; Handover OTP</text>
  `;

  // Process 5.0 (Handover & Verification)
  svg += `
  <!-- Seller -> 5.0 (Input OTP) -->
  <path d="M 1460 620 Q 1250 560 1180 545" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1270" y="565" width="125" height="18" class="flow-text-bg"/>
  <text x="1332" y="578" class="flow-text" text-anchor="middle">Submit Buyer OTP</text>

  <!-- 5.0 <-> D5 (Verify OTP match) -->
  <path d="M 980 595 Q 960 760 940 780" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="945" y="690" width="95" height="18" class="flow-text-bg"/>
  <text x="992" y="703" class="flow-text" text-anchor="middle">Match OTP Hash</text>

  <!-- 5.0 -> D4 (Update Order = COMPLETED) -->
  <path d="M 960 560 Q 880 620 850 670" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="860" y="615" width="115" height="18" class="flow-text-bg"/>
  <text x="917" y="628" class="flow-text" text-anchor="middle">Order COMPLETED</text>

  <!-- 5.0 -> D2 (Mark Product = SOLD) -->
  <path d="M 990 500 Q 950 430 940 415" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="965" y="445" width="105" height="18" class="flow-text-bg"/>
  <text x="1017" y="458" class="flow-text" text-anchor="middle">Product SOLD</text>

  <!-- 5.0 -> Seller (Verification Success) -->
  <path d="M 1180 565 Q 1280 640 1460 655" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1260" y="625" width="135" height="18" class="flow-text-bg"/>
  <text x="1327" y="638" class="flow-text" text-anchor="middle">Handover Verified (Sold)</text>
  `;

  // Process 6.0 (CartMate AI)
  svg += `
  <!-- Buyer -> 6.0 -->
  <path d="M 220 700 L 300 735" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="220" y="710" width="85" height="18" class="flow-text-bg"/>
  <text x="262" y="723" class="flow-text" text-anchor="middle">Chat Question</text>

  <!-- 6.0 <-> Entity Gemini AI -->
  <path d="M 330 710 L 330 240" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="260" y="270" width="95" height="18" class="flow-text-bg"/>
  <text x="307" y="283" class="flow-text" text-anchor="middle">Prompt Context</text>

  <path d="M 370 240 L 370 710" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="375" y="270" width="95" height="18" class="flow-text-bg"/>
  <text x="422" y="283" class="flow-text" text-anchor="middle">AI Recommendation</text>

  <!-- 6.0 -> Buyer -->
  <path d="M 300 770 L 220 735" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="220" y="760" width="85" height="18" class="flow-text-bg"/>
  <text x="262" y="773" class="flow-text" text-anchor="middle">CartMate Reply</text>
  `;

  // Process 7.0 (Safety / Wishlist / Admin)
  svg += `
  <!-- Buyer -> 7.0 (Wishlist & Report) -->
  <path d="M 220 770 Q 700 950 1170 775" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="580" y="895" width="145" height="18" class="flow-text-bg"/>
  <text x="652" y="908" class="flow-text" text-anchor="middle">Toggle Wishlist / Report Fraud</text>

  <!-- 7.0 -> D6 (Store Report) -->
  <path d="M 1170 750 Q 1000 860 940 865" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="990" y="810" width="115" height="18" class="flow-text-bg"/>
  <text x="1047" y="823" class="flow-text" text-anchor="middle">Log Fraud / Flag</text>

  <!-- Admin <-> 7.0 -->
  <path d="M 1260 240 L 1260 710" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1265" y="270" width="105" height="18" class="flow-text-bg"/>
  <text x="1317" y="283" class="flow-text" text-anchor="middle">Moderate / Remove</text>
  `;

  // Notation Key
  svg += `
  <!-- Legend Box (Bottom Left) -->
  <g id="legend">
    <rect x="55" y="840" width="225" height="225" class="table-border"/>
    <text x="167" y="865" class="proc-name" font-size="12">GANE-SARSON DFD KEY</text>
    <line x1="65" y1="875" x2="270" y2="875" stroke="#000" stroke-width="1"/>
    
    <!-- Process -->
    <rect x="75" y="890" width="40" height="25" rx="4" ry="4" fill="#fff" stroke="#000" stroke-width="1.8"/>
    <line x1="75" y1="898" x2="115" y2="898" stroke="#000" stroke-width="1.2"/>
    <text x="125" y="907" class="proc-sub" text-anchor="start">Process (ID + Name)</text>

    <!-- Entity -->
    <rect x="75" y="930" width="40" height="25" fill="#f4f4f4" stroke="#000" stroke-width="1.8"/>
    <line x1="75" y1="937" x2="115" y2="937" stroke="#000" stroke-width="1.2"/>
    <text x="125" y="947" class="proc-sub" text-anchor="start">External Entity</text>

    <!-- Data Store -->
    <line x1="75" y1="980" x2="115" y2="980" stroke="#000" stroke-width="2"/>
    <line x1="75" y1="995" x2="115" y2="995" stroke="#000" stroke-width="2"/>
    <line x1="88" y1="980" x2="88" y2="995" stroke="#000" stroke-width="1.5"/>
    <text x="125" y="991" class="proc-sub" text-anchor="start">Data Store (Open Rect)</text>

    <!-- Arrow -->
    <line x1="75" y1="1030" x2="115" y2="1030" stroke="#000" stroke-width="1.8" marker-end="url(#arrow)"/>
    <text x="125" y="1034" class="proc-sub" text-anchor="start">Data Flow Arrow</text>
  </g>
  </svg>`;
  return svg;
}

// -------------------------------------------------------------
// 3. DFD LEVEL 2 (DECOMPOSED: ORDER, UPI PAYMENT & HANDOVER OTP)
// -------------------------------------------------------------
function buildDfdLevel2() {
  const W = 1684;
  const H = 1190;
  let svg = getSvgHeader(W, H, 'DATA FLOW DIAGRAM (DFD) — LEVEL 2', 'Sub-Process Decomposition of Process 4.0 & 5.0 (Peer-to-Peer Order, UPI QR & Handover OTP)', 'Level 2 Decomposition');

  // Gane-Sarson Process Helper
  function makeProcess(id, name1, name2, x, y, w = 190, h = 95) {
    return `
    <g id="p-${id.replace('.', '-')}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" class="proc-gane"/>
      <path d="M ${x} ${y + 28} L ${x + w} ${y + 28}" stroke="#000" stroke-width="1.8"/>
      <path d="M ${x} ${y + 28} L ${x} ${y + 12} Q ${x} ${y} ${x + 12} ${y} L ${x + w - 12} ${y} Q ${x + w} ${y} ${x + w} ${y + 12} L ${x + w} ${y + 28} Z" fill="#e8e8e8"/>
      <text x="${x + w / 2}" y="${y + 19}" class="proc-id">${id}</text>
      <text x="${x + w / 2}" y="${y + 55}" class="proc-name">${name1}</text>
      <text x="${x + w / 2}" y="${y + 75}" class="proc-name">${name2}</text>
    </g>`;
  }

  function makeStore(id, name, x, y, w = 240, h = 48) {
    return `
    <g id="store-${id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fdfdfd"/>
      <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" class="store-line"/>
      <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" class="store-line"/>
      <line x1="${x + 45}" y1="${y}" x2="${x + 45}" y2="${y + h}" stroke="#000" stroke-width="1.8"/>
      <text x="${x + 22}" y="${y + 29}" class="store-id" text-anchor="middle">${id}</text>
      <text x="${x + 58}" y="${y + 29}" class="store-name" text-anchor="start">${name}</text>
    </g>`;
  }

  // Entities
  svg += `
  <!-- External Entity: Student Buyer [Left] -->
  <g id="entity-buyer">
    <rect x="55" y="360" width="175" height="420" class="box-entity"/>
    <rect x="55" y="360" width="175" height="42" class="box-entity-header"/>
    <text x="142" y="387" class="entity-title" font-size="13">STUDENT (BUYER)</text>
    <text x="70" y="425" class="proc-sub" text-anchor="start" font-weight="bold">Order Sub-Steps:</text>
    <text x="70" y="455" class="proc-sub" text-anchor="start">1. Initiate Buy Intent</text>
    <text x="70" y="485" class="proc-sub" text-anchor="start">2. Select Meetup Point</text>
    <text x="70" y="505" class="proc-sub" text-anchor="start">   (Library, Canteen)</text>
    <text x="70" y="535" class="proc-sub" text-anchor="start">3. Choose Payment Mode</text>
    <text x="70" y="555" class="proc-sub" text-anchor="start">   (Cash / UPI QR)</text>
    <text x="70" y="585" class="proc-sub" text-anchor="start">4. Scan Live UPI QR Code</text>
    <text x="70" y="615" class="proc-sub" text-anchor="start">5. Receive 6-Digit OTP</text>
    <text x="70" y="645" class="proc-sub" text-anchor="start">6. Inspect Item at AKS</text>
    <text x="70" y="675" class="proc-sub" text-anchor="start">7. Reveal OTP to Seller</text>
    <text x="70" y="705" class="proc-sub" text-anchor="start">8. Receive Order Success</text>
  </g>

  <!-- External Entity: Student Seller [Right] -->
  <g id="entity-seller">
    <rect x="1454" y="360" width="175" height="420" class="box-entity"/>
    <rect x="1454" y="360" width="175" height="42" class="box-entity-header"/>
    <text x="1541" y="387" class="entity-title" font-size="13">STUDENT (SELLER)</text>
    <text x="1469" y="425" class="proc-sub" text-anchor="start" font-weight="bold">Verification Sub-Steps:</text>
    <text x="1469" y="455" class="proc-sub" text-anchor="start">1. Receive Order Alert</text>
    <text x="1469" y="485" class="proc-sub" text-anchor="start">2. Carry Item to Spot</text>
    <text x="1469" y="515" class="proc-sub" text-anchor="start">3. Show Product to Buyer</text>
    <text x="1469" y="545" class="proc-sub" text-anchor="start">4. Receive Cash / UPI</text>
    <text x="1469" y="575" class="proc-sub" text-anchor="start">5. Ask Buyer for OTP</text>
    <text x="1469" y="605" class="proc-sub" text-anchor="start">6. Open Verify Portal</text>
    <text x="1469" y="635" class="proc-sub" text-anchor="start">7. Submit 6-Digit OTP</text>
    <text x="1469" y="665" class="proc-sub" text-anchor="start">8. Item Status -> SOLD</text>
    <text x="1469" y="695" class="proc-sub" text-anchor="start">9. Transaction Complete</text>
  </g>
  `;

  // Draw 6 Sub-processes of 4.0 / 5.0
  // 4.1 Validate Buyer & Session
  svg += makeProcess('4.1', 'Validate Buyer Session', '&amp; Self-Purchase Guard', 300, 240, 210, 95);

  // 4.2 Check Stock & Lock Product
  svg += makeProcess('4.2', 'Verify Availability', '&amp; Hold Lock', 620, 240, 210, 95);

  // 4.3 Generate Cryptographic Handover OTP
  svg += makeProcess('4.3', 'Generate 6-Digit OTP', '&amp; Bcrypt Storage', 940, 240, 210, 95);

  // 4.4 In-Memory UPI QR Generator
  svg += makeProcess('4.4', 'Dynamic UPI QR Code', '&amp; Intent String Engine', 300, 520, 210, 95);

  // 4.5 Physical Handover & Delivery Check
  svg += makeProcess('4.5', 'Physical Handover', '&amp; Campus Delivery Check', 620, 520, 210, 95);

  // 4.6 Handover OTP Match & Final Settlement
  svg += makeProcess('4.6', 'Verify OTP Match &amp;', 'Mark Listing SOLD', 940, 520, 210, 95);

  // Draw Data Stores involved
  svg += makeStore('D1', 'Users DB (Buyer/Seller Accounts)', 300, 400, 250, 48);
  svg += makeStore('D2', 'Products DB (Inventory &amp; Status)', 600, 400, 250, 48);
  svg += makeStore('D4', 'Orders DB (cc_orders Table)', 900, 400, 250, 48);
  svg += makeStore('D5', 'Handover OTPs DB (cc_otps)', 600, 700, 250, 48);

  // ================= DATA FLOW ARROWS =================
  svg += `
  <!-- Buyer -> 4.1 -->
  <path d="M 230 400 L 300 290" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="220" y="325" width="105" height="18" class="flow-text-bg"/>
  <text x="272" y="338" class="flow-text" text-anchor="middle">Order Req + Token</text>

  <!-- 4.1 <-> D1 -->
  <path d="M 380 335 L 380 400" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="330" y="360" width="100" height="18" class="flow-text-bg"/>
  <text x="380" y="373" class="flow-text" text-anchor="middle">Verify Student ID</text>

  <!-- 4.1 -> 4.2 -->
  <path d="M 510 287 L 620 287" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="525" y="275" width="80" height="18" class="flow-text-bg"/>
  <text x="565" y="288" class="flow-text" text-anchor="middle">Buyer Valid</text>

  <!-- 4.2 <-> D2 -->
  <path d="M 700 335 L 700 400" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="635" y="360" width="130" height="18" class="flow-text-bg"/>
  <text x="700" y="373" class="flow-text" text-anchor="middle">Status = 'available'?</text>

  <!-- 4.2 -> 4.3 -->
  <path d="M 830 287 L 940 287" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="845" y="275" width="80" height="18" class="flow-text-bg"/>
  <text x="885" y="288" class="flow-text" text-anchor="middle">Item Ready</text>

  <!-- 4.3 -> D4 (Create Order) -->
  <path d="M 980 335 L 980 400" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="915" y="360" width="130" height="18" class="flow-text-bg"/>
  <text x="980" y="373" class="flow-text" text-anchor="middle">Insert Order Record</text>

  <!-- 4.3 -> D5 (Save Hashed OTP) -->
  <path d="M 1040 335 Q 1120 540 850 710" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1000" y="470" width="140" height="18" class="flow-text-bg"/>
  <text x="1070" y="483" class="flow-text" text-anchor="middle">Store OTP + Expiration</text>

  <!-- 4.3 -> 4.4 (Generate Dynamic UPI QR) -->
  <path d="M 940 310 Q 550 350 480 520" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="520" y="330" width="140" height="18" class="flow-text-bg"/>
  <text x="590" y="343" class="flow-text" text-anchor="middle">Trigger UPI Intent / Cash</text>

  <!-- 4.4 -> Buyer (Display Handover OTP & UPI QR Modal) -->
  <path d="M 300 570 L 230 550" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="235" y="580" width="135" height="18" class="flow-text-bg"/>
  <text x="302" y="593" class="flow-text" text-anchor="middle">QR Code + 6-Digit OTP</text>

  <!-- Buyer -> 4.5 (Shows OTP at Meetup) -->
  <path d="M 230 630 Q 420 630 620 580" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="360" y="630" width="180" height="18" class="flow-text-bg"/>
  <text x="450" y="643" class="flow-text" text-anchor="middle">Buyer Shows OTP to Seller</text>

  <!-- Seller -> 4.6 (Enters OTP on Portal) -->
  <path d="M 1454 580 L 1150 560" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1230" y="550" width="150" height="18" class="flow-text-bg"/>
  <text x="1305" y="563" class="flow-text" text-anchor="middle">Seller Submits 6-Digit OTP</text>

  <!-- 4.6 <-> D5 (Verify OTP correctness) -->
  <path d="M 970 615 L 850 710" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="880" y="650" width="115" height="18" class="flow-text-bg"/>
  <text x="937" y="663" class="flow-text" text-anchor="middle">Validate OTP Hash</text>

  <!-- 4.6 -> D4 (Order = COMPLETED) -->
  <path d="M 1010 520 L 1010 448" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1015" y="475" width="105" height="18" class="flow-text-bg"/>
  <text x="1067" y="488" class="flow-text" text-anchor="middle">Order COMPLETED</text>

  <!-- 4.6 -> D2 (Product = SOLD) -->
  <path d="M 940 540 Q 820 500 780 448" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="810" y="485" width="105" height="18" class="flow-text-bg"/>
  <text x="862" y="498" class="flow-text" text-anchor="middle">Set Status = 'SOLD'</text>

  <!-- 4.6 -> Seller (Success Receipt) -->
  <path d="M 1150 590 L 1454 640" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="1240" y="615" width="145" height="18" class="flow-text-bg"/>
  <text x="1312" y="628" class="flow-text" text-anchor="middle">Order Closed &amp; Verified</text>

  <!-- 4.6 -> Buyer (Notification) -->
  <path d="M 940 600 Q 600 780 230 730" class="flow-arrow" marker-end="url(#arrow)"/>
  <rect x="480" y="750" width="155" height="18" class="flow-text-bg"/>
  <text x="557" y="763" class="flow-text" text-anchor="middle">Purchase Receipt Delivered</text>
  `;

  // Explanatory Note Box (Bottom)
  svg += `
  <g id="flow-notes">
    <rect x="300" y="830" width="850" height="170" class="table-border"/>
    <text x="725" y="855" class="proc-name" font-size="13">CAMPUSCART P2P HANDOVER SECURITY LIFECYCLE (EXPLANATION FOR REPORT)</text>
    <line x1="315" y1="865" x2="1135" y2="865" stroke="#000" stroke-width="1"/>
    <text x="320" y="890" class="proc-sub" text-anchor="start"><tspan font-weight="bold">Step 1 (Order Placement):</tspan> Buyer browses catalog and places order. System immediately generates a random 6-digit Handover OTP.</text>
    <text x="320" y="915" class="proc-sub" text-anchor="start"><tspan font-weight="bold">Step 2 (Instant UPI QR):</tspan> Dynamic in-memory SVG QR Code generated with Seller's UPI ID. Buyer can scan or opt for physical cash.</text>
    <text x="320" y="940" class="proc-sub" text-anchor="start"><tspan font-weight="bold">Step 3 (Campus Physical Meetup):</tspan> Buyer meets Seller at designated campus location (e.g., Central Library Lawn) and inspects item.</text>
    <text x="320" y="965" class="proc-sub" text-anchor="start"><tspan font-weight="bold">Step 4 (Zero-Fraud Verification):</tspan> Only after physical satisfaction, Buyer shares the 6-digit OTP. Seller enters it on portal.</text>
    <text x="320" y="990" class="proc-sub" text-anchor="start"><tspan font-weight="bold">Step 5 (Atomic State Transition):</tspan> Hash match triggers atomic update: Order marked COMPLETED and Product status set to SOLD.</text>
  </g>
  </svg>`;
  return svg;
}

// -------------------------------------------------------------
// HTML Viewer / Exporter Template
// -------------------------------------------------------------
function makeHtmlViewer(svgContent, levelName, filenameBase) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusCart DFD — ${levelName} (A3 Landscape)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #2b2d42;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      min-height: 100vh;
    }
    .top-bar {
      background: #ffffff;
      padding: 16px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1400px;
      gap: 15px;
    }
    .info h1 {
      font-size: 20px;
      color: #111;
      font-weight: 700;
    }
    .info p {
      font-size: 13px;
      color: #666;
      margin-top: 4px;
    }
    .btn-group {
      display: flex;
      gap: 10px;
    }
    button, a.btn {
      background: #111827;
      color: #ffffff;
      border: 1px solid #374151;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    button:hover, a.btn:hover {
      background: #2563eb;
      border-color: #2563eb;
      transform: translateY(-1px);
    }
    button.primary {
      background: #059669;
      border-color: #059669;
    }
    button.primary:hover {
      background: #10b981;
    }
    .canvas-container {
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      border-radius: 4px;
      width: 100%;
      max-width: 1400px;
      overflow: hidden;
      border: 1px solid #d1d5db;
    }
    .svg-wrapper {
      width: 100%;
      height: auto;
      display: block;
    }
    .svg-wrapper svg {
      width: 100%;
      height: auto;
      display: block;
    }
    @media print {
      body { background: white; padding: 0; }
      .top-bar { display: none; }
      .canvas-container { box-shadow: none; border: none; max-width: 100%; }
      @page {
        size: A3 landscape;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="info">
      <h1>CampusCart DFD — ${levelName}</h1>
      <p>B&amp;W Engineering Report Diagram • A3 Landscape (420mm × 297mm) • Presenter: Riya Kumari Soni</p>
    </div>
    <div class="btn-group">
      <button class="primary" onclick="downloadPng()">💾 Download High-Res PNG (A3)</button>
      <a class="btn" href="${filenameBase}.svg" download="${filenameBase}.svg">📥 Download Scalable SVG</a>
      <button onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>
  </div>

  <div class="canvas-container">
    <div class="svg-wrapper" id="svg-container">
      ${svgContent}
    </div>
  </div>

  <canvas id="export-canvas" style="display:none;"></canvas>

  <script>
    function downloadPng() {
      const svgElement = document.querySelector('#svg-container svg');
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      if(!source.match(/^<svg[^>]+xmlns="http:\\/\\/www\\.w3\\.org\\/2000\\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      // High-res A3 dimensions (300 DPI: 4961 x 3508, or 2x 1684x1190 = 3368 x 2380)
      const targetWidth = 3368;
      const targetHeight = 2380;

      img.onload = function() {
        const canvas = document.getElementById('export-canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = '${filenameBase}.png';
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = url;
    }
  </script>
</body>
</html>`;
}

// -------------------------------------------------------------
// MAIN GENERATION
// -------------------------------------------------------------
console.log('Generating CampusCart DFD Diagrams...');

// 1. Level 0
const svg0 = buildDfdLevel0();
const file0Svg = path.join(OUTPUT_DIR, 'DFD_Level_0_Context_Diagram.svg');
const file0Html = path.join(OUTPUT_DIR, 'DFD_Level_0_Context_Diagram.html');
fs.writeFileSync(file0Svg, svg0, 'utf8');
fs.writeFileSync(file0Html, makeHtmlViewer(svg0, 'Level 0: Context Diagram', 'DFD_Level_0_Context_Diagram'), 'utf8');
console.log('✓ Generated DFD Level 0 SVG & HTML');

// 2. Level 1
const svg1 = buildDfdLevel1();
const file1Svg = path.join(OUTPUT_DIR, 'DFD_Level_1_Major_Processes.svg');
const file1Html = path.join(OUTPUT_DIR, 'DFD_Level_1_Major_Processes.html');
fs.writeFileSync(file1Svg, svg1, 'utf8');
fs.writeFileSync(file1Html, makeHtmlViewer(svg1, 'Level 1: Major Processes', 'DFD_Level_1_Major_Processes'), 'utf8');
console.log('✓ Generated DFD Level 1 SVG & HTML');

// 3. Level 2
const svg2 = buildDfdLevel2();
const file2Svg = path.join(OUTPUT_DIR, 'DFD_Level_2_Order_Handover_OTP.svg');
const file2Html = path.join(OUTPUT_DIR, 'DFD_Level_2_Order_Handover_OTP.html');
fs.writeFileSync(file2Svg, svg2, 'utf8');
fs.writeFileSync(file2Html, makeHtmlViewer(svg2, 'Level 2: Order, UPI & Handover OTP', 'DFD_Level_2_Order_Handover_OTP'), 'utf8');
console.log('✓ Generated DFD Level 2 SVG & HTML');

// Master Index Page
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampusCart — DFD Diagrams Portal (A3 B&W Report)</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .container { max-width: 1000px; margin: 0 auto; }
    h1 { font-size: 28px; margin-bottom: 8px; color: #38bdf8; }
    p.lead { font-size: 15px; color: #94a3b8; margin-bottom: 30px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: #38bdf8; }
    .tag { display: inline-block; padding: 4px 10px; background: #0284c7; color: white; border-radius: 999px; font-size: 11px; font-weight: bold; margin-bottom: 12px; }
    .card h2 { font-size: 18px; margin-bottom: 8px; color: #f1f5f9; }
    .card p { font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 20px; }
    .btn-row { display: flex; flex-direction: column; gap: 8px; }
    a.action-btn { display: block; text-align: center; padding: 10px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; }
    .btn-view { background: #0ea5e9; color: white; }
    .btn-view:hover { background: #0284c7; }
    .btn-svg { background: #334155; color: #f1f5f9; }
    .btn-svg:hover { background: #475569; }
    .footer { margin-top: 40px; text-align: center; font-size: 13px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📐 CampusCart — Project DFD Diagrams (A3 Size)</h1>
    <p class="lead">Complete set of Black &amp; White Data Flow Diagrams prepared for Academic Project Report submission &amp; External Viva Examination at AKS University.</p>

    <div class="cards">
      <!-- Card 0 -->
      <div class="card">
        <span class="tag">LEVEL 0</span>
        <h2>Context Level Diagram</h2>
        <p>Depicts the entire CampusCart platform as a single central system interacting with 4 External Entities: Buyer, Seller, CartMate AI &amp; Admin.</p>
        <div class="btn-row">
          <a class="action-btn btn-view" href="DFD_Level_0_Context_Diagram.html" target="_blank">🔍 Open &amp; Download PNG</a>
          <a class="action-btn btn-svg" href="DFD_Level_0_Context_Diagram.svg" download>📥 Download Vector SVG</a>
        </div>
      </div>

      <!-- Card 1 -->
      <div class="card">
        <span class="tag">LEVEL 1</span>
        <h2>Major Processes Diagram</h2>
        <p>Decomposes the system into 7 major functional modules (Auth, Product Manage, Browse, Orders, Handover OTP, AI Chat, Safety) &amp; 6 Data Stores.</p>
        <div class="btn-row">
          <a class="action-btn btn-view" href="DFD_Level_1_Major_Processes.html" target="_blank">🔍 Open &amp; Download PNG</a>
          <a class="action-btn btn-svg" href="DFD_Level_1_Major_Processes.svg" download>📥 Download Vector SVG</a>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="card">
        <span class="tag">LEVEL 2</span>
        <h2>Order, UPI &amp; Handover OTP</h2>
        <p>Deep-dive into Process 4.0 &amp; 5.0: The novel peer-to-peer secure transaction protocol, in-memory UPI QR generator, and atomic Handover OTP verification.</p>
        <div class="btn-row">
          <a class="action-btn btn-view" href="DFD_Level_2_Order_Handover_OTP.html" target="_blank">🔍 Open &amp; Download PNG</a>
          <a class="action-btn btn-svg" href="DFD_Level_2_Order_Handover_OTP.svg" download>📥 Download Vector SVG</a>
        </div>
      </div>
    </div>

    <div class="footer">
      <strong>CampusCart Project</strong> • Riya Kumari Soni (B2455R101A1020) • Guide: Mr. Anmol Dubey (IBM Expert) • HOD: Dr. C.D. Gautam
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml, 'utf8');
console.log('✓ Generated Master DFD Portal (index.html)');
