// generate_er_diagrams.cjs
// Generates 2 Ultra-Clear, Compact, Academic-Report-Ready ER Diagrams for CampusCart:
// 1. ER_Diagram_Schema_CrowsFoot.png (Database Logical/Physical Schema - Crow's Foot PK/FK)
// 2. ER_Diagram_Conceptual_Chen.png (Classic Chen Notation - Entities, Diamonds, Attributes)
// Rendered at 2x Retina resolution via Chrome headless (Zero Blur).

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT_DIR = path.join(__dirname, 'dfd-diagrams');
const ARTIFACT_DIR = 'C:\\Users\\shita\\.gemini\\antigravity\\brain\\bda58eda-eb11-4a37-896f-edd0f9ae8388';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// -------------------------------------------------------------
// 1. DATABASE SCHEMA ER DIAGRAM (CROW'S FOOT NOTATION)
// -------------------------------------------------------------
function buildSchemaErSvg() {
  const w = 1160;
  const h = 820;

  function drawTable(name, x, y, width, rows) {
    const rowH = 23;
    const headH = 34;
    const totalH = headH + rows.length * rowH + 8;

    let rowsSvg = '';
    rows.forEach((r, idx) => {
      const ry = y + headH + idx * rowH;
      const bg = idx % 2 === 1 ? '#f8fafc' : '#ffffff';
      let badge = '';
      if (r.key === 'PK') {
        badge = `<rect x="${x + 8}" y="${ry + 4}" width="24" height="15" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/><text x="${x + 20}" y="${ry + 15}" font-size="10px" font-weight="bold" fill="#854d0e" text-anchor="middle">PK</text>`;
      } else if (r.key === 'FK') {
        badge = `<rect x="${x + 8}" y="${ry + 4}" width="24" height="15" rx="3" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/><text x="${x + 20}" y="${ry + 15}" font-size="10px" font-weight="bold" fill="#1e40af" text-anchor="middle">FK</text>`;
      } else if (r.key === 'UQ') {
        badge = `<rect x="${x + 8}" y="${ry + 4}" width="24" height="15" rx="3" fill="#f3e8ff" stroke="#9333ea" stroke-width="1"/><text x="${x + 20}" y="${ry + 15}" font-size="10px" font-weight="bold" fill="#6b21a8" text-anchor="middle">UQ</text>`;
      }

      const nameWeight = r.key === 'PK' ? 'bold' : '600';
      const nameColor = r.key === 'PK' ? '#0f172a' : '#1e293b';

      rowsSvg += `
      <rect x="${x + 1}" y="${ry}" width="${width - 2}" height="${rowH}" fill="${bg}"/>
      ${badge}
      <text x="${x + 38}" y="${ry + 16}" font-size="12px" font-weight="${nameWeight}" fill="${nameColor}">${r.col}</text>
      <text x="${x + width - 10}" y="${ry + 16}" font-size="11px" fill="#64748b" text-anchor="end" font-family="monospace">${r.type}</text>`;
    });

    return `
    <g id="tbl-${name}">
      <rect x="${x}" y="${y}" width="${width}" height="${totalH}" rx="6" ry="6" fill="#ffffff" stroke="#0f172a" stroke-width="2.2"/>
      <rect x="${x}" y="${y}" width="${width}" height="${headH}" rx="6" ry="6" fill="#0f172a"/>
      <rect x="${x}" y="${y + 18}" width="${width}" height="${headH - 18}" fill="#0f172a"/>
      <text x="${x + width / 2}" y="${y + 22}" font-size="14px" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="0.5px">${name.toUpperCase()}</text>
      ${rowsSvg}
      <rect x="${x}" y="${y}" width="${width}" height="${totalH}" rx="6" ry="6" fill="none" stroke="#0f172a" stroke-width="2.2"/>
    </g>`;
  }

  function relLabel(x, y, text) {
    const bw = text.length * 7.5 + 16;
    return `
    <rect x="${x - bw / 2}" y="${y - 11}" width="${bw}" height="22" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="1"/>
    <text x="${x}" y="${y + 4}" font-size="11.5px" font-weight="bold" fill="#0f172a" text-anchor="middle">${text}</text>`;
  }

  const tablesSvg = [
    drawTable('users', 450, 95, 250, [
      { key: 'PK', col: 'user_id', type: 'INT' },
      { key: '', col: 'full_name', type: 'VARCHAR(100)' },
      { key: 'UQ', col: 'email', type: 'VARCHAR(150)' },
      { key: '', col: 'password_hash', type: 'VARCHAR(255)' },
      { key: '', col: 'college, branch', type: 'VARCHAR' },
      { key: '', col: 'semester', type: 'INT' },
      { key: '', col: 'is_verified, role', type: 'TINYINT / STR' },
    ]),
    drawTable('categories', 45, 115, 230, [
      { key: 'PK', col: 'category_id', type: 'INT' },
      { key: 'UQ', col: 'category_name', type: 'VARCHAR(100)' },
      { key: '', col: 'created_at', type: 'TIMESTAMP' },
    ]),
    drawTable('products', 450, 345, 250, [
      { key: 'PK', col: 'product_id', type: 'INT' },
      { key: 'FK', col: 'seller_id', type: 'INT' },
      { key: '', col: 'product_name', type: 'VARCHAR(150)' },
      { key: '', col: 'category', type: 'VARCHAR(100)' },
      { key: '', col: 'price, orig_price', type: 'DECIMAL' },
      { key: '', col: 'product_condition', type: 'VARCHAR(50)' },
      { key: '', col: 'status (avail/sold)', type: 'VARCHAR(20)' },
      { key: '', col: 'image_url', type: 'VARCHAR(255)' },
    ]),
    drawTable('cc_orders', 855, 115, 260, [
      { key: 'PK', col: 'id', type: 'BIGINT' },
      { key: 'UQ', col: 'order_id', type: 'VARCHAR(64)' },
      { key: 'FK', col: 'product_id', type: 'INT' },
      { key: 'FK', col: 'buyer_id', type: 'INT' },
      { key: 'FK', col: 'seller_id', type: 'INT' },
      { key: '', col: 'amount', type: 'DECIMAL' },
      { key: '', col: 'payment_method', type: 'VARCHAR' },
      { key: '', col: 'status, otp_hash', type: 'VARCHAR' },
    ]),
    drawTable('cc_handover_otps', 855, 415, 260, [
      { key: 'PK', col: 'id', type: 'BIGINT' },
      { key: 'FK', col: 'product_id', type: 'INT' },
      { key: 'FK', col: 'buyer_id, seller_id', type: 'INT' },
      { key: '', col: 'otp_hash', type: 'VARCHAR(255)' },
      { key: '', col: 'expires_at', type: 'DATETIME' },
      { key: '', col: 'attempts, completed', type: 'INT / BOOL' },
    ]),
    drawTable('cc_wishlists', 45, 315, 230, [
      { key: 'PK', col: 'id', type: 'BIGINT' },
      { key: 'FK', col: 'user_id', type: 'INT' },
      { key: 'FK', col: 'product_id', type: 'INT' },
      { key: '', col: 'created_at', type: 'TIMESTAMP' },
    ]),
    drawTable('cc_product_reports', 45, 515, 240, [
      { key: 'PK', col: 'id', type: 'BIGINT' },
      { key: 'FK', col: 'product_id', type: 'INT' },
      { key: 'FK', col: 'reporter_id', type: 'INT' },
      { key: '', col: 'reason, details', type: 'TEXT' },
      { key: '', col: 'status', type: 'VARCHAR(30)' },
    ]),
    drawTable('cc_chat_messages', 450, 615, 250, [
      { key: 'PK', col: 'id', type: 'BIGINT' },
      { key: '', col: 'room_id', type: 'VARCHAR(200)' },
      { key: 'FK', col: 'product_id', type: 'INT' },
      { key: 'FK', col: 'sender_id, rec_id', type: 'INT' },
      { key: '', col: 'message, created_at', type: 'TEXT' },
    ]),
  ].join('');

  // Orthogonal Relationship Lines with Crow's Foot Markers
  const linesSvg = `
    <!-- 1. users (1) -> products (N) -->
    <path d="M 575 298 L 575 345" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(575, 322, '1 : N Lists')}

    <!-- 2. categories (1) -> products (N) -->
    <path d="M 275 170 L 345 170 L 345 385 L 450 385" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(345, 275, '1 : N Categorizes')}

    <!-- 3. users (1) -> cc_orders (N) -->
    <path d="M 700 180 L 855 180" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(777, 180, '1 : N Places / Sells')}

    <!-- 4. products (1) -> cc_orders (N) -->
    <path d="M 700 410 L 780 410 L 780 250 L 855 250" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(780, 330, '1 : N Ordered')}

    <!-- 5. cc_orders (1) -> cc_handover_otps (1) -->
    <path d="M 985 341 L 985 415" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#one)"/>
    ${relLabel(985, 378, '1 : 1 Verifies')}

    <!-- 6. products (1) -> cc_handover_otps (N) -->
    <path d="M 700 490 L 855 490" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(777, 490, '1 : N Handover')}

    <!-- 7. users (1) -> cc_wishlists (N) -->
    <path d="M 450 220 L 390 220 L 390 355 L 275 355" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(390, 355, '1 : N Saves')}

    <!-- 8. products (1) -> cc_wishlists (N) -->
    <path d="M 450 425 L 275 425" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(362, 425, '1 : N Saved')}

    <!-- 9. products (1) -> cc_product_reports (N) -->
    <path d="M 450 510 L 360 510 L 360 580 L 285 580" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(360, 545, '1 : N Flagged')}

    <!-- 10. users (1) -> cc_product_reports (N) -->
    <path d="M 450 265 L 415 265 L 415 625 L 285 625" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(360, 625, '1 : N Reports')}

    <!-- 11. products (1) -> cc_chat_messages (N) -->
    <path d="M 575 570 L 575 615" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(575, 592, '1 : N Discussed')}

    <!-- 12. users (1) -> cc_chat_messages (N) -->
    <path d="M 700 245 L 740 245 L 740 695 L 700 695" stroke="#0f172a" stroke-width="2.2" fill="none" marker-start="url(#one)" marker-end="url(#many)"/>
    ${relLabel(740, 590, '1 : N Chats')}
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <style>
      * { font-family: 'Segoe UI', Arial, sans-serif; }
    </style>
    <!-- Crow's Foot Markers -->
    <marker id="many" viewBox="0 0 14 14" refX="12" refY="7" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
      <path d="M 1 7 L 12 2 M 1 7 L 12 7 M 1 7 L 12 12" stroke="#0f172a" stroke-width="1.8" fill="none"/>
    </marker>
    <marker id="one" viewBox="0 0 14 14" refX="2" refY="7" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
      <path d="M 4 2 L 4 12 M 8 2 L 8 12" stroke="#0f172a" stroke-width="1.8" fill="none"/>
    </marker>
  </defs>

  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <rect x="15" y="15" width="${w - 30}" height="${h - 30}" fill="none" stroke="#0f172a" stroke-width="2.2"/>
  
  <!-- Header -->
  <rect x="28" y="28" width="${w - 56}" height="50" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="1.6"/>
  <text x="${w / 2}" y="52" font-size="18px" font-weight="bold" fill="#0f172a" text-anchor="middle">CAMPUSCART — DATABASE ENTITY RELATIONSHIP DIAGRAM (SCHEMA / CROW'S FOOT)</text>
  <text x="${w / 2}" y="70" font-size="12px" fill="#475569" text-anchor="middle">MySQL Relational Schema with Primary Keys (PK), Foreign Keys (FK) &amp; Cardinalities</text>

  ${linesSvg}
  ${tablesSvg}

  <!-- Legend Footer -->
  <rect x="28" y="${h - 42}" width="${w - 56}" height="28" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="1.2"/>
  <text x="45" y="${h - 24}" font-size="12px" font-weight="bold" fill="#0f172a">Legend:  [PK] Primary Key   |   [FK] Foreign Key   |   [UQ] Unique Key   |   1 : N One-to-Many</text>
  <text x="${w - 45}" y="${h - 24}" font-size="12px" font-weight="bold" fill="#0f172a" text-anchor="end">CampusCart MySQL Schema</text>
</svg>`;
}

