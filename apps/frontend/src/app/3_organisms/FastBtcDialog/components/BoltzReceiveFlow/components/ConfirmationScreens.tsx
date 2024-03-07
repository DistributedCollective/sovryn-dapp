import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { crypto } from 'bitcoinjs-lib';
import { randomBytes } from 'crypto';
import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
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
  DepositBoltzContext,
  DepositBoltzStep,
} from '../../../contexts/deposit-boltz-context';
import EtherSwapABI from '../../../utils/boltz/EtherSwap.json';
import { boltz } from '../../../utils/boltz/boltz.client';
import {
  BoltzListener,
  ReverseSwapResponse,
  Status,
} from '../../../utils/boltz/boltz.types';
import { ReviewScreen } from './ReviewScreen';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { account, signer } = useAccount();
  const { amount, set, fees } = useContext(DepositBoltzContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [boltzStatus, setBoltzStatus] = useState<Status>();
  const [swapData, setSwapData] = useState<
    ReverseSwapResponse & { preimageHash: string; preimage: string }
  >();

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

  useEffect(() => {
    const swap = localStorage.getItem('reverse-swap');

    if (swap) {
      const data = JSON.parse(swap);
      setSwapData(data);
      beginListening(data.id);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [beginListening]);

  const conversionFee = useMemo(
    () =>
      decimalic(amount)
        .add(decimalic(fees.minerFees.lockup).div(1e8))
        .mul(decimalic(fees.percentage).div(100)),
    [amount, fees.minerFees.lockup, fees.percentage],
  );

  const sendAmount = useMemo(
    () =>
      decimalic(amount)
        .add(decimalic(fees.minerFees.lockup).div(1e8))
        .div(decimalic(1).sub(decimalic(fees.percentage).div(100)))
        .toString(8),
    [amount, fees.minerFees.lockup, fees.percentage],
  );

  const handleConfirm = useCallback(async () => {
    const preimage = randomBytes(32);
    const preimageHash = crypto.sha256(preimage).toString('hex');

    const result = await boltz.reverseSwap({
      invoiceAmount: Number(parseUnits(sendAmount, 8)),
      to: 'RBTC',
      from: 'BTC',
      preimageHash,
      claimAddress: account,
    });

    const data = {
      ...result,
      preimage: preimage.toString('hex'),
      preimageHash,
    };

    beginListening(result.id);
    setSwapData(data);
    localStorage.setItem('reverse-swap', JSON.stringify(data));
  }, [sendAmount, account, beginListening]);

  const handleClaim = useCallback(async () => {
    if (!swapData) {
      return;
    }

    const contractData = await boltz.getContracts();
    const etherSwapAddress = contractData?.rsk.swapContracts.EtherSwap;

    if (!etherSwapAddress) {
      return;
    }

    const contract = new Contract(etherSwapAddress, EtherSwapABI.abi, signer);

    setTransactions([
      {
        title: t(translations.boltz.receive.txDialog.title),
        request: {
          type: TransactionType.signTransaction,
          contract,
          fnName: 'claim',
          args: [
            prefix0x(swapData.preimage),
            parseUnits(swapData.onchainAmount.toString(), 10),
            swapData.refundAddress,
            swapData.timeoutBlockHeight,
          ],
          gasLimit: GAS_LIMIT.BOLTZ_RECEIVE,
        },
        onStart: hash => {
          setTxHash(hash);
          setIsOpen(false);
        },
        onChangeStatus: setTxStatus,
        onComplete: () => localStorage.removeItem('reverse-swap'),
      },
    ]);

    setTitle(t(translations.boltz.receive.txDialog.title));
    setIsOpen(true);
  }, [swapData, signer, setTransactions, setTitle, setIsOpen]);

  const handleRetry = useCallback(() => {
    set(prevState => ({ ...prevState, step: DepositBoltzStep.REVIEW }));
    handleClaim();
  }, [handleClaim, set]);

  if (!swapData) {
    return (
      <ReviewScreen
        onConfirm={handleConfirm}
        receiveAmount={amount}
        to={account}
        amount={sendAmount}
        networkFee={decimalic(fees.minerFees.lockup).div(1e8)}
        conversionFee={conversionFee}
      />
    );
  }

  return (
    <StatusScreen
      txHash={txHash}
      invoice={swapData.invoice}
      txStatus={txStatus}
      boltzStatus={boltzStatus}
      to={account}
      amount={sendAmount}
      receiveAmount={swapData.onchainAmount}
      swapData={swapData}
      onClaim={handleClaim}
      onRetry={handleRetry}
      onClose={onClose}
      networkFee={decimalic(fees.minerFees.lockup).div(1e8)}
      conversionFee={conversionFee}
    />
  );
};
