import { SupportedTokens } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetCheckpointPrice = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);

  const { value: checkpointPrice } = useCacheCall(
    `poolToken/${lendContract?.address}/checkpointPrice/${account}`,
    RSK_CHAIN_ID,
    async () =>
      account ? lendContract?.checkpointPrice(account).then(fromWei) : '0',
    [account],
    '0',
  );

  return { checkpointPrice };
};
