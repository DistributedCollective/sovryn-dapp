import { useCallback, useEffect, useMemo, useState } from 'react';

import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import {
  defaultValue,
  WithdrawContextStateType,
} from '../contexts/withdraw-boltz-context';

export function useWithdrawBoltzConfig() {
  const [state, setState] = useState<WithdrawContextStateType>(defaultValue);

  const fastBtcBridgeContract = useGetProtocolContract('fastBtcBridge');

  const getFastBtcBridgeParams = useCallback(async () => {
    let minTransferSatoshi = 0;
    let maxTransferSatoshi = 0;
    let feeStructures = {
      baseFeeSatoshi: 0,
      dynamicFee: 0,
    };

    if (fastBtcBridgeContract) {
      minTransferSatoshi = await fastBtcBridgeContract.minTransferSatoshi();
      maxTransferSatoshi = await fastBtcBridgeContract.maxTransferSatoshi();
      const currentFeeStructureIndex =
        await fastBtcBridgeContract.currentFeeStructureIndex();
      feeStructures = await fastBtcBridgeContract.feeStructures(
        currentFeeStructureIndex,
      );
    }

    return {
      minTransferSatoshi: minTransferSatoshi,
      maxTransferSatoshi: maxTransferSatoshi,
      feeStructures: feeStructures,
    };
  }, [fastBtcBridgeContract]);

  useEffect(() => {
    getFastBtcBridgeParams()
      .then(data => {
        setState(prevState => ({
          ...prevState,
          limits: {
            min: data.minTransferSatoshi,
            max: data.maxTransferSatoshi,
            baseFee: data.feeStructures.baseFeeSatoshi,
            dynamicFee: data.feeStructures.dynamicFee,
            loading: false,
          },
        }));
      })
      .catch(error => {
        console.error(error);
        setState(prevState => ({
          ...prevState,
          limits: { ...prevState.limits, loading: false },
        }));
      });
  }, [getFastBtcBridgeParams]);

  return useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state, setState],
  );
}
