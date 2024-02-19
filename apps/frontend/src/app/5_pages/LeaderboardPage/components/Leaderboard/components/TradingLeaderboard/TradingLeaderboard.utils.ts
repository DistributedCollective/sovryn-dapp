import { TradingBadges } from '../../Leaderboard.types';

export const parseBadges = (data: any): TradingBadges[] => {
  let badges: TradingBadges[] = [];

  if (data.early_user === 1) {
    badges.push(TradingBadges.EARLY_USER);
  }

  if (data.genesis === 1) {
    badges.push(TradingBadges.GENESIS);
  }

  if (data.origin === 1) {
    badges.push(TradingBadges.ORIGIN);
  }

  if (data.nft === 1) {
    badges.push(TradingBadges.NFT);
  }

  if (data.top_importer_day === 1) {
    badges.push(TradingBadges.TOP_IMPORTER_DAY);
  }

  if (data.top_importer_week === 1) {
    badges.push(TradingBadges.TOP_IMPORTER_WEEK);
  }

  return badges;
};
