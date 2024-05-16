import { useCallback, useEffect, useMemo, useState } from 'react';

import { getContracts, getPair } from '../../Boltz/Boltz.utils';
import {
  defaultValue,
  WithdrawBoltzContextStateType,
} from '../contexts/withdraw-boltz-context';

export function useWithdrawBoltzConfig() {
  const [state, setState] =
    useState<WithdrawBoltzContextStateType>(defaultValue);

  const getBoltzLimits = useCallback(async () => {
    const contracts = await getContracts();
    const pair = await getPair();
    return {
      pair: pair!,
      contracts,
    };
  }, []);

  useEffect(() => {
    getBoltzLimits()
      .then(data => {
        setState(prevState => ({
          ...prevState,
          loadingPairData: false,
          fees: data.pair.fees,
          limits: data.pair.limits,
          rate: data.pair.rate,
          hash: data.pair.hash,
        }));
      })
      .catch(error => {
        console.error(error);
        setState(prevState => ({
          ...prevState,
          limits: { ...prevState.limits, loading: false },
        }));
      });
  }, [getBoltzLimits]);

  return useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state, setState],
  );
}
