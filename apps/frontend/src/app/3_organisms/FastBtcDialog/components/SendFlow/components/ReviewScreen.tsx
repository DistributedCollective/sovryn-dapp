import React, { useCallback, useContext, useMemo } from 'react';

import { Button, Heading, TransactionId } from '@sovryn/ui';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { formatValue, fromWei, toWei } from '../../../../../../utils/math';
import { FAST_BTC_ASSET } from '../../../constants';
import { WithdrawContext } from '../../../contexts/withdraw-context';

type ReviewScreenProps = {
  onConfirm: () => void;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ onConfirm }) => {
  const { amount, address, aggregatorLimits } = useContext(WithdrawContext);
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const weiAmount = toWei(amount);

  const fastBtcBridgeContract = useGetProtocolContract('fastBtcBridge');

  const calculateCurrentFeeWei = useCallback(
    async () => fastBtcBridgeContract?.calculateCurrentFeeWei(weiAmount),
    [fastBtcBridgeContract, weiAmount],
  );

  // TODO: Use this once I have fix for toWei method
  //   const feesPaid = useMemo(
  //     () =>
  //       bignumber(calculateCurrentFeeWei).add(aggregatorLimits.fee).toString(),
  //     [calculateCurrentFeeWei, aggregatorLimits.fee],
  //   );

  //   const receiveAmount = useMemo(
  //     () => bignumber(weiAmount).minus(feesPaid).toString(),
  //     [weiAmount, feesPaid],
  //   );

  const feesPaid = useMemo(() => {
    let currentFeeWei = 0;
    calculateCurrentFeeWei().then(result => (currentFeeWei = result || 0));

    return Number(fromWei(currentFeeWei)) + aggregatorLimits.min;
  }, [calculateCurrentFeeWei, aggregatorLimits.min]);

  const receiveAmount = useMemo(
    () => Number(fromWei(weiAmount)) - feesPaid,
    [weiAmount, feesPaid],
  );

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
