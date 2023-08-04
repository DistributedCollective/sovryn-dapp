import { SupportedTokens } from '@sovryn/contracts';

import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetTokenPrice = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value: tokenPrice } = useCacheCall(
    `poolToken/${lendContract?.address}/tokenPrice`,
    async () => lendContract?.tokenPrice().then(fromWei),
    [],
    '0',
  );

  return { tokenPrice };
};
