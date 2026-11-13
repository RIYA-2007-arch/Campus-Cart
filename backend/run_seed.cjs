// run_seed.cjs - Runs the seed_demo.py script using the Node.js child_process
const { execFileSync } = require('child_process');
const path = require('path');

const backendDir = 'c:/Users/shita/campus-Cart/backend';

// Try different Python executables
const pythonCandidates = [
  'C:/Users/shita/AppData/Local/Microsoft/WindowsApps/PythonSoftwareFoundation.PythonManager_3847v3x7pw1km/python.exe',
  'C:/Users/shita/AppData/Local/Programs/Python/Python312/python.exe',
  'C:/Users/shita/AppData/Local/Programs/Python/Python311/python.exe',
  'C:/Users/shita/AppData/Local/Programs/Python/Python310/python.exe',
  'C:/Python312/python.exe',
  'C:/Python311/python.exe',
];

const fs = require('fs');
let pythonExe = null;
for (const p of pythonCandidates) {
  if (fs.existsSync(p)) {
    pythonExe = p;
    break;
  }
}

if (!pythonExe) {
  console.log('Python not found in common paths. Checking PATH...');
  // Will fail gracefully
  process.exit(1);
}

console.log('Using Python:', pythonExe);
try {
  const result = execFileSync(pythonExe, [path.join(backendDir, 'seed_demo.py')], {
    cwd: backendDir,
    encoding: 'utf8',
    timeout: 60000,
  });
  console.log(result);
} catch (err) {
  console.error('Error:', err.message);
  if (err.stdout) console.log('stdout:', err.stdout);
  if (err.stderr) console.error('stderr:', err.stderr);
}
