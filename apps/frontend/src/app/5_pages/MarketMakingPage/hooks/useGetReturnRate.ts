import { useQuery } from '@tanstack/react-query';

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

  const { data } = useQuery({
    queryKey: ['ammPoolReturnRates', converter, block],
    queryFn: async () => {
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

          return {
            beforeRewards: avgFeesApy,
            afterRewards: avgTotalApy,
          };
        } else {
          return { beforeRewards: '0', afterRewards: '0' };
        }
      } else {
        return { beforeRewards: '0', afterRewards: '0' };
      }
    },
    initialData: { beforeRewards: '0', afterRewards: '0' },
  });

  return data;
};
