import { getGraphWrapperUrl } from '../../../../../utils/helpers';
import { LockedDataResult, VolumeDataResult } from './ProtocolData.types';

export const DEFAULT_LOCKED_DATA: LockedDataResult = {
  tvlLending: {
    totalBtc: 0,
    totalUsd: 0,
  },
  tvlAmm: {
    totalBtc: 0,
    totalUsd: 0,
  },
  tvlProtocol: {
    totalBtc: 0,
    totalUsd: 0,
  },
  tvlStaking: {
    totalBtc: 0,
    totalUsd: 0,
  },
  tvlSubprotocols: {
    totalBtc: 0,
    totalUsd: 0,
  },
  tvlZero: {
    totalBtc: 0,
    totalUsd: 0,
  },
  tvlMynt: {
    totalBtc: 0,
    totalUsd: 0,
  },
  total_btc: 0,
  total_usd: 0,
};

export const DEFAULT_VOLUME_DATA: VolumeDataResult = {
  btc: 0,
  usd: 0,
};

const graphWrapper = getGraphWrapperUrl();

export const LOCKED_DATA_URL = `${graphWrapper}/cmc/tvl`;
export const VOLUME_DATA_URL = `${graphWrapper}/cmc/summary`;

export const BTC_VALUE_PRECISION = 4;
export const USD_VALUE_PRECISION = 2;
