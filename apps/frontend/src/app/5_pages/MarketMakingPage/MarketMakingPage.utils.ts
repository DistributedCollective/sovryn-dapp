import { MS } from '../../../constants/general';

export const get24HoursAgoInSeconds = (): number => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now);
  twentyFourHoursAgo.setHours(now.getHours() - 24);
  const differenceInSeconds = Math.floor(
    (now.getTime() - twentyFourHoursAgo.getTime()) / MS,
  );
  return differenceInSeconds;
};
