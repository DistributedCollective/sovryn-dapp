import { Environments } from '../../../types/global';

export const VP = 'VP';
export const APR = 'APR';
export const WEIGHT_FACTOR = 10;

export const MAX_STAKING_APR_LINK =
  'https://redash.sovryn.app/public/dashboards/VqJnymylogSI6jMHZPJIyog9RUJjUUS81cxYfNUM';

export const REDASH_APR_URL = {
  [Environments.Testnet]: 'https://api.test.sovryn.app/redash/301/results.json',
  [Environments.Mainnet]: 'https://backend.sovryn.app/redash/301/results.json',
};

export const STAKING_REWARDS_LEARN_MORE_LINK =
  'https://sovryn.com/all-things-sovryn/5-amazing-benefits-of-staking-sov';

export const STAKING_DELEGATION_LEARN_MORE_LINK =
  'https://forum.sovryn.com/c/bitocracy/delegates/24';
