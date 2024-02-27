export enum UserBadges {
  EARLY_USER = 'early_user',
  GENESIS = 'genesis',
  ORIGIN = 'origin',
  NFT = 'nft',
  TOP_IMPORTER_DAY = 'top_importer_day',
  TOP_IMPORTER_WEEK = 'top_importer_week',
  VOTER = 'voter',
  TOP_STAKER_DAY = 'top_staker_day',
  TOP_STAKER_WEEK = 'top_staker_week',
  WALLET = 'wallet',
}

export type User = {
  rank: string;
  wallet: string;
  points: string;
  badges: UserBadges[];
};
