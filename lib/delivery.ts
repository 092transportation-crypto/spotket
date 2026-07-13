/**
 * Formats a dynamic delivery window like "Jul 17 - 22" (or "Jul 29 - Aug 3"
 * when the window crosses a month boundary), computed from `from` (defaults
 * to now) so it recalculates on every page load.
 */
export function formatDeliveryWindow(
  minDays = 5,
  maxDays = 10,
  from: Date = new Date(),
): string {
  const addDays = (days: number) => {
    const date = new Date(from);
    date.setDate(date.getDate() + days);
    return date;
  };
  const start = addDays(minDays);
  const end = addDays(maxDays);
  const month = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short" });
  const sameMonth = start.getMonth() === end.getMonth();
  return `${month(start)} ${start.getDate()} - ${
    sameMonth ? "" : `${month(end)} `
  }${end.getDate()}`;
}
