import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { useGetProtocolContract } from '../../../../../hooks/useGetContract';
import {
  defaultValue,
  DepositContext,
  DepositContextStateType,
  DepositStep,
  Signature,
} from '../../contexts/deposit-context';
import { useDepositSocket } from '../../hooks/useDepositSocket';
import { AddressForm } from './components/AddressForm';
import { MainScreen } from './components/MainScreen';
import { StatusScreen } from './components/StatusScreen';

type ReceiveFlowProps = {
  onClose: () => void;
};

export const ReceiveFlow: React.FC<ReceiveFlowProps> = ({ onClose }) => {
  const [state, setState] = useState<DepositContextStateType>(defaultValue);
  const { step } = state;

  const [requiredSigners, setRequiredSigners] = useState<number | undefined>();

  const fastBtcMultisigContract = useGetProtocolContract('fastBtcMultisig');

  const getRequiredSigners = useCallback(async () => {
    const requiredSigners = await fastBtcMultisigContract?.required();

    if (requiredSigners && requiredSigners > 0) {
      setRequiredSigners(requiredSigners);
    }
  }, [fastBtcMultisigContract]);

  useEffect(() => {
    getRequiredSigners().then();
  }, [getRequiredSigners]);

  const handleEvents = useCallback((type: string, value: any) => {
    switch (type) {
      case 'txAmount':
        setState(prevState => ({
          ...prevState,
          limits: { ...value, loading: false },
        }));
        break;
      case 'depositTx':
        setState(prevState => ({
          ...prevState,
          depositTx: value,
          step: DepositStep.PROCESSING,
        }));
        break;
      case 'transferTx':
        setState(prevState => ({
          ...prevState,
          transferTx: value,
          step: DepositStep.COMPLETED,
        }));
        break;
    }
  }, []);

  const { ready, getDepositAddress, getTxAmount } =
    useDepositSocket(handleEvents);

  const handleAddressRequest = useCallback(
    (address: string) => {
      setState(prevState => ({
        ...prevState,
        addressLoading: true,
      }));
      getDepositAddress(address)
        .then(response => {
          if (
            requiredSigners !== undefined &&
            response.signatures.length >= requiredSigners
          ) {
            setState(prevState => ({
              ...prevState,
              addressLoading: false,
              address: response.btcadr,
              step: DepositStep.ADDRESS,
              signatures: response.signatures as Signature[],
            }));
          } else {
            handleAddressRequest(address);
          }
        })
        .catch(error => {
          console.error(error);
          setState(prevState => ({
            ...prevState,
            addressLoading: false,
            address: '',
            addressError: error.message,
          }));
        });
    },
    [getDepositAddress, requiredSigners],
  );

  const value = useMemo(
    () => ({
      ...state,
      ready,
      set: setState,
      requestDepositAddress: handleAddressRequest,
    }),
    [state, ready, setState, handleAddressRequest],
  );

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      limits: { ...prevState.limits, loading: true },
    }));

    if (ready) {
      getTxAmount()
        .then(result => {
          setState(prevState => ({
            ...prevState,
            limits: { ...result, loading: false },
          }));
        })
        .catch(() => {
          setState(prevState => ({
            ...prevState,
            limits: { ...prevState.limits, loading: false },
          }));
        });
    }
  }, [ready, getTxAmount]);

  return (
    <DepositContext.Provider value={value}>
      <div className="mt-12">
        {step === DepositStep.MAIN && <MainScreen />}

        {step === DepositStep.ADDRESS && <AddressForm />}
        {[DepositStep.PROCESSING, DepositStep.COMPLETED].includes(step) && (
          <StatusScreen onClose={onClose} />
        )}
      </div>
    </DepositContext.Provider>
  );
};
