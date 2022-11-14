import { BigNumberish, ethers } from 'ethers';

export interface TxConfig {
  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;
  value?: BigNumberish;
}

export interface TxCustom {
  amount?: BigNumberish;
  unlimitedAmount?: boolean;
  decimals?: number;
  symbol?: string;
  config?: TxConfig;
}

export interface Transaction {
  title: string;
  subtitle?: string;
  contract: ethers.Contract;
  fnName: string;
  args: any[];
  config?: TxConfig;
}
