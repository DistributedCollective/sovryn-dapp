import { Decimal } from '@sovryn/utils';

export type EcosystemStatisticsProps = {
  selectedCurrency: string;
  btcPrice: string;
  onChange: (section: string, value: Decimal, isSubSection?: boolean) => void;
};

export type PoolData = Record<string, Decimal>;
