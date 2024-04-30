import { SupportedTokens } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../../../../../config/chains';

import { useBlockNumber } from '../../../../../../../../hooks/useBlockNumber';
import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetTotalAssetBorrow = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);
  const { value: block } = useBlockNumber(RSK_CHAIN_ID);

  const { value } = useCacheCall(
    `loanTokens/${lendContract?.address}/totalAssetBorrow`,
    RSK_CHAIN_ID,
    async () => lendContract?.totalAssetBorrow(),
    [block],
    '0',
  );

  return { borrowedAmount: value ? fromWei(value) : value };
};
