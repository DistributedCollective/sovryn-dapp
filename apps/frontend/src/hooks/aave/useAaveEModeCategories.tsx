import { useEffect, useMemo, useState } from 'react';

import { config } from '../../constants/aave';
import { EModeCategory } from '../../types/aave';
import { AaveEModeCategories } from '../../utils/aave/AaveEModeCategories';
import { useAccount } from '../useAccount';
import { useAaveReservesData } from './useAaveReservesData';

export const useAaveEModeCategories = (): EModeCategory[] => {
  const { reserves } = useAaveReservesData();
  const { provider } = useAccount();
  const [categories, setCategories] = useState<EModeCategory[]>([]);

  const eModeCategoriesFetcher = useMemo(
    () =>
      provider ? new AaveEModeCategories(config.PoolAddress, provider) : null,
    [provider],
  );

  useEffect(() => {
    if (!eModeCategoriesFetcher) {
      return;
    }

    eModeCategoriesFetcher
      .getAllEModeCategories(reserves)
      .then(setCategories)
      .catch(console.error);
  }, [eModeCategoriesFetcher, reserves]);

  return categories;
};
