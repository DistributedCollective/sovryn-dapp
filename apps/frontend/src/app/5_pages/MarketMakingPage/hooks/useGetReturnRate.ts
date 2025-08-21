import { useState, useEffect } from 'react';

import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { getAmmServiceUrl } from '../../../../utils/helpers';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

type PoolData = {
  APY_fees_pc: string;
  APY_rewards_pc: string;
  APY_pc: string;
};

export type AmmResponse = {
  [key: string]: {
    pool: string;
    data: {
      [key: string]: PoolData[];
    };
  };
};

export type ReturnRates = {
  beforeRewards: string;
  afterRewards: string;
};

export const useGetReturnRate = ({
  converter,
  converterVersion,
  poolTokenA,
}: AmmLiquidityPool) => {
  const ammServiceUrl = getAmmServiceUrl();
  const { value: block } = useBlockNumber();

  const [returnRates, setReturnRates] = useState<ReturnRates>({
    beforeRewards: '0',
    afterRewards: '0',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ammServiceUrl}/amm`);
        const data: AmmResponse = await response.json();

        if (data[converter]) {
          const poolData =
            converterVersion === 1
              ? data[converter].data[Object.keys(data[converter].data)[0]]
              : data[converter].data[poolTokenA];

          const lastEntry = poolData[poolData.length - 1];

          const totalAPY = {
            beforeRewards: lastEntry
              ? parseFloat(lastEntry.APY_rewards_pc).toFixed(2)
              : '0',
            afterRewards: lastEntry
              ? parseFloat(lastEntry.APY_pc).toFixed(2)
              : '0',
          };

          setReturnRates(totalAPY);
        } else {
          setReturnRates({ beforeRewards: '0', afterRewards: '0' });
        }
      } catch (error) {
        console.error('Error fetching amm pool data:', error);
      }
    };

    fetchData();
  }, [ammServiceUrl, block, converter, converterVersion, poolTokenA]);

  return { returnRates };
};
