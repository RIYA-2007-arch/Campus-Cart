const fs = require('fs');
let c = fs.readFileSync('backend/seed_demo.py', 'utf8');

// ASUS Laptops
c = c.replace(/52000, 6500/g, '52000, 40000');
c = c.replace(/58000, 6500/g, '58000, 42000');
c = c.replace(/85000, 8500/g, '85000, 45000');
c = c.replace(/120000, 8500/g, '120000, 45000');
c = c.replace(/72000, 8500/g, '72000, 42000');

// Jacket & Clothes
c = c.replace('2500, 180, "Good"', '2500, 450, "Good"');
c = c.replace('1200, 120, "Good"', '1200, 380, "Good"');

// Calculators
c = c.replace('Casio fx-82MS Scientific Calculator", 700, 80', 'Casio fx-82MS Scientific Calculator", 700, 120');
c = c.replace('Casio fx-570ES Plus Calculator", 1100, 130', 'Casio fx-570ES Plus Calculator", 1100, 140');
c = c.replace('Citizen SR-135N Scientific Calculator", 600, 120', 'Citizen SR-135N Scientific Calculator", 600, 130');

fs.writeFileSync('backend/seed_demo.py', c, 'utf8');
console.log('Done updating seed_demo.py!');