// -------------------------------------------------------------
// 2. CLASSIC CHEN NOTATION ER DIAGRAM (ENTITIES, DIAMONDS, OVALS)
// -------------------------------------------------------------
function buildChenErSvg() {
  const w = 1140;
  const h = 780;

  function entity(name, x, y, ew = 150, eh = 48) {
    return `
    <g>
      <rect x="${x - ew / 2}" y="${y - eh / 2}" width="${ew}" height="${eh}" fill="#e2e8f0" stroke="#0f172a" stroke-width="2.4" rx="4"/>
      <text x="${x}" y="${y + 5}" font-size="14px" font-weight="bold" fill="#0f172a" text-anchor="middle">${name}</text>
    </g>`;
  }

  function diamond(label, x, y, dw = 120, dh = 64) {
    const pts = `${x},${y - dh / 2} ${x + dw / 2},${y} ${x},${y + dh / 2} ${x - dw / 2},${y}`;
    return `
    <g>
      <polygon points="${pts}" fill="#ffffff" stroke="#0f172a" stroke-width="2.2"/>
      <text x="${x}" y="${y + 5}" font-size="13px" font-weight="bold" fill="#0f172a" text-anchor="middle">${label}</text>
    </g>`;
  }

  function attr(label, x, y, isPk = false, rx = 56, ry = 18) {
    return `
    <g>
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
      <text x="${x}" y="${y + 4}" font-size="11.5px" font-weight="${isPk ? 'bold' : '600'}" text-decoration="${isPk ? 'underline' : 'none'}" fill="#0f172a" text-anchor="middle">${label}</text>
    </g>`;
  }

  function card(txt, x, y) {
    return `
    <rect x="${x - 11}" y="${y - 10}" width="22" height="20" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.2"/>
    <text x="${x}" y="${y + 4}" font-size="12px" font-weight="bold" fill="#0f172a" text-anchor="middle">${txt}</text>`;
  }

  const content = `
    <!-- ================= ATTRIBUTE CONNECTOR LINES ================= -->
    <!-- USER Attributes -->
    <line x1="250" y1="280" x2="120" y2="180" stroke="#475569" stroke-width="1.5"/>
    <line x1="250" y1="280" x2="210" y2="145" stroke="#475569" stroke-width="1.5"/>
    <line x1="250" y1="280" x2="335" y2="145" stroke="#475569" stroke-width="1.5"/>
    <line x1="250" y1="280" x2="95" y2="260" stroke="#475569" stroke-width="1.5"/>
    <line x1="250" y1="280" x2="95" y2="330" stroke="#475569" stroke-width="1.5"/>

    <!-- PRODUCT Attributes -->
    <line x1="580" y1="280" x2="500" y2="145" stroke="#475569" stroke-width="1.5"/>
    <line x1="580" y1="280" x2="625" y2="145" stroke="#475569" stroke-width="1.5"/>
    <line x1="580" y1="280" x2="735" y2="175" stroke="#475569" stroke-width="1.5"/>
    <line x1="580" y1="280" x2="735" y2="230" stroke="#475569" stroke-width="1.5"/>

    <!-- CATEGORY Attributes -->
    <line x1="940" y1="280" x2="940" y2="175" stroke="#475569" stroke-width="1.5"/>
    <line x1="940" y1="280" x2="1045" y2="220" stroke="#475569" stroke-width="1.5"/>

    <!-- ORDER Attributes -->
    <line x1="580" y1="530" x2="450" y2="645" stroke="#475569" stroke-width="1.5"/>
    <line x1="580" y1="530" x2="580" y2="665" stroke="#475569" stroke-width="1.5"/>
    <line x1="580" y1="530" x2="710" y2="645" stroke="#475569" stroke-width="1.5"/>

    <!-- HANDOVER OTP Attributes -->
    <line x1="940" y1="530" x2="940" y2="650" stroke="#475569" stroke-width="1.5"/>
    <line x1="940" y1="530" x2="1045" y2="610" stroke="#475569" stroke-width="1.5"/>

    <!-- WISHLIST / CHAT / REPORT lines -->
    <line x1="250" y1="530" x2="115" y2="635" stroke="#475569" stroke-width="1.5"/>
    <line x1="250" y1="530" x2="250" y2="655" stroke="#475569" stroke-width="1.5"/>

    <!-- ================= RELATIONSHIP LINES ================= -->
    <!-- USER - Lists - PRODUCT -->
    <line x1="325" y1="280" x2="505" y2="280" stroke="#0f172a" stroke-width="2.2"/>
    
    <!-- PRODUCT - Belongs To - CATEGORY -->
    <line x1="655" y1="280" x2="865" y2="280" stroke="#0f172a" stroke-width="2.2"/>

    <!-- USER - Places - ORDER -->
    <path d="M 250 304 L 250 430 L 505 530" stroke="#0f172a" stroke-width="2.2" fill="none"/>

    <!-- PRODUCT - Included In - ORDER -->
    <line x1="580" y1="304" x2="580" y2="506" stroke="#0f172a" stroke-width="2.2"/>

    <!-- ORDER - Verified By - HANDOVER_OTP -->
    <line x1="655" y1="530" x2="865" y2="530" stroke="#0f172a" stroke-width="2.2"/>

    <!-- USER - Saves - WISHLIST -->
    <line x1="250" y1="304" x2="250" y2="506" stroke="#0f172a" stroke-width="2.2"/>

    <!-- WISHLIST - Targets - PRODUCT -->
    <line x1="325" y1="515" x2="505" y2="295" stroke="#0f172a" stroke-width="2.0" stroke-dasharray="5,3"/>

    <!-- ================= ENTITIES ================= -->
    ${entity('USER (Student)', 250, 280, 150, 48)}
    ${entity('PRODUCT', 580, 280, 150, 48)}
    ${entity('CATEGORY', 940, 280, 150, 48)}
    ${entity('ORDER', 580, 530, 150, 48)}
    ${entity('HANDOVER_OTP', 940, 530, 160, 48)}
    ${entity('WISHLIST / CHAT', 250, 530, 155, 48)}

    <!-- ================= RELATIONSHIPS (DIAMONDS) ================= -->
    ${diamond('Lists', 415, 280, 110, 56)}
    ${diamond('Belongs To', 760, 280, 120, 56)}
    ${diamond('Places', 360, 470, 105, 54)}
    ${diamond('Includes', 580, 405, 115, 56)}
    ${diamond('Verified By', 760, 530, 125, 58)}
    ${diamond('Creates', 250, 405, 110, 54)}

    <!-- ================= CARDINALITIES ================= -->
    ${card('1', 345, 280)}
    ${card('N', 485, 280)}
    ${card('N', 675, 280)}
    ${card('1', 845, 280)}
    ${card('1', 280, 445)}
    ${card('N', 480, 520)}
    ${card('1', 580, 325)}
    ${card('N', 580, 485)}
    ${card('1', 675, 530)}
    ${card('1', 845, 530)}
    ${card('1', 250, 325)}
    ${card('N', 250, 485)}

    <!-- ================= ATTRIBUTES (OVALS) ================= -->
    <!-- User -->
    ${attr('user_id', 110, 175, true, 50, 18)}
    ${attr('full_name', 210, 138, false, 52, 18)}
    ${attr('email', 335, 138, false, 48, 18)}
    ${attr('college', 85, 258, false, 48, 18)}
    ${attr('role', 85, 330, false, 44, 18)}

    <!-- Product -->
    ${attr('product_id', 500, 138, true, 54, 18)}
    ${attr('product_name', 625, 138, false, 62, 18)}
    ${attr('price', 745, 175, false, 44, 18)}
    ${attr('status', 745, 230, false, 46, 18)}

    <!-- Category -->
    ${attr('category_id', 940, 168, true, 58, 18)}
    ${attr('category_name', 1050, 220, false, 64, 18)}

    <!-- Order -->
    ${attr('order_id', 445, 650, true, 50, 18)}
    ${attr('amount', 580, 670, false, 48, 18)}
    ${attr('payment_mode', 715, 650, false, 62, 18)}

    <!-- Handover OTP -->
    ${attr('otp_hash', 940, 655, false, 52, 18)}
    ${attr('completed', 1050, 610, false, 52, 18)}

    <!-- Wishlist / Chat -->
    ${attr('room_id / id', 110, 640, true, 56, 18)}
    ${attr('message', 250, 660, false, 50, 18)}
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <style>* { font-family: 'Segoe UI', Arial, sans-serif; }</style>
  </defs>
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <rect x="15" y="15" width="${w - 30}" height="${h - 30}" fill="none" stroke="#0f172a" stroke-width="2.2"/>

  <!-- Header -->
  <rect x="28" y="28" width="${w - 56}" height="50" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="1.6"/>
  <text x="${w / 2}" y="52" font-size="18px" font-weight="bold" fill="#0f172a" text-anchor="middle">CAMPUSCART — CONCEPTUAL ER DIAGRAM (CHEN NOTATION)</text>
  <text x="${w / 2}" y="70" font-size="12px" fill="#475569" text-anchor="middle">Entities [Rectangles], Relationships [Diamonds], Attributes [Ovals], Primary Keys [Underlined]</text>

  ${content}

  <!-- Footer -->
  <rect x="28" y="${h - 42}" width="${w - 56}" height="28" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="1.2"/>
  <text x="45" y="${h - 24}" font-size="12px" font-weight="bold" fill="#0f172a">Notation: Peter Chen ER Standard (Academic Report Format)</text>
  <text x="${w - 45}" y="${h - 24}" font-size="12px" font-weight="bold" fill="#0f172a" text-anchor="end">CampusCart System</text>
</svg>`;
}

