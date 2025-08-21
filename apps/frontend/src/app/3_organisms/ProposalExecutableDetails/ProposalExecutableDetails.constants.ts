import { Decimal } from '@sovryn/utils';

export const TREASURY_PROPOSAL_SIGNATURES = ['transferRbtc', 'transferTokens'];

export const DEFAULT_TREASURY_EXECUTABLE_DETAIL = {
  assetName: '-',
  assetAmount: Decimal.ZERO,
  assetAddress: '0',
  recipientAddress: '-',
};
