import { format, isToday, isTomorrow, isThisWeek, differenceInHours, differenceInDays } from 'date-fns';

export const formatDate = (date: Date, formatStr: string = 'MMM dd, yyyy'): string => {
  return format(date, formatStr);
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const getRelativeDateText = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  if (isThisWeek(date)) {
    return format(date, 'EEEE'); // Day name
  }
  return format(date, 'MMM dd');
};

export const getDueDateText = (dueDate: Date): string => {
  const now = new Date();
  const hoursUntil = differenceInHours(dueDate, now);
  const daysUntil = differenceInDays(dueDate, now);

  if (hoursUntil < 0) {
    return 'Overdue';
  }
  if (hoursUntil < 2) {
    return `Due in ${hoursUntil}h`;
  }
  if (isToday(dueDate)) {
    return `Due ${format(dueDate, 'HH:mm')}`;
  }
  if (isTomorrow(dueDate)) {
    return `Tomorrow, ${format(dueDate, 'HH:mm')}`;
  }
  if (daysUntil < 7) {
    return format(dueDate, 'EEEE, HH:mm');
  }
  return format(dueDate, 'MMM dd, HH:mm');
};

export const getDayName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || '';
};

export const getDayShortName = (dayIndex: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex] || '';
};

export const isDateInPast = (date: Date): boolean => {
  return date < new Date();
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

