import { SupportedTokens } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../../../../../config/chains';

import { useAccount } from '../../../../../../../../hooks/useAccount';
import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetAssetBalanceOf = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);

  const { value: assetBalance } = useCacheCall(
    `loanTokens/${lendContract?.address}/assetBalanceOf/${account}`,
    RSK_CHAIN_ID,
    async () =>
      account ? lendContract?.assetBalanceOf(account).then(fromWei) : '0',
    [account],
    '0',
  );

  return { assetBalance };
};
