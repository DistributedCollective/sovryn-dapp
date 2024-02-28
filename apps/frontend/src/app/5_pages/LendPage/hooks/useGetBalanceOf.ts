import { BigNumber, Contract } from 'ethers';

import {
  SupportedTokens,
  getLoanTokenContract,
  getProtocolContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { rskChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetBalanceOf = (asset: SupportedTokens) => {
  const { account } = useAccount();

  const lendContract = useLoadContract(asset, 'loanTokens', rskChainId);

  const { value: balanceTotal } = useCacheCall(
    `loanTokens/${lendContract?.address}/balanceOf/${account}`,
    rskChainId,
    async () => {
      if (!account) {
        return Promise.resolve('0');
      }
      let directBalance = BigNumber.from(0);
      let balanceInLM = BigNumber.from(0);

      const { address, abi } = await getLoanTokenContract(asset, rskChainId);

      try {
        const contract = new Contract(address, abi, getProvider(rskChainId));
        directBalance = contract.balanceOf(account);
      } catch (e) {}

      try {
        const { address: lmAddress, abi: lmAbi } = await getProtocolContract(
          'liquidityMiningProxy',
          rskChainId,
        );

        const contract = new Contract(
          lmAddress,
          lmAbi,
          getProvider(rskChainId),
        );
        balanceInLM = await contract.getUserPoolTokenBalance(address, account);
      } catch (e) {}

      return fromWei(directBalance.add(balanceInLM).toString());
    },
    [account],
    '0',
  );

  return { balanceTotal };
};
