import { SupportedTokens } from '@sovryn/contracts';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetTotalAssetBorrow = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value: borrowedAmount } = useCacheCall(
    `loanTokens/${asset}/totalAssetBorrow`,
    () => lendContract?.totalAssetBorrow().then(fromWei),
    [],
    '0',
  );

  return { borrowedAmount };
};
