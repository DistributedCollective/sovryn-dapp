import { ethers } from 'ethers';

export type MultiCallData = {
  contract: ethers.Contract;
  fnName: string;
  args: any[];
  key: string;
  parser?: (val: any) => any;
};
