import { ethers } from 'ethers';

import { TREASURY_PROPOSAL_SIGNATURES } from './ProposalExecutableDetails.constants';

export const isTreasuryProposalParameter = (signature: string) =>
  TREASURY_PROPOSAL_SIGNATURES.includes(signature);

export const decodeTreasuryCalldata = (
  functionName: string,
  calldata: string,
) => {
  const coder = new ethers.utils.AbiCoder();

  if (functionName === 'transferRbtc') {
    return coder.decode(['address', 'uint256'], calldata);
  } else {
    return coder.decode(['address', 'address', 'uint256'], calldata);
  }
};
