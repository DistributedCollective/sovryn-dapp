import { useEffect, useState } from 'react';

import { useLoaderData } from 'react-router-dom';

import { EthersLiquity } from '@sovryn-zero/lib-ethers';

import { useGetRBTCPrice } from './useGetRBTCPrice';

export const useIsSystemInRecoveryMode = () => {
  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
  };

  const { price } = useGetRBTCPrice();
  const [isInRecoveryMode, setIsInRecoveryMode] = useState(false);

  useEffect(() => {
    liquity.getTotal().then(result => {
      if (price && price !== '0') {
        const recoveryMode = result.collateralRatioIsBelowCritical(price);
        setIsInRecoveryMode(recoveryMode);
      }
    });
  }, [liquity, price]);

  return isInRecoveryMode;
};
