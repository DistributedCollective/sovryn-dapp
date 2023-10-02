import { SupportedTokens } from '@sovryn/contracts';

export type UserCheckpoint = {
  token: SupportedTokens;
  checkpointNum: number;
  hasFees: boolean;
  hasSkippedCheckpoints: boolean;
};
