import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { getProtocolContract, SupportedTokens } from '@sovryn/contracts';

import { defaultChainId } from '../../../../config/chains';
import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { fromWei } from '../../../../utils/math';
import { useGetSourceTokenBalance } from './useGetSourceTokenBalance';

export const useGetMaximumAvailableAmount = (sourceToken: SupportedTokens) => {
  const { weiBalance: sourceTokenWeiBalance, balance: sourceTokenBalance } =
    useGetSourceTokenBalance(sourceToken);

  const [massetManagerAddress, setMassetManagerAddress] = useState('');

  useEffect(() => {
    const getMassetManagerDetails = async () => {
      const { address: massetManagerAddress } = await getProtocolContract(
        'massetManager',
        defaultChainId,
      );
      return massetManagerAddress;
    };

    getMassetManagerDetails().then(result => setMassetManagerAddress(result));
  }, []);

  const { value: aggregatorWeiBalance } = useAssetBalance(
    sourceToken,
    defaultChainId,
    massetManagerAddress,
  );

  const aggregatorBalance = useMemo(
    () => String(Number(fromWei(aggregatorWeiBalance))),
    [aggregatorWeiBalance],
  );

  if (sourceToken === SupportedTokens.dllr) {
    return sourceTokenBalance;
  }

  return BigNumber.from(sourceTokenWeiBalance).lt(aggregatorWeiBalance)
    ? sourceTokenBalance
    : aggregatorBalance;
};
