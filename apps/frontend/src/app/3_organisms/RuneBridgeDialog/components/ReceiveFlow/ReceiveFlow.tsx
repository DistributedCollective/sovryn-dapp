import React, { useCallback, useEffect } from 'react';

import { GoBackButton } from '../../../../1_atoms/GoBackButton/GoBackButton';
import { useAccount } from '../../../../../hooks/useAccount';
import { ReceiveflowStep } from '../../contexts/receiveflow';
import { useReceiveFlowContext } from '../../contexts/receiveflow';
import { AddressForm } from './components/AddressForm';
import { MainScreen } from './components/MainScreen';
import { StatusScreen } from './components/StatusScreen';

type ReceiveFlowProps = {
  onClose: () => void;
};

export const ReceiveFlow: React.FC<ReceiveFlowProps> = ({ onClose }) => {
  const { account: evmAddress } = useAccount();
  const {
    step,
    set,
    requestLastScannedBlock,
    getRuneDepositStatus,
    depositTx,
  } = useReceiveFlowContext();
  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: ReceiveflowStep.MAIN }));
  }, [set]);

  useEffect(() => {
    if (
      depositTx?.lastBlockHash ||
      !evmAddress ||
      ![
        ReceiveflowStep.ADDRESS,
        ReceiveflowStep.PROCESSING,
        ReceiveflowStep.COMPLETED,
      ].includes(step)
    ) {
      return;
    }

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
  }, [
    depositTx?.lastBlockHash,
    evmAddress,
    requestLastScannedBlock,
    set,
    step,
  ]);

  useEffect(() => {
    if (!depositTx.lastBlockHash || !evmAddress) {
      return;
    }

    const checkPendingTx = async () => {
      if (!depositTx.lastBlockHash) {
        return;
      }
      const response = await getRuneDepositStatus(
        evmAddress,
        depositTx.lastBlockHash,
      );
      const currentDepositStatus = response.deposits?.[0];
      if (!currentDepositStatus) {
        // no deposits
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
        depositTx: {
          ...prevState.depositTx,
          statuses: response.deposits,
          currentTX: {
            btcDepositTxid: currentDepositStatus.btc_deposit_txid,
            btcDepositVout: currentDepositStatus.btc_deposit_vout,
            runeName: currentDepositStatus.rune_name,
            runeSymbol: currentDepositStatus.rune_symbol,
            amountDecimal: currentDepositStatus.amount_decimal,
            feeDecimal: currentDepositStatus.fee_decimal,
            receiveAmountDecimal: currentDepositStatus.receive_amount_decimal,
            status: currentDepositStatus.status,
            evmTransferTxHash: currentDepositStatus.evm_transfer_tx_hash,
          },
        },
      }));
    };
    const interval = setInterval(checkPendingTx, 10_000);
    return () => clearInterval(interval);
  }, [
    depositTx,
    depositTx.lastBlockHash,
    depositTx.currentTX,
    evmAddress,
    getRuneDepositStatus,
    requestLastScannedBlock,
    set,
    step,
  ]);

  return (
    <div>
      {step === ReceiveflowStep.ADDRESS && (
        <GoBackButton onClick={onBackClick} />
      )}
      <div className="mt-0 md:mt-12">
        {step === ReceiveflowStep.MAIN && <MainScreen />}
        {[ReceiveflowStep.PROCESSING, ReceiveflowStep.COMPLETED].includes(
          step,
        ) && depositTx?.currentTX.status ? (
          <StatusScreen onClose={onClose} />
        ) : (step === ReceiveflowStep.ADDRESS ||
            depositTx?.currentTX.status === 'confirmed') &&
          depositTx.lastBlockHash ? (
          <div>
            <AddressForm />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
