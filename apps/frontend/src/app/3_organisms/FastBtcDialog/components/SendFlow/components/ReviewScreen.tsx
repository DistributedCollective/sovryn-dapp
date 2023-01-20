import React, { useContext, useMemo } from 'react';

import { Button, Heading, TransactionId } from '@sovryn/ui';

import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { formatValue } from '../../../../../../utils/math';
import { FAST_BTC_ASSET } from '../../../constants';
import { WithdrawContext } from '../../../contexts/withdraw-context';

type ReviewScreenProps = {
  feesPaid: number;
  receiveAmount: number;
  onConfirm: () => void;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  onConfirm,
  feesPaid,
  receiveAmount,
}) => {
  const { amount, address } = useContext(WithdrawContext);
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const items = useMemo(
    () => [
      {
        label: 'Date and Time',
        value: new Date().toLocaleDateString(),
      },
      {
        label: 'Amount',
        value: (
          <>
            {formatValue(Number(amount), 8)} {FAST_BTC_ASSET.toUpperCase()}
          </>
        ),
      },
      {
        label: 'Address',
        value: (
          <TransactionId
            value={address}
            hideTooltip
            href={`https://live.blockcypher.com/btc-testnet/tx/${address}`}
          />
        ),
      },
      {
        label: 'Fees',
        value: (
          <>
            {formatValue(feesPaid, 8)} {FAST_BTC_ASSET.toUpperCase()}
          </>
        ),
      },
      {
        label: 'Received',
        value: (
          <>
            {formatValue(receiveAmount, 8)} {FAST_BTC_ASSET.toUpperCase()}
          </>
        ),
      },
    ],
    [address, amount, feesPaid, receiveAmount],
  );

  return (
    <>
      <Heading>Transfer details</Heading>

      <div>
        {items.map(({ label, value }) => (
          <div>
            <span>{label} </span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button text="Confirm" onClick={onConfirm} disabled={fastBtcLocked} />
        {fastBtcLocked && <div>Fast BTC is in maintenance mode</div>}
      </div>
    </>
  );
};
