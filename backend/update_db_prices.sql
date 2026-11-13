-- CampusCart - Student Resale Price Optimization Script
-- Realistic Student Resale Rates for AKS University

USE campuscart;

-- 1. Academic Books, Notes & Practical Files (Must be set first to prevent substring collisions)
UPDATE products 
SET price = 89 
WHERE LOWER(title) LIKE '%dbms lab%' OR LOWER(title) LIKE '%practical file%';

UPDATE products 
SET price = 450 
WHERE LOWER(title) LIKE '%core python%' OR LOWER(title) LIKE '%python programming by nageswara%';

UPDATE products 
SET price = 560 
WHERE LOWER(title) LIKE '%java programming notes%';

UPDATE products 
SET price = 70 
WHERE LOWER(title) LIKE '%notes%' AND LOWER(title) NOT LIKE '%java%' AND price > 200;

UPDATE products 
SET price = 45 
WHERE LOWER(title) LIKE '%previous year papers%' AND price > 100;

-- 2. Desktops, Monitors, Keyboards & Peripherals
UPDATE products 
SET price = 5000 
WHERE LOWER(title) LIKE '%hp 290%';

UPDATE products 
SET price = 2800 
WHERE LOWER(title) LIKE '%dell 22 inch%' OR (LOWER(title) LIKE '%dell%' AND LOWER(title) LIKE '%monitor%');

UPDATE products 
SET price = 850 
WHERE LOWER(title) LIKE '%k380%' OR LOWER(title) LIKE '%logitech k380%';

-- 3. Laptops & High-End Tech (Notice: Safe Asus ROG / TUF checks, avoiding %rog% which matches 'program')
UPDATE products 
SET price = 51000 
WHERE LOWER(title) LIKE '%lenovo%' AND LOWER(title) LIKE '%gaming%';

UPDATE products 
SET price = 48000 
WHERE LOWER(title) LIKE '%vivobook 15%';

UPDATE products 
SET price = 30000 
WHERE LOWER(title) LIKE '%vivobook go%';

UPDATE products 
SET price = 42000 
WHERE LOWER(title) LIKE '%vivobook 16%';

UPDATE products 
SET price = 45000 
WHERE (LOWER(title) LIKE '%ryzen 7%' OR LOWER(title) LIKE '%asus rog%' OR LOWER(title) LIKE '%rog strix%' OR LOWER(title) LIKE '%asus tuf%')
  AND LOWER(title) NOT LIKE '%notes%' 
  AND LOWER(title) NOT LIKE '%program%';

UPDATE products 
SET price = 52000 
WHERE LOWER(title) LIKE '%macbook air m1%';

UPDATE products 
SET price = 32000 
WHERE LOWER(title) LIKE '%macbook air 2017%';

UPDATE products 
SET price = 38000 
WHERE (LOWER(title) LIKE '%ideapad%' OR LOWER(title) LIKE '%victus%' OR LOWER(title) LIKE '%inspiron%') 
  AND LOWER(title) NOT LIKE '%gaming%';

UPDATE products 
SET price = 35000 
WHERE (LOWER(title) LIKE '%aspire%' OR LOWER(title) LIKE '%thinkpad%' OR LOWER(title) LIKE '%latitude%');

-- 4. Clothes & Uniforms
UPDATE products 
SET price = 200 
WHERE LOWER(title) LIKE '%lab coat%' OR LOWER(title) LIKE '%coat%';

UPDATE products 
SET price = 450 
WHERE LOWER(title) LIKE '%jacket%';

UPDATE products 
SET price = 380 
WHERE LOWER(title) LIKE '%hoodie%';

-- 5. Calculators
UPDATE products 
SET price = 240 
WHERE (LOWER(title) LIKE '%991ex%' OR LOWER(description) LIKE '%991ex%');

UPDATE products 
SET price = 180 
WHERE (LOWER(title) LIKE '%991es%' OR LOWER(description) LIKE '%991es%');

UPDATE products 
SET price = 120 
WHERE (LOWER(title) LIKE '%82ms%' OR LOWER(description) LIKE '%82ms%');

UPDATE products 
SET price = 140 
WHERE (LOWER(title) LIKE '%570es%' OR LOWER(description) LIKE '%570es%');

UPDATE products 
SET price = 130 
WHERE LOWER(title) LIKE '%citizen%';

UPDATE products 
SET price = 150 
WHERE (LOWER(title) LIKE '%calculator%' OR LOWER(category) LIKE '%calc%') AND price < 100;

SELECT 'CampusCart prices successfully updated to realistic student rates (DBMS file 89, Python book 450, HP 290 5k, Dell monitor 2800, K380 850, Java notes 560, Lenovo 51k, Vivobook 15 48k, Lab coat 200)!' AS status;
