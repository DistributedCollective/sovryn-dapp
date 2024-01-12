import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { decimalic } from '../../../../../../utils/math';
import { Swap } from '../../../../Boltz/Boltz.type';
import {
  decodeInvoice,
  getContracts,
  prefix0x,
  streamSwapStatus,
  swapToLighting,
} from '../../../../Boltz/Boltz.utils';
import EtherSwapABI from '../../../../Boltz/EtherSwap.json';
import { TransactionType } from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';
import { BoltzStatusType } from './BoltzStatus';
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
  const [boltzStatus, setBoltzStatus] = useState<BoltzStatusType>();
  const [swapData, setSwapData] = useState<Swap>();

  useEffect(() => {
    if (!swapData) {
      return;
    }
    let event: EventSource;
    (async () => {
      event = await streamSwapStatus(swapData?.id, setBoltzStatus);
    })();

    return () => {
      event?.close();
    };
  }, [swapData]);

  const handleConfirm = useCallback(async () => {
    let swap = swapData;
    if (!swapData) {
      swap = await swapToLighting(invoice, account);
      setSwapData(swap);
    }

    if (!swap) {
      console.error('Swap data is not defined');
      return;
    }

    const value = decimalic(swap.expectedAmount).div(1e8).toBigNumber();

    const data = await getContracts();
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
            prefix0x(decodeInvoice(swap?.invoice).preimageHash),
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
  }, [
    swapData,
    invoice,
    setTransactions,
    signer,
    setTitle,
    setIsOpen,
    account,
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

    const data = await getContracts();
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
            prefix0x(decodeInvoice(swap?.invoice).preimageHash),
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
  }, [swapData, setTransactions, signer, setTitle, setIsOpen, set]);

  return (
    <StatusScreen
      txHash={txHash}
      txStatus={txStatus}
      refundTxHash={refundTxHash}
      boltzStatus={boltzStatus}
      swapData={swapData}
      from={account}
      amount={amount}
      onConfirm={handleConfirm}
      onRefund={handleRefund}
      onRetry={handleRetry}
      onClose={onClose}
    />
  );
};
