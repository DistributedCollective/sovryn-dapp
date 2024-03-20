import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Contract } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { t } from 'i18next';

import { getProvider } from '@sovryn/ethers-provider';
import { StatusType } from '@sovryn/ui';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { prefix0x, satoshiToWei } from '../../../../../../utils/helpers';
import { decimalic } from '../../../../../../utils/math';
import { TransactionType } from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';
import EtherSwapABI from '../../../utils/boltz/EtherSwap.json';
import { boltz } from '../../../utils/boltz/boltz.client';
import { BoltzListener, Status } from '../../../utils/boltz/boltz.types';
import { StatusScreen } from './StatusScreen';

type ConfirmationScreensProps = {
  onClose: () => void;
};

export const ConfirmationScreens: React.FC<ConfirmationScreensProps> = ({
  onClose,
}) => {
  const { account, signer } = useAccount();
  const {
    invoice,
    amount,
    swap: swapData,
    set,
    hash,
  } = useContext(WithdrawBoltzContext);

  const { setTransactions, setTitle, setIsOpen } = useTransactionContext();

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [refundTxHash, setRefundTxHash] = useState<string | undefined>(
    undefined,
  );
  const [txStatus, setTxStatus] = useState(StatusType.idle);
  const [boltzStatus, setBoltzStatus] = useState<Status>();
  const [error, setError] = useState<string>();

  const wsRef = useRef<BoltzListener>();

  const beginListening = useCallback(async (id: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    wsRef.current = boltz.listen(id);
    wsRef.current.status(({ status }) => setBoltzStatus(status));
  }, []);

  useEffect(() => {
    if (swapData) {
      beginListening(swapData.id);
    }
  }, [swapData, beginListening]);

  const handleConfirm = useCallback(async () => {
    try {
      setError(undefined);
      let swap = swapData;
      if (!swapData) {
        swap = await boltz.submarineSwap({
          invoice,
          pairHash: hash,
          to: 'BTC',
          from: 'RBTC',
          // refundAddress: account,
        });

        localStorage.setItem(
          'submarine-swap',
          JSON.stringify({ swap, invoice, amount }),
        );
        set(p => ({ ...p, swap }));
      }

      if (!swap) {
        console.error('Swap data is not defined');
        return;
      }

      // const value = decimalic(swap.expectedAmount).div(1e8).toBigNumber();
      const value = decimalic(swap.expectedAmount)
        .sub(0.0001)
        .div(1e8)
        .toBigNumber();

      const data = await boltz.getContracts();
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
              prefix0x(boltz.decodeInvoice(invoice).preimageHash),
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
    } catch (e) {
      console.log('error:', e);
      setError(e.message);
    }
  }, [
    swapData,
    signer,
    setTransactions,
    invoice,
    setTitle,
    setIsOpen,
    hash,
    amount,
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

    const [data, block] = await Promise.all([
      boltz.getContracts(),
      getProvider().getBlockNumber(),
    ]);
    const etherSwapAddress = data?.rsk.swapContracts.EtherSwap;

    if (!etherSwapAddress || !swap) {
      return;
    }
    const contract = new Contract(etherSwapAddress, EtherSwapABI.abi, signer);

    const expired = swap.timeoutBlockHeight < block;

    const preimageHash = prefix0x(boltz.decodeInvoice(invoice).preimageHash);
    const amount = satoshiToWei(swap.expectedAmount);

    let fnName = 'refund';
    let args = [
      preimageHash,
      amount,
      swap?.claimAddress,
      swap?.timeoutBlockHeight,
    ];

    if (!expired) {
      const [signature, txId] = await Promise.all([
        boltz.getRefundSignature(swap.id),
        boltz.getSubmarineSwapTransaction(swap.id).then(tx => tx.id),
      ]);

      const { v, r, s } = splitSignature(signature);

      const value = await getProvider()
        .getTransaction(txId)
        .then(tx => tx.value.toString())
        .catch(() => '0');

      fnName = 'refundCooperative';
      args = [
        preimageHash,
        value,
        swap?.claimAddress,
        swap?.timeoutBlockHeight,
        v,
        r,
        s,
      ];
    }

    setTransactions([
      {
        title: t(translations.boltz.send.txDialog.refundTitle),
        request: {
          type: TransactionType.signTransaction,
          contract,
          fnName,
          args,
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
  }, [swapData, signer, setTransactions, invoice, setTitle, setIsOpen, set]);

  const handleClose = useCallback(() => {
    localStorage.removeItem('submarine-swap');
    onClose();
  }, [onClose]);

  return (
    <StatusScreen
      txHash={txHash}
      txStatus={txStatus}
      refundTxHash={refundTxHash}
      boltzStatus={boltzStatus}
      swapData={swapData}
      error={error}
      from={account}
      amount={amount}
      onConfirm={handleConfirm}
      onRefund={handleRefund}
      onRetry={handleRetry}
      onClose={handleClose}
    />
  );
};
