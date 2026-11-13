export function timeAgo(value) {
  const time = Date.parse(value);
  if (!value || Number.isNaN(time)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;

  const days = Math.floor(seconds / 86400);
  if (days < 30) return days === 1 ? "Yesterday" : `${days} days ago`;
  return new Date(time).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}