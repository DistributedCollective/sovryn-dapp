import React, { useCallback, useContext, useRef, useState } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { prefix0x } from '../../../../../../utils/helpers';
import { decimalic } from '../../../../../../utils/math';
import { TransactionType } from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';
import EtherSwapABI from '../../../utils/boltz/EtherSwap.json';
import { boltz } from '../../../utils/boltz/boltz.client';
import {
  BoltzListener,
  Status,
  SubmarineSwapResponse,
} from '../../../utils/boltz/boltz.types';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { account, signer } = useAccount();
  const { invoice, amount, set } = useContext(WithdrawBoltzContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [refundTxHash, setRefundTxHash] = useState<string | undefined>(
    undefined,
  );
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [boltzStatus, setBoltzStatus] = useState<Status>();
  const [swapData, setSwapData] = useState<SubmarineSwapResponse>();
  const [error, setError] = useState<string>();

  const wsRef = useRef<BoltzListener>();

  const beginListening = useCallback(async (id: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    wsRef.current = boltz.listen(id);
    wsRef.current.status(({ status }) => {
      console.log('status:', status);
      setBoltzStatus(status);
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      setError(undefined);
      let swap = swapData;
      if (!swapData) {
        swap = await boltz.submarineSwap({
          invoice,
          from: 'RBTC',
          to: 'BTC',
          refundAddress: account,
        });

        setSwapData(swap);
        beginListening(swap.id);
      }

      if (!swap) {
        console.error('Swap data is not defined');
        return;
      }

      const value = decimalic(swap.expectedAmount).div(1e8).toBigNumber();

      const data = await boltz.getContracts();
      const etherSwapAddress = data?.rsk.swapContracts.EtherSwap;

      if (!etherSwapAddress || !swap) {
        return;
      }
      const contract = new Contract(etherSwapAddress, EtherSwapABI.abi, signer);

      setTransactions([
        {
          title: t(translations.boltz.send.txDialog.title),
          request: {
            type: TransactionType.signTransaction,
            value,
            contract,
            fnName: 'lock',
            args: [
              prefix0x(boltz.decodeInvoice(invoice).preimageHash),
              swap?.claimAddress,
              swap?.timeoutBlockHeight,
            ],
            gasLimit: GAS_LIMIT.BOLTZ_SEND,
          },
          onStart: hash => {
            setTxHash(hash);
            set(prevState => ({
              ...prevState,
              step: WithdrawBoltzStep.CONFIRM,
            }));
            setIsOpen(false);
          },
          onChangeStatus: setTxStatus,
        },
      ]);

      setTitle(t(translations.fastBtc.send.txDialog.title));
      setIsOpen(true);
    } catch (e) {
      console.log('error:', e);
      setError(e.message);
    }
  }, [
    swapData,
    signer,
    setTransactions,
    invoice,
    setTitle,
    setIsOpen,
    account,
    beginListening,
    set,
  ]);

  const handleRetry = useCallback(() => {
    set(prevState => ({ ...prevState, step: WithdrawBoltzStep.REVIEW }));
    handleConfirm();
  }, [handleConfirm, set]);

  const handleRefund = useCallback(async () => {
    let swap = swapData;

    if (!swap) {
      console.error('Swap data is not defined');
      return;
    }

    const value = decimalic(swap.expectedAmount).div(1e8).toBigNumber();

    const data = await boltz.getContracts();
    const etherSwapAddress = data?.rsk.swapContracts.EtherSwap;

    if (!etherSwapAddress || !swap) {
      return;
    }
    const contract = new Contract(etherSwapAddress, EtherSwapABI.abi, signer);

    setTransactions([
      {
        title: t(translations.boltz.send.txDialog.title),
        request: {
          type: TransactionType.signTransaction,
          value,
          contract,
          fnName: 'refund',
          args: [
            prefix0x(boltz.decodeInvoice(invoice).preimageHash),
            value,
            swap?.claimAddress,
            swap?.timeoutBlockHeight,
          ],
          gasLimit: GAS_LIMIT.BOLTZ_REFUND,
        },
        onStart: hash => {
          setRefundTxHash(hash);
          set(prevState => ({
            ...prevState,
            step: WithdrawBoltzStep.CONFIRM,
          }));
          setIsOpen(false);
        },
        onChangeStatus: setTxStatus,
      },
    ]);

    setTitle(t(translations.fastBtc.send.txDialog.title));
    setIsOpen(true);
  }, [swapData, signer, setTransactions, invoice, setTitle, setIsOpen, set]);

  return (
    <StatusScreen
      txHash={txHash}
      txStatus={txStatus}
      refundTxHash={refundTxHash}
      boltzStatus={boltzStatus}
      swapData={swapData}
      error={error}
      from={account}
      amount={amount}
      onConfirm={handleConfirm}
      onRefund={handleRefund}
      onRetry={handleRetry}
      onClose={onClose}
    />
  );
};
