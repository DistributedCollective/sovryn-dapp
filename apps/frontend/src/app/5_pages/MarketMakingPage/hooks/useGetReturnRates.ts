import { useState, useEffect } from 'react';

import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { getAmmServiceUrl } from '../../../../utils/helpers';
import { AmmLiquidityPoolDictionary } from '../utils/AmmLiquidityPoolDictionary';
import { AmmResponse, ReturnRates } from './useGetReturnRate';

const ammPools = AmmLiquidityPoolDictionary.list();

type ReturnRatePool = ReturnRates & {
  pool: string;
};
export const useGetReturnRates = () => {
  const ammServiceUrl = getAmmServiceUrl();
  const { value: block } = useBlockNumber();
  const [rates, setRates] = useState<ReturnRatePool[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ammServiceUrl}/amm`);
        const data: AmmResponse = await response.json();

        const rates: ReturnRatePool[] = [];

        ammPools.forEach(ammPool => {
          if (!data[ammPool.converter]) {
            return;
          }

          const targetPoolData =
            data[ammPool.converter].data[
              Object.keys(data[ammPool.converter].data)[0]
            ];
          const lastEntry = targetPoolData[targetPoolData.length - 1];

          rates.push({
            beforeRewards: lastEntry
              ? parseFloat(lastEntry.APY_rewards_pc).toFixed(2)
              : '0',
            afterRewards: lastEntry
              ? parseFloat(lastEntry.APY_pc).toFixed(2)
              : '0',
            pool: ammPool.converter,
          });
        });

        setRates([...rates]);
      } catch (error) {
        console.error('Error fetching amm pool data:', error);
      }
    };

    fetchData();
  }, [ammServiceUrl, block]);

  return { rates };
};
