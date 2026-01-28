/**
 * Formats seconds into a readable duration string
 * @param seconds Duration in seconds
 * @param showSeconds Whether to always show seconds (default false)
 * @returns Formatted string like "2h 30m" or "45m 10s"
 */
export const formatDuration = (seconds: number, showSeconds: boolean = false): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || (hours > 0 && showSeconds)) parts.push(`${minutes}m`);
  if (showSeconds || (hours === 0 && minutes === 0)) parts.push(`${secs}s`);

  return parts.join(' ') || '0s';
};

/**
 * Formats seconds into a long readable duration string
 * @param seconds Duration in seconds
 * @returns Formatted string like "2h 30m 15s"
 */
export const formatDurationLong = (seconds: number): string => {
  return formatDuration(seconds, true);
};

export const formatTimerDisplay = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
  if (!timeStr || !timeStr.includes(':')) {
    return { hours: 0, minutes: 0 };
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { 
    hours: isNaN(hours) ? 0 : hours, 
    minutes: isNaN(minutes) ? 0 : minutes 
  };
};

export const timeStringToMinutes = (timeStr: string): number => {
  const { hours, minutes } = parseTimeString(timeStr);
  return hours * 60 + minutes;
};

export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

