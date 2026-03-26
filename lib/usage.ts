export const FREE_LIMIT = 2;
const KEY = "clarity_usage_count";

export function getUsageCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY) ?? "0", 10);
}

export function incrementUsage(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(getUsageCount() + 1));
}

export function resetUsage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
