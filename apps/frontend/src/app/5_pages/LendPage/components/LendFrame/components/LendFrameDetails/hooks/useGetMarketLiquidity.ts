import { SupportedTokens } from '@sovryn/contracts';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetMarketLiquidity = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value: availableAmount } = useCacheCall(
    `loanTokens/${asset}/marketLiquidity`,
    () => lendContract?.marketLiquidity().then(fromWei),
    [],
    '0',
  );

  return { availableAmount };
};
