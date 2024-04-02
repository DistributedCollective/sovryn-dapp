import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { getProtocolContract, SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useIsMounted } from '../../../../hooks/useIsMounted';
import { allowedTokens, bassets, masset } from '../ConvertPage.types';
import { ChainId } from '@sovryn/ethers-provider';

export const useGetMaximumAvailableAmount = (
  sourceToken: SupportedTokens,
  destinationToken: SupportedTokens,
  chain: ChainId = defaultChainId,
) => {
  const isMounted = useIsMounted();
  const { account } = useAccount();

  //  bAsset => DLLR conversion
  const isMint = useMemo(
    () => bassets.includes(sourceToken) && destinationToken === masset,
    [destinationToken, sourceToken],
  );

  const isZero = useMemo(
    () =>
      allowedTokens.includes(sourceToken) &&
      allowedTokens.includes(destinationToken),
    [destinationToken, sourceToken],
  );

  const { weiBalance: sourceTokenWeiBalance, balance: sourceTokenBalance } =
    useAssetBalance(sourceToken, chain);

  const [massetManagerAddress, setMassetManagerAddress] = useState('');

  // useEffect(() => {
  //   const getMassetManagerDetails = async () => {
  //     const { address: massetManagerAddress } = await getProtocolContract(
  //       'massetManager',
  //       chain,
  //     );
  //     return massetManagerAddress;
  //   };

  //   getMassetManagerDetails().then(result => {
  //     if (isMounted()) {
  //       setMassetManagerAddress(result);
  //     }
  //   });
  // }, [chain, isMounted]);

  const { weiBalance: destinationTokenAggregatorWeiBalance } = useAssetBalance(
    destinationToken,
    chain,
    massetManagerAddress,
  );

  const destinationTokenAggregatorBalance = useMemo(
    () => Decimal.fromBigNumberString(destinationTokenAggregatorWeiBalance),
    [destinationTokenAggregatorWeiBalance],
  );

  if (!account) {
    return Decimal.ZERO;
  }

  if (isMint || !isZero) {
    return sourceTokenBalance;
  }

  return BigNumber.from(sourceTokenWeiBalance).lt(
    destinationTokenAggregatorWeiBalance,
  )
    ? sourceTokenBalance
    : destinationTokenAggregatorBalance;
};
