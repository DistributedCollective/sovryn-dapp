import { SupportedTokens } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetCheckpointPrice = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);
  const { value: block } = useBlockNumber(RSK_CHAIN_ID);

  const { value: checkpointPrice } = useCacheCall(
    `poolToken/${lendContract?.address}/checkpointPrice/${account}`,
    RSK_CHAIN_ID,
    async () =>
      account ? lendContract?.checkpointPrice(account).then(fromWei) : '0',
    [account, block],
    '0',
  );

  return { checkpointPrice };
};
