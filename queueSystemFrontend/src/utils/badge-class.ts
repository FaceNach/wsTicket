export function getDeskBadgeClassName(deskNumber: number): string {
  const badgeVariants = [
    'bg-sky-500/15 text-sky-200 ring-sky-300/20',
    'bg-emerald-500/15 text-emerald-200 ring-emerald-300/20',
    'bg-fuchsia-500/15 text-fuchsia-200 ring-fuchsia-300/20',
    'bg-amber-500/15 text-amber-200 ring-amber-300/20',
    'bg-violet-500/15 text-violet-200 ring-violet-300/20',
    'bg-rose-500/15 text-rose-200 ring-rose-300/20',
  ];

  const index = Math.abs(deskNumber) % badgeVariants.length;
  return badgeVariants[index];
}
