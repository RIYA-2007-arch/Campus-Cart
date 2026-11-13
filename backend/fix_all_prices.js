const fs = require('fs');

let c = fs.readFileSync('backend/seed_demo.py', 'utf8');

// 1. Lab coats price -> 200 (was 80)
c = c.replace(/Lab Coat \(Size M\)", 450, \d+/g, 'Lab Coat (Size M)", 450, 200');
c = c.replace(/Lab Coat \(Size L\)", 450, \d+/g, 'Lab Coat (Size L)", 450, 200');

// 2. All Calculators -> proper 120 - 240 range
c = c.replace(/Casio fx-991ES Plus Scientific Calculator", 1250, \d+/g, 'Casio fx-991ES Plus Scientific Calculator", 1250, 180');
c = c.replace(/Casio fx-991EX ClassWiz Calculator", 1600, \d+/g, 'Casio fx-991EX ClassWiz Calculator", 1600, 240');
c = c.replace(/Casio fx-82MS Scientific Calculator", 700, \d+/g, 'Casio fx-82MS Scientific Calculator", 700, 120');
c = c.replace(/Casio fx-570ES Plus Calculator", 1100, \d+/g, 'Casio fx-570ES Plus Calculator", 1100, 140');
c = c.replace(/Citizen SR-135N Scientific Calculator", 600, \d+/g, 'Citizen SR-135N Scientific Calculator", 600, 130');

// 3. Winter Jacket -> 450
c = c.replace(/Winter Jacket \(Size M\)", 2500, \d+/g, 'Winter Jacket (Size M)", 2500, 450');
c = c.replace(/Hoodie \(Size L\)", 1200, \d+/g, 'Hoodie (Size L)", 1200, 380');

// 4. Laptops:
// Asus Vivobook -> 40000, 42000
c = c.replace(/ASUS Vivobook 15 Laptop \(Core i5 11th Gen, 8GB RAM, 512GB SSD\)", 52000, \d+/g, 'ASUS Vivobook 15 Laptop (Core i5 11th Gen, 8GB RAM, 512GB SSD)", 52000, 40000');
c = c.replace(/ASUS Vivobook 16 Laptop \(Ryzen 5 5600H, 16GB RAM, 512GB SSD\)", 58000, \d+/g, 'ASUS Vivobook 16 Laptop (Ryzen 5 5600H, 16GB RAM, 512GB SSD)", 58000, 42000');
c = c.replace(/ASUS Vivobook Go 14 Laptop \(Ryzen 3, 8GB RAM, 256GB SSD\)", 32000, \d+/g, 'ASUS Vivobook Go 14 Laptop (Ryzen 3, 8GB RAM, 256GB SSD)", 32000, 28000');
// Asus Gaming Ryzen 7 / ROG / TUF -> 45000
c = c.replace(/ASUS TUF Gaming F15 Laptop \(Core i5 10th Gen, GTX 1650, 16GB RAM, 512GB SSD\)", 72000, \d+/g, 'ASUS TUF Gaming F15 Laptop (Core i5 10th Gen, GTX 1650, 16GB RAM, 512GB SSD)", 72000, 42000');
c = c.replace(/ASUS TUF Gaming A15 Laptop \(Ryzen 7, RTX 3050, 16GB RAM, 512GB SSD\)", 85000, \d+/g, 'ASUS TUF Gaming A15 Laptop (Ryzen 7, RTX 3050, 16GB RAM, 512GB SSD)", 85000, 45000');
c = c.replace(/ASUS ZenBook 14 OLED Laptop \(Core i5 12th Gen, 16GB RAM, 512GB SSD\)", 85000, \d+/g, 'ASUS ZenBook 14 OLED Laptop (Core i5 12th Gen, 16GB RAM, 512GB SSD)", 85000, 42000');
c = c.replace(/ASUS ROG Strix G15 Laptop \(Ryzen 7, RTX 3060, 16GB RAM, 1TB SSD\)", 120000, \d+/g, 'ASUS ROG Strix G15 Laptop (Ryzen 7, RTX 3060, 16GB RAM, 1TB SSD)", 120000, 45000');

// HP Laptops
c = c.replace(/HP 15s Laptop \(Core i3 11th Gen, 8GB RAM, 256GB SSD\)", 42000, \d+/g, 'HP 15s Laptop (Core i3 11th Gen, 8GB RAM, 256GB SSD)", 42000, 32000');
c = c.replace(/HP 14s Laptop \(Ryzen 5 5500U, 8GB RAM, 512GB SSD\)", 48000, \d+/g, 'HP 14s Laptop (Ryzen 5 5500U, 8GB RAM, 512GB SSD)", 48000, 38000');
c = c.replace(/HP Pavilion 14 Laptop \(Core i5 11th Gen, 16GB RAM, 512GB SSD\)", 68000, \d+/g, 'HP Pavilion 14 Laptop (Core i5 11th Gen, 16GB RAM, 512GB SSD)", 68000, 42000');
c = c.replace(/HP Victus Gaming Laptop \(Ryzen 5, RTX 3050, 16GB RAM, 512GB SSD\)", 75000, \d+/g, 'HP Victus Gaming Laptop (Ryzen 5, RTX 3050, 16GB RAM, 512GB SSD)", 75000, 42000');
c = c.replace(/HP ProBook 440 G8 Laptop \(Core i5, 8GB RAM, 512GB SSD\)", 70000, \d+/g, 'HP ProBook 440 G8 Laptop (Core i5, 8GB RAM, 512GB SSD)", 70000, 36000');

// Dell Laptops
c = c.replace(/Dell Inspiron 15 Laptop \(Core i5 11th Gen, 8GB RAM, 512GB SSD\)", 55000, \d+/g, 'Dell Inspiron 15 Laptop (Core i5 11th Gen, 8GB RAM, 512GB SSD)", 55000, 38000');
c = c.replace(/Dell Vostro 3510 Laptop \(Core i3 11th Gen, 8GB RAM, 256GB SSD\)", 45000, \d+/g, 'Dell Vostro 3510 Laptop (Core i3 11th Gen, 8GB RAM, 256GB SSD)", 45000, 32000');
c = c.replace(/Dell Latitude 5420 Laptop \(Core i5 11th Gen, 16GB RAM, 512GB SSD\)", 90000, \d+/g, 'Dell Latitude 5420 Laptop (Core i5 11th Gen, 16GB RAM, 512GB SSD)", 90000, 38000');
c = c.replace(/Dell G15 Gaming Laptop \(Core i5, RTX 3050, 16GB RAM, 512GB SSD\)", 85000, \d+/g, 'Dell G15 Gaming Laptop (Core i5, RTX 3050, 16GB RAM, 512GB SSD)", 85000, 45000');

// Lenovo Laptops
c = c.replace(/Lenovo IdeaPad Slim 3 Laptop \(Core i3 12th Gen, 8GB RAM, 512GB SSD\)", 42000, \d+/g, 'Lenovo IdeaPad Slim 3 Laptop (Core i3 12th Gen, 8GB RAM, 512GB SSD)", 42000, 32000');
c = c.replace(/Lenovo IdeaPad Gaming 3 Laptop \(Ryzen 5, GTX 1650, 8GB RAM, 512GB SSD\)", 62000, \d+/g, 'Lenovo IdeaPad Gaming 3 Laptop (Ryzen 5, GTX 1650, 8GB RAM, 512GB SSD)", 62000, 40000');
c = c.replace(/Lenovo ThinkPad E14 Laptop \(Core i5, 16GB RAM, 512GB SSD\)", 80000, \d+/g, 'Lenovo ThinkPad E14 Laptop (Core i5, 16GB RAM, 512GB SSD)", 80000, 38000');
c = c.replace(/Lenovo LOQ Gaming Laptop \(Core i5 12th Gen, RTX 3050, 16GB RAM, 512GB SSD\)", 85000, \d+/g, 'Lenovo LOQ Gaming Laptop (Core i5 12th Gen, RTX 3050, 16GB RAM, 512GB SSD)", 85000, 45000');

// Acer Laptops
c = c.replace(/Acer Aspire 5 Laptop \(Core i5 12th Gen, 8GB RAM, 512GB SSD\)", 52000, \d+/g, 'Acer Aspire 5 Laptop (Core i5 12th Gen, 8GB RAM, 512GB SSD)", 52000, 36000');
c = c.replace(/Acer Aspire 3 Laptop \(Ryzen 3, 8GB RAM, 256GB SSD\)", 33000, \d+/g, 'Acer Aspire 3 Laptop (Ryzen 3, 8GB RAM, 256GB SSD)", 33000, 26000');
c = c.replace(/Acer Nitro 5 Gaming Laptop \(Core i5, GTX 1650, 8GB RAM, 512GB SSD\)", 72000, \d+/g, 'Acer Nitro 5 Gaming Laptop (Core i5, GTX 1650, 8GB RAM, 512GB SSD)", 72000, 42000');
c = c.replace(/Acer Swift 3 Laptop \(Ryzen 5, 16GB RAM, 512GB SSD\)", 65000, \d+/g, 'Acer Swift 3 Laptop (Ryzen 5, 16GB RAM, 512GB SSD)", 65000, 38000');

// MacBooks & MSI
c = c.replace(/Apple MacBook Air M1 Laptop \(8GB RAM, 256GB SSD\)", 92000, \d+/g, 'Apple MacBook Air M1 Laptop (8GB RAM, 256GB SSD)", 92000, 52000');
c = c.replace(/Apple MacBook Air M1 Laptop \(8GB RAM, 512GB SSD\)", 110000, \d+/g, 'Apple MacBook Air M1 Laptop (8GB RAM, 512GB SSD)", 110000, 58000');
c = c.replace(/MSI GF63 Thin Gaming Laptop \(Core i5 10th Gen, GTX 1650, 8GB RAM, 512GB SSD\)", 65000, \d+/g, 'MSI GF63 Thin Gaming Laptop (Core i5 10th Gen, GTX 1650, 8GB RAM, 512GB SSD)", 65000, 38000');
c = c.replace(/MSI Katana GF66 Gaming Laptop \(Core i7, RTX 3050 Ti, 16GB RAM, 512GB SSD\)", 100000, \d+/g, 'MSI Katana GF66 Gaming Laptop (Core i7, RTX 3050 Ti, 16GB RAM, 512GB SSD)", 100000, 48000');

fs.writeFileSync('backend/seed_demo.py', c, 'utf8');
console.log('Successfully updated seed_demo.py with all exact rates!');
