import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { translations } from '../../../../../../locales/i18n';
import { fromWei, toWei } from '../../../../../../utils/math';
import { ReverseSwap } from '../../../../Boltz/Boltz.type';
import {
  satoshiToWei,
  streamSwapStatus,
  swapToBTC,
} from '../../../../Boltz/Boltz.utils';
import { TransactionType } from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import {
  DepositBoltzContext,
  DepositBoltzStep,
} from '../../../contexts/deposit-boltz-context';
import { BoltzStatusType } from '../../BoltzSendFlow/components/BoltzStatus';
import { ReviewScreen } from './ReviewScreen';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { account, signer } = useAccount();
  const { amount, set } = useContext(DepositBoltzContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [boltzStatus, setBoltzStatus] = useState<BoltzStatusType>();
  const [swapData, setSwapData] = useState<ReverseSwap>();
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

  useEffect(() => {
    const swap = localStorage.getItem('reverse-swap');

    if (swap) {
      setSwapData(JSON.parse(swap));
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    const swap = await swapToBTC(Number(parseUnits(amount, 8)), account);
    setSwapData(swap);
    localStorage.setItem('reverse-swap', JSON.stringify(swap));
  }, [amount, account]);

  const handleClaim = useCallback(async () => {
    if (!swapData) {
      return;
    }

    const iface = new ethers.utils.Interface([
      'function claim(bytes32,uint256,address,uint256) nonpayable',
    ]);

    const data = iface.encodeFunctionData('claim', [
      '0x' + swapData.preimage,
      satoshiToWei(swapData.onchainAmount),
      swapData.refundAddress,
      swapData.timeoutBlockHeight,
    ]);

    setTransactions([
      {
        title: t(translations.boltz.receive.txDialog.title),
        request: {
          type: TransactionType.signTransactionData,
          signer: signer!,
          to: swapData.lockupAddress,
          data,
        },
        onStart: hash => {
          setTxHash(hash);
          setIsOpen(false);
        },
        onChangeStatus: setTxStatus,
      },
    ]);

    setTitle(t(translations.boltz.receive.txDialog.title));
    setIsOpen(true);
  }, [swapData, setTransactions, signer, setTitle, setIsOpen]);

  const handleRetry = useCallback(() => {
    set(prevState => ({ ...prevState, step: DepositBoltzStep.REVIEW }));
    handleClaim();
  }, [handleClaim, set]);

  if (!swapData) {
    return (
      <ReviewScreen
        onConfirm={handleConfirm}
        feesPaid={feesPaid}
        receiveAmount={receiveAmount}
        to={account}
        amount={amount}
        boltzStatus={boltzStatus}
      />
    );
  }

  return (
    <StatusScreen
      txHash={txHash}
      txStatus={txStatus}
      invoice={swapData.invoice}
      boltzStatus={boltzStatus}
      onClose={() => {
        localStorage.removeItem('reverse-swap');
        onClose();
      }}
      feesPaid={feesPaid}
      receiveAmount={receiveAmount}
      to={account}
      amount={amount}
      onRetry={handleRetry}
      onClaim={handleClaim}
    />
  );
};
