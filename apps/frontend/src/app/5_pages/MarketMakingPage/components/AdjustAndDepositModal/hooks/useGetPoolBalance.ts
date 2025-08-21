import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { decimalic } from '../../../../../../utils/math';
import { AdjustType } from '../AdjustAndDepositModal.types';

export const useGetPoolBalance = (
  isAmountZero: boolean,
  adjustType: AdjustType,
  loadingA: boolean,
  poolToken: string,
  account: string,
) => {
  const [tokenPoolBalance, setTokenPoolBalance] = useState<Decimal>(
    Decimal.ZERO,
  );

  const chain = useCurrentChain();
  const liquidityMiningProxy = useGetProtocolContract(
    'liquidityMiningProxy',
    chain,
  );

  useEffect(() => {
    const fetchPoolBalance = async () => {
      if (!liquidityMiningProxy) {
        return;
      }
      try {
        const poolBalance = await liquidityMiningProxy.getUserInfo(
          poolToken,
          account,
        );
        if (poolBalance) {
          setTokenPoolBalance(decimalic(poolBalance.amount.toString()));
        }
      } catch (error) {
        console.error('Error fetching pool balance:', error);
      }
    };

    if (!isAmountZero && adjustType === AdjustType.Withdraw && !loadingA) {
      fetchPoolBalance();
    }
  }, [
    isAmountZero,
    adjustType,
    loadingA,
    account,
    liquidityMiningProxy,
    poolToken,
  ]);

  return { tokenPoolBalance };
};
