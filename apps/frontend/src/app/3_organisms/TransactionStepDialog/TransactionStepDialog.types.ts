import { BigNumberish, ethers } from 'ethers';

import { StatusType } from '@sovryn/ui';

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
  onStart?: (hash: string) => void;
  onComplete?: (hash: string) => void;
  onChangeStatus?: (status: StatusType) => void;
}
