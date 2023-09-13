import { SupportedTokens } from '@sovryn/contracts';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetMarketLiquidity = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value } = useCacheCall(
    `loanTokens/${lendContract?.address}/marketLiquidity`,
    async () => lendContract?.marketLiquidity(),
    [],
    '0',
  );

  return { availableAmount: value ? fromWei(value) : '0' };
};
