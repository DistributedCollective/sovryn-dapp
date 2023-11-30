import { useState, useEffect } from 'react';

import { getAmmServiceUrl } from '../../../../utils/helpers';

type PoolData = {
  APY_fees_pc: string;
  APY_rewards_pc: string;
  APY_pc: string;
};

type AmmResponse = {
  [key: string]: {
    pool: string;
    data: {
      [key: string]: PoolData[];
    };
  };
};

type ReturnRates = {
  beforeRewards: string;
  afterRewards: string;
};

export const useGetReturnRate = (targetPool: string) => {
  const ammServiceUrl = getAmmServiceUrl();
  const [returnRates, setReturnRates] = useState<ReturnRates>({
    beforeRewards: '0',
    afterRewards: '0',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ammServiceUrl}/amm`);
        const data: AmmResponse = await response.json();
        if (data[targetPool]) {
          const targetPoolData =
            data[targetPool].data[Object.keys(data[targetPool].data)[0]];
          const totalAPY = targetPoolData.reduce(
            (acc, entry) => {
              acc.beforeRewards = (
                parseFloat(acc.beforeRewards) + parseFloat(entry.APY_rewards_pc)
              ).toFixed(2);
              acc.afterRewards = (
                parseFloat(acc.afterRewards) + parseFloat(entry.APY_pc)
              ).toFixed(2);
              return acc;
            },
            { beforeRewards: '0', afterRewards: '0' } as ReturnRates,
          );
          setReturnRates(totalAPY);
        } else {
          setReturnRates({ beforeRewards: '0', afterRewards: '0' });
        }
      } catch (error) {
        console.error('Error fetching amm pool data:', error);
      }
    };

    fetchData();
  }, [ammServiceUrl, targetPool]);

  return { returnRates };
};
