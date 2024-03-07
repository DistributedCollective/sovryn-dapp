import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  defaultValue,
  DepositBoltzContextStateType,
} from '../contexts/deposit-boltz-context';
import { boltz } from '../utils/boltz/boltz.client';

export function useDepositBoltzConfig() {
  const [state, setState] =
    useState<DepositBoltzContextStateType>(defaultValue);

  const getBoltzLimits = useCallback(async () => {
    const contracts = await boltz.getContracts();
    const pair = await boltz
      .getReverseSwapPairs()
      .then(pairs => pairs['BTC']['RBTC']);
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
