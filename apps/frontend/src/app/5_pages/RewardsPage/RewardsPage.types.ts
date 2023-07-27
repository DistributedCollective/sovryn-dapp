import { SupportedTokens } from '@sovryn/contracts';

export enum RewardsAction {
  withdrawFromSP = 'withdrawFromSP',
  withdrawETHGainToTrove = 'withdrawETHGainToTrove',
}

export type EarnedFee = {
  token: SupportedTokens;
  contractAddress: string;
  value: string;
  rbtcValue: number;
  startFrom?: number;
  maxCheckpoints?: number;
};
