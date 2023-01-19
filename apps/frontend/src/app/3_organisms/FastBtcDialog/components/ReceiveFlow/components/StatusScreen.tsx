import React, { useContext, useMemo } from 'react';

import { Button, Heading, TransactionId } from '@sovryn/ui';

import { formatValue } from '../../../../../../utils/math';
import { FAST_BTC_ASSET } from '../../../constants';
import { DepositContext, DepositStep } from '../../../contexts/deposit-context';

type StatusScreenProps = {
  onClose: () => void;
};

export const StatusScreen: React.FC<StatusScreenProps> = ({ onClose }) => {
  const { step, depositTx, transferTx } = useContext(DepositContext);

  const isProcessing = useMemo(() => step === DepositStep.PROCESSING, [step]);

  // TODO: Use this once we fix the problem with toWei method
  //   const feeAmount = useMemo(
  //     () => BigNumber.from(DEPOSIT_FEE_SATS).div(btcInSatoshis).toString(),
  //     [],
  //   );

  //   const amount = useMemo(() => {
  //     if (depositTx) {
  //       return depositTx.value;
  //     }
  //     if (transferTx) {
  //       return BigNumber.from(transferTx?.value || 0)
  //         .add(feeAmount)
  //         .toString();
  //     }
  //     return 0;
  //   }, [depositTx, transferTx, feeAmount]);

  //   const receiveAmount = useMemo(
  //     () => BigNumber.from(amount).sub(feeAmount).toString(),
  //     [amount, feeAmount],
  //   );

  const feeAmount = 0.00006;

  const amount = useMemo(() => {
    if (depositTx) {
      return depositTx.value;
    }
    if (transferTx) {
      return transferTx.value + Number(feeAmount);
    }
    return 0;
  }, [depositTx, transferTx, feeAmount]);

  const receiveAmount = useMemo(
    () => amount - Number(feeAmount),
    [amount, feeAmount],
  );

  const items = useMemo(
    () => [
      {
        label: 'Date & Time:',
        value: new Date().toLocaleDateString(),
      },
      {
        label: 'Amount:',
        value: (
          <span>
            {formatValue(amount, 8)} {FAST_BTC_ASSET.toUpperCase()}
          </span>
        ),
      },

      {
        label: 'Fees:',
        value: (
          <span>
            {formatValue(feeAmount, 8)} {FAST_BTC_ASSET.toUpperCase()}
          </span>
        ),
      },

      {
        label: 'Received:',
        value: (
          <span>
            {formatValue(receiveAmount, 8)} {FAST_BTC_ASSET.toUpperCase()}
          </span>
        ),
      },
    ],
    [amount, feeAmount, receiveAmount],
  );

  return (
    <>
      <div>
        <Heading>
          {isProcessing ? 'Transfer processing...' : 'Transfer complete'}
        </Heading>

        <div>TBD: Icon</div>

        <div>
          {items.map(({ label, value }) => (
            <div>
              <span>{label} </span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        {depositTx && (
          <div>
            <span>Tx ID: </span>
            <span>
              <TransactionId
                value={depositTx.txHash}
                hideTooltip
                href={`https://live.blockcypher.com/btc-testnet/tx/${depositTx.txHash}`}
              />
            </span>
          </div>
        )}

        {transferTx && (
          <div>
            <span>Tx Hash: </span>
            <span>
              <TransactionId
                value={transferTx.txHash}
                hideTooltip
                href={`https://live.blockcypher.com/btc-testnet/tx/${transferTx.txHash}`}
              />
            </span>
          </div>
        )}
      </div>

      <Button text="Done" onClick={onClose} className="mt-8" />
    </>
  );
};
