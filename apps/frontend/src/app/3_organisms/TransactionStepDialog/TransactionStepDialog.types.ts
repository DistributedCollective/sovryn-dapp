import { BigNumberish, ethers } from 'ethers';

export interface TxConfig {
  amount?: BigNumberish;
  unlimitedAmount?: boolean;
  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;
  value?: BigNumberish;
}

export interface Transaction {
  title: string;
  subtitle?: string;
  contract: ethers.Contract;
  fnName: string;
  args: any[];
  config?: TxConfig;
}
