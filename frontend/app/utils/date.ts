// app/utils/date.ts

export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateWithDay = (date: Date = new Date()): string => {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.toLocaleDateString('en-US', { day: 'numeric' });
  const year = date.toLocaleDateString('en-US', { year: 'numeric' });
  return `${weekday}, ${day} ${month} ${year}`;
};

export const formatTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};
