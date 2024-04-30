import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { GoBackButton } from '../../../../1_atoms/GoBackButton/GoBackButton';
import { MobileCloseButton } from '../../../../1_atoms/MobileCloseButton/MobileCloseButton';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useGetProtocolContract } from '../../../../../hooks/useGetContract';
import { rskClient } from '../../../../../utils/clients';
import { useGetFastBtcDepositRskTransactionLazyQuery } from '../../../../../utils/graphql/rsk/generated';
import {
  defaultValue,
  DepositContext,
  DepositContextStateType,
  DepositStep,
  Signature,
} from '../../contexts/deposit-context';
import { useDepositSocket } from '../../hooks/useDepositSocket';
import { ReceiveEvents } from '../../types';
import { AddressForm } from './components/AddressForm';
import { MainScreen } from './components/MainScreen';
import { StatusScreen } from './components/StatusScreen';

type ReceiveFlowProps = {
  onClose: () => void;
};

export const ReceiveFlow: React.FC<ReceiveFlowProps> = ({ onClose }) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();

  const [state, setState] = useState<DepositContextStateType>(defaultValue);
  const { step, depositTx } = state;

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
      case ReceiveEvents.txAmount:
        setState(prevState => ({
          ...prevState,
          limits: { ...value, loading: false },
        }));
        break;
      case ReceiveEvents.depositTx:
        setState(prevState => ({
          ...prevState,
          depositTx: value,
          step: DepositStep.PROCESSING,
        }));
        break;
      case ReceiveEvents.transferTx:
        setState(prevState => ({
          ...prevState,
          transferTx: value,
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

  const onBackClick = useCallback(() => {
    setState(prevState => ({ ...prevState, step: DepositStep.MAIN }));
  }, []);

  const [getDepositRskTransaction] =
    useGetFastBtcDepositRskTransactionLazyQuery();

  const getDepositRskTransactionHash = useCallback(async () => {
    const { data } = await getDepositRskTransaction({
      variables: {
        bitcoinTxHash: depositTx?.txHash,
        user: account.toLowerCase(),
      },
      client: rskClient,
      fetchPolicy: 'network-only',
    });

    return data?.bitcoinTransfers[0]?.updatedAtTx?.id;
  }, [account, depositTx?.txHash, getDepositRskTransaction]);

  useEffect(() => {
    if (step === DepositStep.PROCESSING && depositTx?.txHash) {
      getDepositRskTransactionHash()
        .then(result => {
          if (result) {
            setState(prevState => ({
              ...prevState,
              depositRskTransactionHash: result,
              step: DepositStep.COMPLETED,
            }));
          }
        })
        .catch(console.error);
    }
  }, [depositTx?.txHash, getDepositRskTransactionHash, step, block]);

  return (
    <DepositContext.Provider value={value}>
      {step === DepositStep.ADDRESS && <GoBackButton onClick={onBackClick} />}

      <div className="mt-0 md:mt-12">
        {step === DepositStep.MAIN && <MainScreen />}

        {step === DepositStep.ADDRESS && <AddressForm />}
        {[DepositStep.PROCESSING, DepositStep.COMPLETED].includes(step) && (
          <StatusScreen onClose={onClose} />
        )}
      </div>

      <MobileCloseButton onClick={onClose} dataAttribute="funding-close" />
    </DepositContext.Provider>
  );
};
