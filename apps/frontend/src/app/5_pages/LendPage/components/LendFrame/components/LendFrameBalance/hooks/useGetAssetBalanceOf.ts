import { SupportedTokens } from '@sovryn/contracts';

import { defaultRskChainId } from '../../../../../../../../config/chains';

import { useAccount } from '../../../../../../../../hooks/useAccount';
import { useCacheCall } from '../../../../../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetAssetBalanceOf = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens', defaultRskChainId);

  const { value: assetBalance } = useCacheCall(
    `loanTokens/${lendContract?.address}/assetBalanceOf/${account}`,
    defaultRskChainId,
    async () =>
      account ? lendContract?.assetBalanceOf(account).then(fromWei) : '0',
    [account],
    '0',
  );

  return { assetBalance };
};
