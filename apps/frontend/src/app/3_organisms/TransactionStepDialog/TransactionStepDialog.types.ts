import { BigNumberish, ethers } from 'ethers';

export interface TxConfig {
  amount?: BigNumberish;
  unlimitedAmount?: boolean;
  gasLimit?: BigNumberish;
  gasPrice?: string;
  value?: BigNumberish;
  hash?: string;
}

export interface Transaction {
  title: string;
  subtitle?: string;
  contract: ethers.Contract;
  fnName: string;
  args: any[];
  config?: TxConfig;
  onComplete?: (hash: string) => void;
}
