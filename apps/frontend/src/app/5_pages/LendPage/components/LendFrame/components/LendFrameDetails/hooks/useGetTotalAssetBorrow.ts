import { SupportedTokens } from '@sovryn/contracts';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetTotalAssetBorrow = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value } = useCacheCall(
    `loanTokens/${asset}/totalAssetBorrow`,
    async () => lendContract?.totalAssetBorrow(),
    [],
    '0',
  );

  return { borrowedAmount: value ? fromWei(value) : value };
};
