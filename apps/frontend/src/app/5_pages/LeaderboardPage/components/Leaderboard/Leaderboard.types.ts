export enum TradingBadges {
  EARLY_USER = 'early_user',
  GENESIS = 'genesis',
  ORIGIN = 'origin',
  NFT = 'nft',
  TOP_IMPORTER_DAY = 'top_importer_day',
  TOP_IMPORTER_WEEK = 'top_importer_week',
}

export type User = {
  rank: string;
  wallet: string;
  points: string;
  badges: TradingBadges[];
};
