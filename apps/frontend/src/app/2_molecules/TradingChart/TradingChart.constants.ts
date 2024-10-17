import { storageFactory } from 'storage-factory';

import { ResolutionString } from '@sovryn/charting-library/src/charting_library';

import { CandleDuration } from './hooks/useGetCandles';

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
  '10': CandleDuration.M_1,
  '15': CandleDuration.M_15,
  '30': CandleDuration.M_15,
  '60': CandleDuration.H_1,
  H: CandleDuration.H_1,
  '240': CandleDuration.H_4,
  '720': CandleDuration.H_4,
  '1440': CandleDuration.D_1,
  D: CandleDuration.D_1,
  '1D': CandleDuration.D_1,
  '3D': CandleDuration.D_1,
  W: CandleDuration.D_1,
  '1W': CandleDuration.D_1,
  M: CandleDuration.D_1,
  '1M': CandleDuration.D_1,
};

export const local = storageFactory(() => localStorage);

export const chartStorageKey = 'sovryn.charts';

export const config = {
  exchanges: [],
  symbols_types: [],
  supported_resolutions: supportedResolutions,
  supports_time: false,
};
