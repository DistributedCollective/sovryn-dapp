import { SupportedTokens } from '@sovryn/contracts';

import { rskChainId } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetTokenPrice = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', rskChainId);

  const { value: tokenPrice } = useCacheCall(
    `poolToken/${lendContract?.address}/tokenPrice`,
    rskChainId,
    async () => lendContract?.tokenPrice().then(fromWei),
    [],
    '0',
  );

  return { tokenPrice };
};
