import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { translations } from '../../../../../../locales/i18n';
import { fromWei, toWei } from '../../../../../../utils/math';
import { TransactionType } from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT_FAST_BTC_WITHDRAW } from '../../../constants';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { ReviewScreen } from './ReviewScreen';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { account } = useAccount();
  const { step, address, amount, set } = useContext(SendFlowContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState(StatusType.idle);
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
    if (fastBtcBridgeContract) {
      setTransactions([
        {
          title: t(translations.fastBtc.send.txDialog.sendBTC),
          request: {
            type: TransactionType.signTransaction,
            contract: fastBtcBridgeContract,
            fnName: 'transferToBtc',
            args: [address],
            value: toWei(amount),
            gasLimit: GAS_LIMIT_FAST_BTC_WITHDRAW,
          },
          onStart: hash => {
            setTxHash(hash);
            set(prevState => ({ ...prevState, step: SendFlowStep.CONFIRM }));
            setIsOpen(false);
          },
          onChangeStatus: setTxStatus,
        },
      ]);

      setTitle(t(translations.fastBtc.send.txDialog.title));
      setIsOpen(true);
    }
  }, [
    address,
    amount,
    fastBtcBridgeContract,
    set,
    setIsOpen,
    setTitle,
    setTransactions,
  ]);

  const handleRetry = useCallback(() => {
    set(prevState => ({ ...prevState, step: SendFlowStep.REVIEW }));
    handleConfirm();
  }, [handleConfirm, set]);

  if (step === SendFlowStep.REVIEW) {
    return (
      <ReviewScreen
        onConfirm={handleConfirm}
        feesPaid={feesPaid}
        receiveAmount={receiveAmount}
        from={account}
        to={address}
        amount={amount}
      />
    );
  }

  return (
    <StatusScreen
      txHash={txHash}
      txStatus={txStatus}
      onClose={onClose}
      feesPaid={feesPaid}
      receiveAmount={receiveAmount}
      from={account}
      to={address}
      amount={amount}
      onRetry={handleRetry}
    />
  );
};
