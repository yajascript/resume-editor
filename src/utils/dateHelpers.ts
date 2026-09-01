/**
 * Format date strings cleanly for display and export.
 */
export function formatDateRange(
  startDate: string,
  endDate: string,
  isCurrent: boolean,
  presentLabel: string = 'Present'
): string {
  const start = startDate.trim();
  const end = isCurrent ? presentLabel : endDate.trim();

  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
}

/**
 * Format timestamp adhering to rule: Wed, Jul 15, 2026
 */
export function formatTimestamp(dateInput?: string | number | Date): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${dayOfWeek}, ${month} ${day}, ${year}`;
}
