import { SupportedTokens } from '@sovryn/contracts';

import { rskChainId } from '../../../../../../../../config/chains';

import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetTotalAssetBorrow = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', rskChainId);

  const { value } = useCacheCall(
    `loanTokens/${lendContract?.address}/totalAssetBorrow`,
    rskChainId,
    async () => lendContract?.totalAssetBorrow(),
    [],
    '0',
  );

  return { borrowedAmount: value ? fromWei(value) : value };
};