const schemaSvg = buildSchemaErSvg();
const chenSvg = buildChenErSvg();

fs.writeFileSync(path.join(OUT_DIR, 'ER_Diagram_Schema_CrowsFoot.svg'), schemaSvg, 'utf8');
fs.writeFileSync(path.join(OUT_DIR, 'ER_Diagram_Conceptual_Chen.svg'), chenSvg, 'utf8');

const renders = [
  { name: 'ER_Diagram_Schema_CrowsFoot', svg: schemaSvg, w: 1160, h: 820 },
  { name: 'ER_Diagram_Conceptual_Chen', svg: chenSvg, w: 1140, h: 780 },
];

renders.forEach(item => {
  const htmlFile = path.join(OUT_DIR, `${item.name}.html`);
  const pngFile = path.join(OUT_DIR, `${item.name}.png`);
  const artifactPng = path.join(ARTIFACT_DIR, `${item.name}.png`);

  const htmlPage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #ffffff; overflow: hidden; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>${item.svg}</body>
</html>`;

  fs.writeFileSync(htmlFile, htmlPage, 'utf8');

  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--force-device-scale-factor=2',
      `--window-size=${item.w},${item.h}`,
      `--screenshot=${pngFile}`,
      htmlFile,
    ], { stdio: 'ignore' });

    fs.copyFileSync(pngFile, artifactPng);
    console.log(`✓ Rendered Ultra-Sharp ER PNG: ${item.name}.png (${fs.statSync(pngFile).size} bytes)`);
  } catch (err) {
    console.error(`Error rendering ${item.name}:`, err.message);
  }
});

console.log('ALL ER DIAGRAMS GENERATED SUCCESSFULLY!');
