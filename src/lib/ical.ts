// iCal format utilities
export function generateICalEvent(todo: {
  title: string;
  startTime: string;
  endTime: string;
}) {
  const formatDate = (date: string) => {
    return new Date(date)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  };

  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${todo.title}`,
    `DTSTART:${formatDate(todo.startTime)}`,
    `DTEND:${formatDate(todo.endTime)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  return event;
}

export function downloadICalFile(event: string, filename: string) {
  const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}