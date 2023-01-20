import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { BigNumber } from 'ethers';

import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { fromWei, toWei } from '../../../../../../utils/math';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';
import { GAS_LIMIT_FAST_BTC_WITHDRAW } from './AmountForm';
import { ReviewScreen } from './ReviewScreen';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { step, address, amount, set } = useContext(WithdrawContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
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
    set(prevState => ({ ...prevState, step: WithdrawStep.CONFIRM }));

    if (fastBtcBridgeContract) {
      setTransactions([
        {
          title: 'Send RBTC',
          contract: fastBtcBridgeContract,
          fnName: 'transferToBtc',
          args: [address],
          config: {
            value: toWei(amount),
            gasLimit: String(GAS_LIMIT_FAST_BTC_WITHDRAW),
          },
          onComplete: setTxHash,
        },
      ]);

      setTitle('Send RBTC via Fast BTC');
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

  if (step === WithdrawStep.REVIEW) {
    return (
      <ReviewScreen
        onConfirm={handleConfirm}
        feesPaid={feesPaid}
        receiveAmount={receiveAmount}
      />
    );
  }

  return (
    <StatusScreen
      txHash={txHash}
      onClose={onClose}
      feesPaid={feesPaid}
      receiveAmount={receiveAmount}
    />
  );
};
