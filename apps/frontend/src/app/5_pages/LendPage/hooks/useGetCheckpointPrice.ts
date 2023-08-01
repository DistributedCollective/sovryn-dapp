import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { fromWei } from '../../../../utils/math';

export const useGetCheckpointPrice = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens');
  const [checkpointPrice, setCheckpointPrice] = useState('0');

  const getCheckpointPrice = useCallback(async () => {
    const price = await asyncCall(
      `poolToken/${lendContract?.address}/checkpointPrice/${account}`,
      () => lendContract?.checkpointPrice(account),
    );
    if (price) {
      setCheckpointPrice(fromWei(price));
    }
  }, [lendContract, account]);

  useEffect(() => {
    if (account && lendContract) {
      getCheckpointPrice();
    }
  }, [getCheckpointPrice, account, lendContract]);

  return { checkpointPrice };
};
