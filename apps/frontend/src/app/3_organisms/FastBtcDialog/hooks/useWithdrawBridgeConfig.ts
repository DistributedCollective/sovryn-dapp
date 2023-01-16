import { useCallback, useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';

import { Chains, defaultChainId } from '../../../../config/chains';
import { useAccount } from '../../../../hooks/useAccount';
import {
  defaultValue,
  WithdrawContextStateType,
} from '../contexts/withdraw-context';

export function useWithdrawBridgeConfig(network: Chains = Chains.RSK) {
  const [state, setState] = useState<WithdrawContextStateType>(defaultValue);
  const { signer } = useAccount();

  const getFastBtcBridgeContract = useCallback(async () => {
    const { address, abi } = await getProtocolContract(
      'fastBtcBridge',
      defaultChainId,
    );
    return new ethers.Contract(address, abi, signer);
  }, [signer]);

  const getFastBtcBridgeParams = useCallback(async () => {
    const fastBtcBridge = await getFastBtcBridgeContract();

    const minTransferSatoshi = await fastBtcBridge.minTransferSatoshi();
    const maxTransferSatoshi = await fastBtcBridge.maxTransferSatoshi();
    const currentFeeStructureIndex =
      await fastBtcBridge.currentFeeStructureIndex();
    const feeStructures = await fastBtcBridge.feeStructures(
      currentFeeStructureIndex,
    );

    return {
      minTransferSatoshi: minTransferSatoshi,
      maxTransferSatoshi: maxTransferSatoshi,
      feeStructures: feeStructures,
    };
  }, [getFastBtcBridgeContract]);

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
