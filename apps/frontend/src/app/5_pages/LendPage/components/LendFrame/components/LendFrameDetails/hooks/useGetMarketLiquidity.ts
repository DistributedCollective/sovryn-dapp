import { SupportedTokens } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../../../../../config/chains';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetMarketLiquidity = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);

  const { value } = useCacheCall(
    `loanTokens/${lendContract?.address}/marketLiquidity`,
    RSK_CHAIN_ID,
    async () => lendContract?.marketLiquidity(),
    [],
    '0',
  );

  return { availableAmount: value ? fromWei(value) : '0' };
};
