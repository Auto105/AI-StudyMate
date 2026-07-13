import { formatDday } from '@/lib/date';

export { calculateDday, formatDday, getTodayIso, toIsoDate } from '@/lib/date';

export function getDDay(examDate: string) {
  return formatDday(examDate);
}
