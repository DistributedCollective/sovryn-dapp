import { BigNumber, Contract } from 'ethers';

import {
  SupportedTokens,
  getLoanTokenContract,
  getProtocolContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetBalanceOf = (asset: SupportedTokens) => {
  const { account } = useAccount();

  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);

  const { value: balanceTotal } = useCacheCall(
    `loanTokens/${lendContract?.address}/balanceOf/${account}`,
    RSK_CHAIN_ID,
    async () => {
      if (!account) {
        return Promise.resolve('0');
      }
      let directBalance = BigNumber.from(0);
      let balanceInLM = BigNumber.from(0);

      const { address, abi } = await getLoanTokenContract(asset, RSK_CHAIN_ID);

      try {
        const contract = new Contract(address, abi, getProvider(RSK_CHAIN_ID));
        directBalance = contract.balanceOf(account);
      } catch (e) {}

      try {
        const { address: lmAddress, abi: lmAbi } = await getProtocolContract(
          'liquidityMiningProxy',
          RSK_CHAIN_ID,
        );

        const contract = new Contract(
          lmAddress,
          lmAbi,
          getProvider(RSK_CHAIN_ID),
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
