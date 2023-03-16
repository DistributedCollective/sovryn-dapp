import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { getProtocolContract, SupportedTokens } from '@sovryn/contracts';

import { defaultChainId } from '../../../../config/chains';

import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useIsMounted } from '../../../../hooks/useIsMounted';
import { fromWei } from '../../../../utils/math';
import { bassets, masset } from '../ConvertPage.types';

export const useGetMaximumAvailableAmount = (
  sourceToken: SupportedTokens,
  destinationToken: SupportedTokens,
) => {
  const isMounted = useIsMounted();

  //  bAsset => DLLR conversion
  const isMint = useMemo(
    () => bassets.includes(sourceToken) && destinationToken === masset,
    [destinationToken, sourceToken],
  );

  const { weiBalance: sourceTokenWeiBalance, balance: sourceTokenBalance } =
    useAssetBalance(sourceToken);

  const [massetManagerAddress, setMassetManagerAddress] = useState('');

  useEffect(() => {
    const getMassetManagerDetails = async () => {
      const { address: massetManagerAddress } = await getProtocolContract(
        'massetManager',
        defaultChainId,
      );
      return massetManagerAddress;
    };

    getMassetManagerDetails().then(result => {
      if (isMounted()) {
        setMassetManagerAddress(result);
      }
    });
  }, [isMounted]);

  const { weiBalance: destinationTokenAggregatorWeiBalance } = useAssetBalance(
    destinationToken,
    defaultChainId,
    massetManagerAddress,
  );

  const destinationTokenAggregatorBalance = useMemo(
    () => fromWei(destinationTokenAggregatorWeiBalance).toString(),
    [destinationTokenAggregatorWeiBalance],
  );

  if (isMint) {
    return sourceTokenBalance;
  }

  return BigNumber.from(sourceTokenWeiBalance).lt(
    destinationTokenAggregatorWeiBalance,
  )
    ? sourceTokenBalance
    : destinationTokenAggregatorBalance;
};
