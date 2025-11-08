export function formatDateTime(isoString) {
  const d = new Date(isoString);
  const opts = { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" };
  return d.toLocaleString("en-US", opts);
}

export function formatDate(isoString) {
  const d = new Date(isoString);
  const opts = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  return d.toLocaleDateString("en-US", opts);
}

export function formatTime(isoString) {
  const d = new Date(isoString);
  const opts = { hour: "numeric", minute: "2-digit" };
  return d.toLocaleTimeString("en-US", opts);
}