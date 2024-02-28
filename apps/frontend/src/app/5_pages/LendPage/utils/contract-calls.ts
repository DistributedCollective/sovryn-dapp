import { Contract } from 'ethers';

import {
  SupportedTokens,
  getLoanTokenContract,
  getProtocolContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { rskChainId } from '../../../../config/chains';

import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const lendingBalanceOf = async (
  asset: SupportedTokens,
  owner: string,
) => {
  let directBalance = Decimal.ZERO;
  let balanceInLM = Decimal.ZERO;

  const { address, abi } = await getLoanTokenContract(asset, rskChainId);

  try {
    const contract = new Contract(address, abi, getProvider(rskChainId));
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
      rskChainId,
    );

    const contract = new Contract(lmAddress, lmAbi, getProvider(rskChainId));
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
