// fix_seed_build_items.cjs - Updates build_items function with OLX-style descriptions
const fs = require('fs');

const seedPath = 'c:/Users/shita/campus-Cart/backend/seed_demo.py';
let content = fs.readFileSync(seedPath, 'utf8');

// Normalize CRLF to LF for matching
const normalized = content.replace(/\r\n/g, '\n');

// Find the build_items function boundaries
const startMarker = 'def build_items(seed=42):';
const endMarker = '\ndef find_photo(title, group):';

const startIdx = normalized.indexOf(startMarker);
const endIdx = normalized.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: Could not find build_items function boundaries!');
  console.error('startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

console.log('Found build_items at chars', startIdx, 'to', endIdx);

const before = normalized.substring(0, startIdx);
const after = normalized.substring(endIdx);

const newFunc = `def build_items(seed=42):
    rng = random.Random(seed)
    items = []
    for keywords, group, emoji, entries in SECTIONS:
        for title, original, price, condition, age in entries:
            details = []
            purchase_year = THIS_YEAR - age if age else None
            if purchase_year:
                years_used = THIS_YEAR - purchase_year
                listed_days = rng.randint(1, 30)
                listed_str = (
                    f"{listed_days} day{'s' if listed_days > 1 else ''} ago"
                    if listed_days <= 7
                    else f"{listed_days // 7} week{'s' if listed_days // 7 > 1 else ''} ago"
                )
                details.append(
                    f"Purchased in {purchase_year}. Used for "
                    f"{years_used} year{'s' if years_used > 1 else ''}. "
                    f"Listed {listed_str}."
                )
            else:
                listed_days = rng.randint(1, 10)
                listed_str = f"{listed_days} day{'s' if listed_days > 1 else ''} ago"
                details.append(f"Listed {listed_str}.")
            details.append(rng.choice(PHRASES))
            items.append({
                "keywords": keywords.split("|"),
                "group": group,
                "emoji": emoji,
                "product_name": title,
                "description": f"{title}. {' '.join(details)}",
                "price": price,
                "original_price": original or None,
                "product_condition": condition,
                "created_at": datetime.now() - timedelta(days=rng.randint(0, 40), hours=rng.randint(0, 23)),
            })
    return items`;

const newContent = before + newFunc + after;

fs.writeFileSync(seedPath, newContent, 'utf8');
console.log('SUCCESS! build_items updated with OLX-style descriptions.');
console.log('Sample description will be like:');
console.log('  "Realme 10000mAh Power Bank. Purchased in 2022. Used for 4 years. Listed 3 weeks ago. Working perfectly, no issues."');
