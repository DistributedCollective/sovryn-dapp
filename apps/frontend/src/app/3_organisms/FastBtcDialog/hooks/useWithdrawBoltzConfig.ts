import { useCallback, useEffect, useMemo, useState } from 'react';

import { getContracts } from '../../Boltz/Boltz.utils';
import {
  defaultValue,
  WithdrawBoltzContextStateType,
} from '../contexts/withdraw-boltz-context';
import { boltz } from '../utils/boltz';

export function useWithdrawBoltzConfig() {
  const [state, setState] =
    useState<WithdrawBoltzContextStateType>(defaultValue);

  const getBoltzLimits = useCallback(async () => {
    const contracts = await getContracts();
    const pair = await boltz
      .getSubmarineSwapPairs()
      .then(pairs => pairs['RBTC']['BTC']);
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
