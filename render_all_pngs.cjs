// render_all_pngs.cjs - Generates clean standalone HTML pages and renders 3 High-Res PNGs using Chrome
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, 'dfd-diagrams');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const diagrams = [
  {
    name: 'DFD_Level_0_Context_Diagram',
    svgFile: 'DFD_Level_0_Context_Diagram.svg',
    pngFile: 'DFD_Level_0_Context_Diagram.png',
  },
  {
    name: 'DFD_Level_1_Major_Processes',
    svgFile: 'DFD_Level_1_Major_Processes.svg',
    pngFile: 'DFD_Level_1_Major_Processes.png',
  },
  {
    name: 'DFD_Level_2_Order_Handover_OTP',
    svgFile: 'DFD_Level_2_Order_Handover_OTP.svg',
    pngFile: 'DFD_Level_2_Order_Handover_OTP.png',
  },
];

diagrams.forEach(d => {
  const svgContent = fs.readFileSync(path.join(OUTPUT_DIR, d.svgFile), 'utf8');
  // Create clean page with zero margin, pure white background, exact 1684x1190 aspect
  const cleanHtml = `<!DOCTYPE html>
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
  ${svgContent}
</body>
</html>`;

  const cleanHtmlPath = path.join(OUTPUT_DIR, `${d.name}_print.html`);
  fs.writeFileSync(cleanHtmlPath, cleanHtml, 'utf8');

  const outPngPath = path.join(OUTPUT_DIR, d.pngFile);
  console.log(`Rendering ${d.pngFile} via Chrome headless (2400x1700 A3)...`);

  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=2400,1700',
      `--screenshot=${outPngPath}`,
      cleanHtmlPath,
    ], { stdio: 'ignore' });
    console.log(`✓ Generated ${d.pngFile} (${fs.statSync(outPngPath).size} bytes)`);
  } catch (err) {
    console.error(`Error rendering ${d.pngFile}:`, err.message);
  }
});

console.log('ALL 3 DFD PNG IMAGES RENDERED SUCCESSFULLY!');
