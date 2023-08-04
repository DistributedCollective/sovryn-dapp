import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetProfitOf = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value: profit } = useCacheCall(
    `poolToken/${lendContract?.address}/profitOf/${account}`,
    async () => (account ? lendContract?.profitOf(account).then(fromWei) : '0'),
    [account],
    '0',
  );

  return { profit };
};
