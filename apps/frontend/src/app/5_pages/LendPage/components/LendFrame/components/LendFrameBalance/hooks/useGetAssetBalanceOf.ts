import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../../../../../hooks/useAccount';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetAssetBalanceOf = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens');
  const [assetBalance, setAssetBalance] = useState('0');

  const getAssetBalance = useCallback(async () => {
    const price = await lendContract?.assetBalanceOf(account);
    if (price) {
      setAssetBalance(fromWei(price));
    }
  }, [lendContract, account]);

  useEffect(() => {
    if (account && lendContract) {
      getAssetBalance();
    }
  }, [getAssetBalance, account, lendContract]);

  return { assetBalance };
};
