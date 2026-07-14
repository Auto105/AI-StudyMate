const DAY_IN_MS = 86_400_000;

export function getTodayIso(date = new Date()) {
  return toIsoDate(date);
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function calculateDday(examDate: string, today = getTodayIso()) {
  const exam = parseIsoDate(examDate);
  const base = parseIsoDate(today);

  if (!exam || !base) {
    return null;
  }

  return Math.ceil((exam.getTime() - base.getTime()) / DAY_IN_MS);
}

export function formatDday(examDate: string, today = getTodayIso()) {
  const dday = calculateDday(examDate, today);

  if (dday === null) {
    return 'D-?';
  }

  if (dday === 0) {
    return 'D-Day';
  }

  return dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;
}

export function isValidIsoDate(value: string) {
  return parseIsoDate(value) !== null;
}

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return toIsoDate(date) === value ? date : null;
}
