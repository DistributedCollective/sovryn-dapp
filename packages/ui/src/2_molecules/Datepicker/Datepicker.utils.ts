import dayjs from 'dayjs';

export const formatValue = (timestamp: number | string | undefined) => {
  if (!timestamp) {
    return '';
  }
  const stamp = dayjs(Number(timestamp) * 1000, 'UTC');
  return stamp.format('YYYY-MM-DD');
};
