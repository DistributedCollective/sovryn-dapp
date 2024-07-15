import { getIndexerUrl } from '../../../../../utils/helpers';
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
  total_usd: 0,
};

export const DEFAULT_VOLUME_DATA: VolumeDataResult = {
  usd: 0,
};

const indexer = getIndexerUrl();

export const LOCKED_DATA_URL = `${indexer}legacycmc/tvl`;
export const VOLUME_DATA_URL = `${indexer}legacy/cmc/summary`;

export const BTC_VALUE_PRECISION = 4;
export const USD_VALUE_PRECISION = 2;
