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

          if (poolData && poolData.length > 0) {
            const sumFeesApy = poolData.reduce(
              (acc, entry) => acc + parseFloat(entry.APY_fees_pc),
              0,
            );
            const sumTotalApy = poolData.reduce(
              (acc, entry) => acc + parseFloat(entry.APY_pc),
              0,
            );

            const avgFeesApy = (sumFeesApy / poolData.length).toFixed(2);
            const avgTotalApy = (sumTotalApy / poolData.length).toFixed(2);

            setReturnRates({
              beforeRewards: avgFeesApy,
              afterRewards: avgTotalApy,
            });
          } else {
            setReturnRates({ beforeRewards: '0', afterRewards: '0' });
          }
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
