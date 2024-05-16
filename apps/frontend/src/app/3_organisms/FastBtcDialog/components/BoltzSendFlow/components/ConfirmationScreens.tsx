import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { BigNumber, ethers } from 'ethers';
import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { translations } from '../../../../../../locales/i18n';
import { decimalic, fromWei, toWei } from '../../../../../../utils/math';
import { Swap } from '../../../../Boltz/Boltz.type';
import {
  decodeInvoice,
  streamSwapStatus,
  swapToLighting,
} from '../../../../Boltz/Boltz.utils';
import { TransactionType } from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';
import { BoltzStatusType } from './BoltzStatus';
import { ReviewScreen } from './ReviewScreen';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { account, signer } = useAccount();
  const { step, invoice, amount, set } = useContext(WithdrawBoltzContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [boltzStatus, setBoltzStatus] = useState<BoltzStatusType>();
  const [swapData, setSwapData] = useState<Swap>();
  const [currentFeeWei, setCurrentFeeWei] = useState(BigNumber.from(0));

  const fastBtcBridgeContract = useGetProtocolContract('fastBtcBridge');

  const weiAmount = useMemo(() => toWei(amount), [amount]);

  const getCurrentFeeWei = useCallback(async () => {
    const currentFeeWei = await fastBtcBridgeContract?.calculateCurrentFeeWei(
      weiAmount,
    );

    setCurrentFeeWei(currentFeeWei);
  }, [fastBtcBridgeContract, weiAmount]);

  useEffect(() => {
    getCurrentFeeWei().then();
  }, [getCurrentFeeWei]);

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

  const feesPaid = useMemo(
    () =>
      currentFeeWei && currentFeeWei.gt(0) ? Number(fromWei(currentFeeWei)) : 0,
    [currentFeeWei],
  );

  const receiveAmount = useMemo(
    () =>
      Number(
        fromWei(
          currentFeeWei && currentFeeWei.gt(0)
            ? weiAmount.sub(currentFeeWei)
            : weiAmount,
        ),
      ),
    [currentFeeWei, weiAmount],
  );

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

    const decoded = decodeInvoice(invoice);
    const { preimageHash } = decoded;

    const iface = new ethers.utils.Interface([
      'function lock(bytes32,address,uint256) payable',
    ]);
    const data = iface.encodeFunctionData('lock', [
      '0x' + preimageHash,
      swap.claimAddress,
      swap.timeoutBlockHeight,
    ]);

    setTransactions([
      {
        title: t(translations.boltz.send.txDialog.title),
        request: {
          type: TransactionType.signTransactionData,
          signer: signer!,
          to: swap.address,
          value,
          data,
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

  if (step === WithdrawBoltzStep.REVIEW) {
    return (
      <ReviewScreen
        onConfirm={handleConfirm}
        feesPaid={feesPaid}
        receiveAmount={receiveAmount}
        from={account}
        to={invoice}
        amount={amount}
        boltzStatus={boltzStatus}
      />
    );
  }

  return (
    <StatusScreen
      txHash={txHash}
      txStatus={txStatus}
      boltzStatus={boltzStatus}
      onClose={onClose}
      feesPaid={feesPaid}
      receiveAmount={receiveAmount}
      from={account}
      to={invoice}
      amount={amount}
      onRetry={handleRetry}
    />
  );
};
