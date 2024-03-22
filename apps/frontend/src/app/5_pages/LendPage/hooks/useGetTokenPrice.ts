import { SupportedTokens } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetTokenPrice = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);

  const { value: tokenPrice } = useCacheCall(
    `poolToken/${lendContract?.address}/tokenPrice`,
    RSK_CHAIN_ID,
    async () => lendContract?.tokenPrice().then(fromWei),
    [],
    '0',
  );

  return { tokenPrice };
};
