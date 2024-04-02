import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { getProtocolContract, SupportedTokens } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useIsMounted } from '../../../../hooks/useIsMounted';
import {
  SMART_ROUTER_ALLOWED_TOKENS,
  BASSETS,
  MASSET,
} from '../ConvertPage.constants';

export const useGetMaximumAvailableAmount = (
  sourceToken: SupportedTokens,
  destinationToken: SupportedTokens,
  chain?: ChainId,
) => {
  const currentChainId = useCurrentChain();
  const isMounted = useIsMounted();
  const { account } = useAccount();

  //  bAsset => DLLR conversion
  const isMint = useMemo(
    () => BASSETS.includes(sourceToken) && destinationToken === MASSET,
    [destinationToken, sourceToken],
  );

  const isZero = useMemo(
    () =>
      SMART_ROUTER_ALLOWED_TOKENS.includes(sourceToken) &&
      SMART_ROUTER_ALLOWED_TOKENS.includes(destinationToken),
    [destinationToken, sourceToken],
  );

  const { weiBalance: sourceTokenWeiBalance, balance: sourceTokenBalance } =
    useAssetBalance(sourceToken, chain ?? currentChainId);

  const [massetManagerAddress, setMassetManagerAddress] = useState('');

  useEffect(() => {
    const getMassetManagerDetails = async () => {
      const { address: massetManagerAddress } = await getProtocolContract(
        'massetManager',
        chain ?? currentChainId,
      );
      return massetManagerAddress;
    };

    getMassetManagerDetails().then(result => {
      if (isMounted()) {
        setMassetManagerAddress(result);
      }
    });
  }, [chain, currentChainId, isMounted]);

  const { weiBalance: destinationTokenAggregatorWeiBalance } = useAssetBalance(
    destinationToken,
    chain ?? currentChainId,
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
