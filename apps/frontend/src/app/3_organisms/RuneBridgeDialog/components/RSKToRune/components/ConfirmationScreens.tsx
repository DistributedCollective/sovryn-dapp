import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { BigNumber, Contract } from 'ethers';
import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { translations } from '../../../../../../locales/i18n';
import { fromWei, toWei } from '../../../../../../utils/math';
import {
  TransactionType,
  TokenDetails,
} from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import {
  GAS_LIMIT_RUNE_BRIDGE_WITHDRAW,
  WITHDRAW_FEE_BASE_CURRENCY_BTC,
  WITHDRAW_FEE_BASE_CURRENCY_WEI,
  WITHDRAW_FEE_RUNE_PERCENTAGE,
} from '../../../constants';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
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

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [currentFeeWei, setCurrentFeeWei] = useState(BigNumber.from(0));
  const runeBridgeContract = useGetProtocolContract('runeBridge');

  const weiAmount = useMemo(
    () => toWei(amount, selectedToken.decimals),
    [amount, selectedToken.decimals],
  );

  const getCurrentFeeWei = useCallback(async () => {
    // We could get this from the contract, but for now it's hardcoded
    const currentFeeWei = weiAmount.mul(
      BigNumber.from(WITHDRAW_FEE_RUNE_PERCENTAGE).div(100),
    );

    setCurrentFeeWei(currentFeeWei);
  }, [setCurrentFeeWei, weiAmount]);

  useEffect(() => {
    getCurrentFeeWei().then();
  }, [getCurrentFeeWei]);

  const feesPaid = useMemo(
    () => ({
      rune:
        currentFeeWei && currentFeeWei.gt(0)
          ? Number(fromWei(currentFeeWei, selectedToken.decimals))
          : 0,
      baseCurrency: WITHDRAW_FEE_BASE_CURRENCY_BTC,
    }),
    [currentFeeWei, selectedToken.decimals],
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
    if (!runeBridgeContract) {
      return;
    }
    const tokenContract = new Contract(
      selectedToken.tokenContractAddress,
      ['function approve(address spender, uint256 amount) returns (bool)'],
      signer,
    );
    const tokenDetails: TokenDetails = {
      address: selectedToken.tokenContractAddress,
      symbol: selectedToken.symbol,
      decimalPrecision: selectedToken.decimals,
    };
    if (!signer) {
      throw new Error('Signer not found');
    }
    setTransactions([
      {
        title: t(translations.runeBridge.send.txDialog.approveTxTitle, {
          rune: selectedToken.name,
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: tokenContract,
          tokenDetails,
          fnName: 'approve',
          args: [
            runeBridgeContract.address,
            toWei(amount, selectedToken.decimals),
          ],
          gasLimit: GAS_LIMIT_RUNE_BRIDGE_WITHDRAW,
        },
        onStart: hash => {
          setTxHash(hash);
        },
        onChangeStatus: setTxStatus,
      },
      {
        title: t(translations.runeBridge.send.txDialog.sendTxTitle, {
          rune: selectedToken.name,
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: runeBridgeContract.connect(signer),
          fnName: 'transferToBtc',
          args: [
            selectedToken.tokenContractAddress,
            toWei(amount, selectedToken.decimals),
            receiverAddress,
          ],
          value: WITHDRAW_FEE_BASE_CURRENCY_WEI,
          gasLimit: GAS_LIMIT_RUNE_BRIDGE_WITHDRAW,
        },
        onStart: hash => {
          setTxStatus(StatusType.idle);
          setTxHash(hash);
          set(prevState => ({ ...prevState, step: SendFlowStep.CONFIRM }));
          setIsOpen(false);
        },
        onChangeStatus: setTxStatus,
      },
    ]);
    setTitle(
      t(translations.runeBridge.send.txDialog.title, {
        rune: selectedToken.name,
      }),
    );
    setIsOpen(true);
  }, [
    amount,
    receiverAddress,
    runeBridgeContract,
    selectedToken,
    set,
    setTransactions,
    setTitle,
    setIsOpen,
    signer,
  ]);

  const handleRetry = useCallback(() => {
    set(prevState => ({ ...prevState, step: SendFlowStep.REVIEW }));
    handleConfirm().catch(console.error);
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
