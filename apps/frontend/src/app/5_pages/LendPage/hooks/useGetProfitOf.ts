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
    () => {
      if (!account) {
        return '0';
      }
      return lendContract?.profitOf(account).then(fromWei);
    },
    [account],
    '0',
  );

  return { profit };
};
