import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetCheckpointPrice = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value: checkpointPrice } = useCacheCall(
    `poolToken/${lendContract?.address}/checkpointPrice/${account}`,
    async () =>
      account ? lendContract?.checkpointPrice(account).then(fromWei) : '0',
    [account],
    '0',
  );

  return { checkpointPrice };
};
