import React, { useCallback, useEffect, useState, useMemo } from 'react';

import {
  defaultValue,
  DepositContext,
  DepositContextStateType,
  DepositStep,
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

  // const [requiredSigners, setRequiredSigners] = useState<number | undefined>();

  // const getFastBtcMultisigContract = useCallback(async () => {
  //   const { address, abi } = await getProtocolContract(
  //     'fastBtcMultisig',
  //     defaultChainId,
  //   );
  //   return new ethers.Contract(address, abi, signer);
  // }, [signer]);

  // useEffect(() => {
  //   const getRequiredSigners = async () => {
  //     const fastBtcMultisigContract = await getFastBtcMultisigContract();

  //     const requiredSigners = await fastBtcMultisigContract.required();
  //     setRequiredSigners(requiredSigners);
  //   };

  //   getRequiredSigners();
  // }, [getFastBtcMultisigContract]);

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

  // const handleAddressRequest = useCallback(
  //   (address: string) => {
  //     setState(prevState => ({
  //       ...prevState,
  //       addressLoading: true,
  //     }));
  //     getDepositAddress(address)
  //       .then(response => {
  //         if (
  //           requiredSigners !== undefined &&
  //           response.signatures.length >= requiredSigners
  //         ) {
  //           setState(prevState => ({
  //             ...prevState,
  //             addressLoading: false,
  //             address: response.btcadr,
  //             step: DepositStep.VALIDATION,
  //             signatures: response.signatures as Signature[],
  //           }));
  //         } else {
  //           handleAddressRequest(address);
  //         }
  //       })
  //       .catch(error => {
  //         console.error(error);
  //         setState(prevState => ({
  //           ...prevState,
  //           addressLoading: false,
  //           address: '',
  //           addressError: error.message,
  //         }));
  //       });
  //   },
  //   [getDepositAddress, requiredSigners],
  // );

  const handleAddressRequest = useCallback(
    (address: string) => {
      setState(prevState => ({
        ...prevState,
        addressLoading: true,
      }));
      getDepositAddress(address)
        .then(response => {
          setState(prevState => ({
            ...prevState,
            addressLoading: false,
            address: response.btcadr,
            step: DepositStep.ADDRESS,
          }));
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
    [getDepositAddress],
  );

  // const handleValidation = useCallback(() => {
  //   setState(prevState => ({
  //     ...prevState,
  //     step: DepositStep.ADDRESS,
  //   }));
  // }, []);

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
      <div>
        {step === DepositStep.MAIN && <MainScreen />}

        {/* TODO: Find out if it's required */}
        {/* {step === DepositStep.VALIDATION && (
          <SignatureValidation onClick={handleValidation} />
        )} */}

        {step === DepositStep.ADDRESS && <AddressForm />}
        {[DepositStep.PROCESSING, DepositStep.COMPLETED].includes(step) && (
          <StatusScreen onClose={onClose} />
        )}
      </div>
    </DepositContext.Provider>
  );
};
