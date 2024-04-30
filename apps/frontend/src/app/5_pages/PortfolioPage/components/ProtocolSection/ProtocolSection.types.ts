import { Decimal } from '@sovryn/utils';

export type ProtocolSectionProps = {
  selectedCurrency: string;
  nativeTokenPrice: string;
  onValueChange: (value: Decimal, poolIdentifier: ProtocolTypes) => void;
};

export type PoolValues = {
  [key: string]: Decimal;
};

export enum ProtocolTypes {
  MARKET_MAKING = 'MARKET_MAKING',
  STABILITY_POOL = 'STABILITY_POOL',
  ZERO_LINE_OF_CREDIT = 'ZERO_LINE_OF_CREDIT',
  LENDING = 'LENDING',
  STAKING = 'STAKING',
}
