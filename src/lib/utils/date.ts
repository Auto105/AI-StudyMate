export function getDDay(examDate: string) {
  const today = new Date();
  const target = new Date(`${examDate}T00:00:00`);
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.ceil((target.getTime() - todayOnly.getTime()) / 86_400_000);

  if (Number.isNaN(diff)) {
    return 'D-?';
  }

  if (diff === 0) {
    return 'D-Day';
  }

  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}
