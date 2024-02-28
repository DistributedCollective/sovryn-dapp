import { SupportedTokens } from '@sovryn/contracts';

import { rskChainId } from '../../../../../../../../config/chains';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetMarketLiquidity = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', rskChainId);

  const { value } = useCacheCall(
    `loanTokens/${lendContract?.address}/marketLiquidity`,
    rskChainId,
    async () => lendContract?.marketLiquidity(),
    [],
    '0',
  );

  return { availableAmount: value ? fromWei(value) : '0' };
};
