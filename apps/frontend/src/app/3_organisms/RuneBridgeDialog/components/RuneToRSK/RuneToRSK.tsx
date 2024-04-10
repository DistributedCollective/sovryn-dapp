import React, { useCallback, useEffect } from 'react';

import { Heading, HeadingType, StatusType } from '@sovryn/ui';

import { StatusIcon } from '../../../../2_molecules/StatusIcon/StatusIcon';
import { useAccount } from '../../../../../hooks/useAccount';
import { ReceiveflowStep } from '../../contexts/receiveflow';
import { useReceiveFlowService } from '../../hooks/useReceiveFlowService';
import { GoBackButton } from '../GoBackButton';
import { AddressForm } from './components/AddressForm';
import { MainScreen } from './components/MainScreen';
import { StatusScreen } from './components/StatusScreen';

interface RuneToRSKProps {
  onClose: () => void;
}

export const RuneToRSK: React.FC<RuneToRSKProps> = ({ onClose }) => {
  const { account: evmAdress } = useAccount();
  const {
    step,
    txCheckingAttempts,
    set,
    requestLastScannedBlock,
    getRuneDepositStatus,
    depositTx,
  } = useReceiveFlowService();
  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: ReceiveflowStep.MAIN }));
  }, [set]);
  useEffect(() => {
    if (
      depositTx?.lastBlockHash ||
      !evmAdress ||
      ![
        ReceiveflowStep.ADDRESS,
        ReceiveflowStep.PROCESSING,
        ReceiveflowStep.COMPLETED,
      ].includes(step)
    )
      return;
    console.log('requestLastScannedBlock');
    requestLastScannedBlock().then(response => {
      if (!response.last_scanned_block) {
        return;
      }
      if (!depositTx?.lastBlockHash) {
        set(prevState => ({
          ...prevState,
          depositTx: {
            ...prevState.depositTx,
            lastBlockHash: response.last_scanned_block,
          },
        }));
      }
    });
  }, [depositTx?.lastBlockHash, evmAdress, requestLastScannedBlock, set, step]);
  useEffect(() => {
    if (!depositTx.lastBlockHash || !evmAdress) {
      return;
    }
    const interval = setInterval(async () => {
      if (!depositTx.lastBlockHash) {
        return;
      }
      const response = await getRuneDepositStatus(
        evmAdress,
        depositTx.lastBlockHash,
      );
      const currentDepositStatus = response.deposits?.[0];
      console.log('response currentDepositStatus:', currentDepositStatus);
      if (!currentDepositStatus) {
        set(prevState => ({
          ...prevState,
          txCheckingAttempts: prevState.txCheckingAttempts + 1,
        }));
        return;
      }
      const currentStep =
        currentDepositStatus?.status === 'confirmed'
          ? ReceiveflowStep.COMPLETED
          : ReceiveflowStep.PROCESSING;

      set(prevState => ({
        ...prevState,
        step: currentStep,
        isTxInProgress: currentDepositStatus?.status !== 'confirmed',
        txCheckingAttempts: 0,
        depositTx: {
          ...prevState.depositTx,
          statuses: response.deposits,
          currentTX: {
            btcDepositTxid: currentDepositStatus.btc_deposit_txid,
            btcDepositVout: currentDepositStatus.btc_deposit_vout,
            runeName: currentDepositStatus.rune_name,
            amountDecimal: currentDepositStatus.amount_decimal,
            status: currentDepositStatus.status,
            evmTransferTxHash: currentDepositStatus.evm_transfer_tx_hash,
          },
        },
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [
    depositTx,
    depositTx.lastBlockHash,
    depositTx.currentTX,
    evmAdress,
    getRuneDepositStatus,
    requestLastScannedBlock,
    set,
    step,
  ]);
  return (
    <div>
      <div className="mt-0 md:mt-12">
        {step === ReceiveflowStep.MAIN && <MainScreen />}
        {txCheckingAttempts <= 1 && step === ReceiveflowStep.ADDRESS && (
          <div className="text-center">
            <Heading type={HeadingType.h2} className="font-medium mb-6">
              Checking pending transactions...
            </Heading>
            <div className="mb-6">
              <StatusIcon
                status={StatusType.pending}
                dataAttribute="checking-pending-transactions"
              />
            </div>
          </div>
        )}
        {(step === ReceiveflowStep.ADDRESS ||
          depositTx?.currentTX.status === 'confirmed') &&
          depositTx.lastBlockHash &&
          txCheckingAttempts >= 2 && (
            <>
              {step === ReceiveflowStep.ADDRESS && (
                <GoBackButton onClick={onBackClick} />
              )}
              <AddressForm />
            </>
          )}

        {[ReceiveflowStep.PROCESSING, ReceiveflowStep.COMPLETED].includes(
          step,
        ) &&
          depositTx?.currentTX.status && <StatusScreen onClose={onClose} />}
      </div>
    </div>
  );
};
