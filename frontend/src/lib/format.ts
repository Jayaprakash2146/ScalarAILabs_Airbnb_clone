/** Formatting + date helpers shared across the app. */

export function formatPrice(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatRange(checkIn: string, checkOut: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const a = new Date(checkIn + "T00:00:00").toLocaleDateString("en-GB", opts);
  const b = new Date(checkOut + "T00:00:00").toLocaleDateString("en-GB", opts);
  return `${a} – ${b}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn + "T00:00:00").getTime();
  const b = new Date(checkOut + "T00:00:00").getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(d: Date, days: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
}

/** Human join date like "Joined in March 2023". */
export function joinedIn(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function reviewDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
