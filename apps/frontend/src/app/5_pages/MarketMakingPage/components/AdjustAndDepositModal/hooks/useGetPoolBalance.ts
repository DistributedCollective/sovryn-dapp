import { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { decimalic } from '../../../../../../utils/math';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';
import { AdjustType } from '../AdjustAndDepositModal.types';

export const useGetPoolBalance = (
  isAmountZero: boolean,
  adjustType: AdjustType,
  loadingA: boolean,
  pool: AmmLiquidityPool,
  account: string,
) => {
  const [tokenPoolBalance, setTokenPoolBalance] = useState<Decimal>(
    Decimal.ZERO,
  );

  useEffect(() => {
    const fetchPoolBalance = async () => {
      const { abi, address } = await getProtocolContract(
        'liquidityMiningProxy',
        defaultChainId,
      );

      const contract = new ethers.Contract(
        address,
        abi,
        getProvider(defaultChainId),
      );
      const poolBalance = await contract.getUserInfo(pool.poolTokenA, account);

      if (poolBalance) {
        setTokenPoolBalance(decimalic(poolBalance.amount.toString()));
      }
    };
    if (!isAmountZero && adjustType === AdjustType.Withdraw && !loadingA) {
      fetchPoolBalance();
    }
  }, [isAmountZero, adjustType, loadingA, pool, account]);

  return { tokenPoolBalance };
};
