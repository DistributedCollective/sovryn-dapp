import { Contract } from 'ethers';

import {
  SupportedTokens,
  getLoanTokenContract,
  getProtocolContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const lendingBalanceOf = async (
  asset: SupportedTokens,
  owner: string,
) => {
  let directBalance = Decimal.ZERO;
  let balanceInLM = Decimal.ZERO;

  const { address, abi } = await getLoanTokenContract(asset, RSK_CHAIN_ID);

  try {
    const contract = new Contract(address, abi, getProvider(RSK_CHAIN_ID));
    directBalance = await asyncCall(
      `loanToken/${address}/balanceOf/${owner}`,
      () => contract.balanceOf(owner),
    ).then(Decimal.fromBigNumberString);
  } catch (e) {
    console.log(`useLending_balanceOf balanceOf failed for ${asset}`);
  }

  try {
    const { address: lmAddress, abi: lmAbi } = await getProtocolContract(
      'liquidityMiningProxy',
      RSK_CHAIN_ID,
    );

    const contract = new Contract(lmAddress, lmAbi, getProvider(RSK_CHAIN_ID));
    balanceInLM = await asyncCall(
      `liquidityMiningProxy/getUserPoolTokenBalance/${address}/${owner}`,
      () => contract.getUserPoolTokenBalance(address, owner),
    ).then(Decimal.fromBigNumberString);
  } catch (e) {
    console.log(
      `useLending_balanceOf getUserPoolTokenBalance failed for ${asset}`,
    );
  }

  return directBalance.add(balanceInLM);
};
