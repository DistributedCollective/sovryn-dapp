import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { StatusType } from '@sovryn/ui';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { decimalic } from '../../../../../../utils/math';
import { ReverseSwap } from '../../../../Boltz/Boltz.type';
import {
  getContracts,
  prefix0x,
  satoshiToWei,
  streamSwapStatus,
  swapToBTC,
} from '../../../../Boltz/Boltz.utils';
import EtherSwapABI from '../../../../Boltz/EtherSwap.json';
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
  const { amount, set, fees } = useContext(DepositBoltzContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [boltzStatus, setBoltzStatus] = useState<BoltzStatusType>();
  const [swapData, setSwapData] = useState<ReverseSwap>();

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

    const contractData = await getContracts();
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
            satoshiToWei(swapData.onchainAmount),
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
  }, [swapData, setTransactions, signer, setTitle, setIsOpen]);

  const handleRetry = useCallback(() => {
    set(prevState => ({ ...prevState, step: DepositBoltzStep.REVIEW }));
    handleClaim();
  }, [handleClaim, set]);

  const conversionFee = useMemo(
    () => decimalic(amount).mul(decimalic(fees.percentageSwapIn).div(100)),
    [amount, fees.percentageSwapIn],
  );

  const receiveAmount = useMemo(
    () =>
      decimalic(amount)
        .sub(conversionFee)
        .sub(decimalic(fees.minerFees.baseAsset.normal).div(1e8)),
    [amount, conversionFee, fees.minerFees.baseAsset.normal],
  );

  if (!swapData) {
    return (
      <ReviewScreen
        onConfirm={handleConfirm}
        receiveAmount={receiveAmount}
        to={account}
        amount={amount}
        networkFee={decimalic(fees.minerFees.baseAsset.normal).div(1e8)}
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
      amount={amount}
      receiveAmount={swapData.receiveAmount}
      swapData={swapData}
      onClaim={handleClaim}
      onRetry={handleRetry}
      onClose={onClose}
      networkFee={decimalic(fees.minerFees.baseAsset.normal).div(1e8)}
      conversionFee={conversionFee}
    />
  );
};
