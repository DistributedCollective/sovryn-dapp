import { isValidChecksumAddress } from 'ethereumjs-util';
import { ethers } from 'ethers';

import { COMMON_SYMBOLS } from '../../../../../../../../../utils/asset';
import { decimalic, toWei } from '../../../../../../../../../utils/math';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';

export const renderCalldata = (
  recipientAddress: string,
  amount: string,
  tokenAddress?: string,
) => {
  const coder = new ethers.utils.AbiCoder();
  if (!tokenAddress) {
    return coder.encode(
      ['address', 'uint256'],
      [recipientAddress, toWei(amount)],
    );
  } else {
    return coder.encode(
      ['address', 'address', 'uint256'],
      [recipientAddress, tokenAddress, toWei(amount)],
    );
  }
};

export const renderSignature = (token: string) => {
  return token === COMMON_SYMBOLS.BTC
    ? 'transferRbtc(address,uint256)'
    : 'transferTokens(address,address,uint256)';
};

export const isValidParameter = (
  parameter: ProposalCreationParameter,
  isValidAddress: boolean,
) => {
  const { token, amount, recipientAddress } =
    parameter.treasuryStepExtraData || {};

  return (
    token &&
    amount &&
    decimalic(amount).gt(0) &&
    isValidAddress &&
    recipientAddress &&
    isValidChecksumAddress(recipientAddress)
  );
};
