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
import { useContractService } from '../../../hooks/useContractService';
import { ReviewScreen } from './ReviewScreen';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { account, signer } = useAccount();
  const {
    step,
    address: receiverAddress,
    amount,
    set,
    selectedToken,
  } = useContext(SendFlowContext);

  const {
    setRuneBridgeTransactions,
    setTitle,
    setRuneBridgeIsOpen,
    setRuneBridgeToken,
  } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [currentFeeWei, setCurrentFeeWei] = useState(BigNumber.from(0));
  const { runeBridgeContract } = useContractService();
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
    if (runeBridgeContract) {
      if (!signer) {
        throw new Error('Signer not found');
      }
      setRuneBridgeTransactions([
        {
          title: t(translations.fastBtc.send.txDialog.sendBTC),
          request: {
            type: TransactionType.signTransaction,
            contract: runeBridgeContract.connect(signer),
            fnName: 'transferToBtc',
            args: [
              selectedToken.tokenContractAddress,
              toWei(amount),
              receiverAddress,
            ],
            gasLimit: GAS_LIMIT_FAST_BTC_WITHDRAW,
          },
          onStart: hash => {
            setTxHash(hash);
            set(prevState => ({ ...prevState, step: SendFlowStep.CONFIRM }));
            setRuneBridgeIsOpen(false);
          },
          onChangeStatus: setTxStatus,
        },
      ]);
      setTitle(t(translations.fastBtc.send.txDialog.title));
      setRuneBridgeIsOpen(true);
      setRuneBridgeToken(selectedToken);
    }
  }, [
    amount,
    receiverAddress,
    runeBridgeContract,
    selectedToken,
    set,
    setRuneBridgeIsOpen,
    setRuneBridgeToken,
    setRuneBridgeTransactions,
    setTitle,
    signer,
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
        to={receiverAddress}
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
      to={receiverAddress}
      amount={amount}
      onRetry={handleRetry}
    />
  );
};
