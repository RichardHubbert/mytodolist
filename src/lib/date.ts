export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString();
}

export function addMinutesToDate(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function setToStartOfHour(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMinutes(0, 0, 0);
  return newDate;
}