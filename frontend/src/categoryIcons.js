const ICONS = [
  ["book", "📚"],
  ["study", "📝"],
  ["electronic", "💻"],
  ["calculator", "🧮"],
  ["hostel", "🛏️"],
  ["college", "🎒"],
  ["lab", "🥼"],
  ["sport", "🏏"],
];

export function iconFor(name) {
  const key = String(name || "").toLowerCase();
  const match = ICONS.find(([word]) => key.includes(word));
  return match ? match[1] : "🛍️";
}