import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';

export const useSurplusCollateralBalance = (token: string | undefined) => {
  const { account } = useAccount();
  const { croc } = useCrocContext();
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    if (croc && account && token) {
      croc.token(token).wallet(account).then(setBalance);
    }
  }, [account, croc, token]);

  return balance;
};
