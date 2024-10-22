import { storageFactory } from 'storage-factory';

import { ResolutionString } from '@sovryn/charting-library/src/charting_library';

import { INDEXER_SERVICE } from '../../../constants/infrastructure';
import { Environments } from '../../../types/global';
import { CandleDuration } from './dictionary';

export const REFRESH_RATE = 15 * 1e3;
export const MAXIMUM_CHUNK_SIZE = 1e3;
export const endTimeCache = new Map<string, number>();
export const supportedResolutions = [
  '10',
  '15',
  '30',
  '60',
  '240',
  '720',
  '1D',
  '3D',
  '1W',
  '1M',
] as ResolutionString[];

export const resolutionMap: { [key: string]: CandleDuration } = {
  '1': CandleDuration.M_1,
  '5': CandleDuration.M_1,
  '10': CandleDuration.M_10,
  '15': CandleDuration.M_15,
  '30': CandleDuration.M_30,
  '60': CandleDuration.H_1,
  H: CandleDuration.H_1,
  '240': CandleDuration.H_4,
  '720': CandleDuration.H_12,
  '1440': CandleDuration.D_1,
  D: CandleDuration.D_1,
  '1D': CandleDuration.D_1,
  '3D': CandleDuration.D_3,
  W: CandleDuration.W_1,
  '1W': CandleDuration.W_1,
  M: CandleDuration.D_30,
  '1M': CandleDuration.D_30,
};

export const local = storageFactory(() => localStorage);

export const chartStorageKey = 'sovryn.charts';

export const config = {
  exchanges: [],
  symbols_types: [],
  supported_resolutions: supportedResolutions,
  supports_time: false,
};

export const SOVRYN_INDEXER_MAINNET = `${
  INDEXER_SERVICE[Environments.Mainnet]
}chart?chainId=30&`;

export const SOVRYN_INDEXER_TESTNET = `${
  INDEXER_SERVICE[Environments.Testnet]
}chart?chainId=31&`;
