import { SupportedTokens } from '@sovryn/contracts';

import { defaultRskChainId } from '../../../../../../../../config/chains';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetMarketLiquidity = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', defaultRskChainId);

  const { value } = useCacheCall(
    `loanTokens/${lendContract?.address}/marketLiquidity`,
    defaultRskChainId,
    async () => lendContract?.marketLiquidity(),
    [],
    '0',
  );

  return { availableAmount: value ? fromWei(value) : '0' };
};
