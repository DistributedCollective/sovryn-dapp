import { ReactNode } from 'react';

export type ContractData = {
  title: string;
  value: ReactNode;
  highlight?: boolean;
};

export type ContractDataItem = {
  totalBtc: string;
  totalUsd: string;
};
