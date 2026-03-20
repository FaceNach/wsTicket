export function formatBoardTime(now: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

export function formatBoardDate(now: Date): string {
  const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(
    now
  );
  const dayMonth = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
  }).format(now);
  return `${weekday} ${dayMonth}`;
}
