import { getIndexerUrl } from '../../../../../utils/helpers';
import { LockedDataResult, VolumeDataResult } from './ProtocolData.types';

export const DEFAULT_LOCKED_DATA: LockedDataResult = {
  tvlLending: {
    totalUsd: '0',
  },
  tvlAmm: {
    totalUsd: '0',
  },
  tvlProtocol: {
    totalUsd: '0',
  },
  tvlStaking: {
    totalUsd: '0',
  },
  tvlSubprotocols: {
    totalUsd: '0',
  },
  tvlZero: {
    totalUsd: '0',
  },
  tvlMynt: {
    totalUsd: '0',
  },
  tvlSdex: {
    totalUsd: '0',
  },
  total_usd: '0',
};

export const DEFAULT_VOLUME_DATA: VolumeDataResult = {
  usd: 0,
};

/** @deprecated */
const indexer = getIndexerUrl() + '/';

export const LOCKED_DATA_URL = `${indexer}legacy/cmc/tvl`;
export const VOLUME_DATA_URL = `${indexer}legacy/cmc/summary`;

export const BTC_VALUE_PRECISION = 4;
export const USD_VALUE_PRECISION = 2;
