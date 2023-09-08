import { ChainIds } from '@sovryn/ethers-provider';

import { ReleaseFileContent } from '../types/global';

export const REQUIRED_CHAIN = ChainIds.RSK_TESTNET;

export const APPROVAL_FUNCTION = 'approve';

export const COLLATERAL_RATIO_THRESHOLDS = {
  START: 90,
  MIDDLE_START: 110,
  MIDDLE_END: 150,
  END: 250,
};

export const SUBGRAPH = {
  RSK: process.env.REACT_APP_GRAPH_RSK,
  ZERO: process.env.REACT_APP_GRAPH_ZERO,
  MYNT: process.env.REACT_APP_GRAPH_MYNT,
};

export const EXPORT_RECORD_LIMIT = 500;
export const DEFAULT_HISTORY_FRAME_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_TIMEOUT_SECONDS = 5000;
export const LIQUIDATION_RESERVE_AMOUNT = 20;

export const BTC_IN_SATOSHIS = 100_000_000;

export const RSK_FAUCET = 'https://faucet.rsk.co';

export const CURRENT_RELEASE: ReleaseFileContent = JSON.parse(
  process.env.REACT_APP_RELEASE_DATA || '{}',
);

export const MAX_PROCESSABLE_CHECKPOINTS_ZUSD = 300;
export const MAX_PROCESSABLE_CHECKPOINTS_SOV = 200;
export const MAX_PROCESSABLE_CHECKPOINTS_TOKENS = 150;
export const WEIGHT_FACTOR = 10;
export const MS = 1e3;
export const MAX_PROCESSABLE_CHECKPOINTS_RBTC = 56;
