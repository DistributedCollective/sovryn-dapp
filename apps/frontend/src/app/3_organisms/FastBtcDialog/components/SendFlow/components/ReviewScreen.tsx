import React, { useCallback, useContext, useMemo } from 'react';

import { ethers } from 'ethers';

import { getProtocolContract, SupportedTokens } from '@sovryn/contracts';
import { Button, Heading, TransactionId } from '@sovryn/ui';

import { defaultChainId } from '../../../../../../config/chains';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { formatValue, fromWei, toWei } from '../../../../../../utils/math';
import { WithdrawContext } from '../../../contexts/withdraw-context';

const asset = SupportedTokens.rbtc;

type ReviewScreenProps = {
  onConfirm: () => void;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ onConfirm }) => {
  const { signer } = useAccount();

  const { amount, address, aggregatorLimits } = useContext(WithdrawContext);
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const weiAmount = toWei(amount);

  // TODO: Create a global function/hook
  const getFastBtcBridgeContract = useCallback(async () => {
    const { address, abi } = await getProtocolContract(
      'fastBtcBridge',
      defaultChainId,
    );
    return new ethers.Contract(address, abi, signer);
  }, [signer]);

  const calculateCurrentFeeWei = useCallback(async () => {
    const fastBtcBridgeContract = await getFastBtcBridgeContract();

    return fastBtcBridgeContract.calculateCurrentFeeWei(weiAmount);
  }, [getFastBtcBridgeContract, weiAmount]);

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
    calculateCurrentFeeWei().then(result => (currentFeeWei = result));

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
            {formatValue(Number(amount), 8)} {asset.toUpperCase()}
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
            {formatValue(feesPaid, 8)} {asset.toUpperCase()}
          </>
        ),
      },
      {
        label: 'Received',
        value: (
          <>
            {formatValue(receiveAmount, 8)} {asset.toUpperCase()}
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
