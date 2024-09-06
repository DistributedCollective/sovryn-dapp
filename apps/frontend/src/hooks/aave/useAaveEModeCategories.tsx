import { useEffect, useState } from 'react';

import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../config/chains';

import { config } from '../../constants/aave';
import { EModeCategory } from '../../types/aave';
import { AaveEModeCategories } from '../../utils/aave/AaveEModeCategories';
import { useAaveReservesData } from './useAaveReservesData';

const eModeCategoriesFetcher = new AaveEModeCategories(
  config.PoolAddress,
  getProvider(BOB_CHAIN_ID),
);

export const useAaveEModeCategories = (): EModeCategory[] => {
  const { reserves } = useAaveReservesData();
  const [categories, setCategories] = useState<EModeCategory[]>([]);

  useEffect(() => {
    eModeCategoriesFetcher
      .getAllEModeCategories(reserves)
      .then(setCategories)
      .catch(console.error);
  }, [reserves]);

  return categories;
};
