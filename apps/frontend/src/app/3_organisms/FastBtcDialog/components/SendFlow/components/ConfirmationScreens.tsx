import React, { useCallback, useContext, useState } from 'react';

import { ethers } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';

import { defaultChainId } from '../../../../../../config/chains';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { toWei } from '../../../../../../utils/math';
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
  const { signer } = useAccount();
  const { step, address, amount, set } = useContext(WithdrawContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  // TODO: Create a global function/hook
  const getFastBtcBridgeContract = useCallback(async () => {
    const { address, abi } = await getProtocolContract(
      'fastBtcBridge',
      defaultChainId,
    );
    return new ethers.Contract(address, abi, signer);
  }, [signer]);

  const handleConfirm = useCallback(async () => {
    set(prevState => ({ ...prevState, step: WithdrawStep.CONFIRM }));

    const fastBtcBridgeContract = await getFastBtcBridgeContract();

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
  }, [
    address,
    amount,
    getFastBtcBridgeContract,
    set,
    setIsOpen,
    setTitle,
    setTransactions,
  ]);

  if (step === WithdrawStep.REVIEW) {
    return <ReviewScreen onConfirm={handleConfirm} />;
  }

  return <StatusScreen txHash={txHash} onClose={onClose} />;
};
