import { ReleaseFileContent } from '../types/global';

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
  BOB: process.env.REACT_APP_GRAPH_BOB,
  BOB_STAKING: process.env.REACT_APP_GRAPH_BOB_STAKING,
};

export const EXPORT_RECORD_LIMIT = 500;
export const DEFAULT_HISTORY_FRAME_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_TIMEOUT_SECONDS = 5000;
export const LIQUIDATION_RESERVE_AMOUNT = 20;

export const BTC_IN_SATOSHIS = 100_000_000;

export const RSK_FAUCET = 'https://faucet.rsk.co';

export const POWPEG = 'https://powpeg.rootstock.io/';

export const CURRENT_RELEASE: ReleaseFileContent = JSON.parse(
  process.env.REACT_APP_RELEASE_DATA || '{}',
);

export const MS = 1e3;

export const SECONDS_IN_DAY = 86400;
export const SECONDS_IN_YEAR = 31536000;

export const TAB_ACTIVE_CLASSNAME = 'bg-gray-70 text-primary-20';

export const DATA_REFRESH_INTERVAL = 60000; // 1 minute
