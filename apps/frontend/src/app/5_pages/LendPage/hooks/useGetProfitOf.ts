import { SupportedTokens } from '@sovryn/contracts';

import { rskChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetProfitOf = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens', rskChainId);

  const { value: profit } = useCacheCall(
    `poolToken/${lendContract?.address}/profitOf/${account}`,
    rskChainId,
    async () => (account ? lendContract?.profitOf(account).then(fromWei) : '0'),
    [account],
    '0',
  );

  return { profit };
};
