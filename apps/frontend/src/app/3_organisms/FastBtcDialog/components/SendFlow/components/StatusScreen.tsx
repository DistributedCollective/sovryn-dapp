import React, { useCallback, useContext, useMemo } from 'react';

import { ethers } from 'ethers';

import { getProtocolContract, SupportedTokens } from '@sovryn/contracts';
import { Button, Heading, TransactionId } from '@sovryn/ui';

import { defaultChainId } from '../../../../../../config/chains';
import { useAccount } from '../../../../../../hooks/useAccount';
import { formatValue, fromWei, toWei } from '../../../../../../utils/math';
import { TransactionStepDialog } from '../../../../TransactionStepDialog';
import { WithdrawContext } from '../../../contexts/withdraw-context';

const asset = SupportedTokens.rbtc;

type StatusScreenProps = {
  txHash?: string;
  onClose: () => void;
};

export const StatusScreen: React.FC<StatusScreenProps> = ({
  txHash,
  onClose,
}) => {
  const { signer } = useAccount();
  const { amount, address, aggregatorLimits } = useContext(WithdrawContext);

  // TODO: Unify this screen and ReviewScreen because all of the computations are the same
  const weiAmount = toWei(amount);

  // TODO: Create a global function/hook
  const getFastBtcBridgeContract = useCallback(async () => {
    const { address, abi } = await getProtocolContract(
      'fastBtcBridge',
      defaultChainId,
    );
    return new ethers.Contract(address, abi, signer);
  }, [signer]);

  //   console.log(`I am in Status Screen, txHash is: ${txHash}`);

  const calculateCurrentFeeWei = useCallback(async () => {
    const fastBtcBridgeContract = await getFastBtcBridgeContract();

    return fastBtcBridgeContract.calculateCurrentFeeWei(weiAmount);
  }, [getFastBtcBridgeContract, weiAmount]);

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
      {
        label: 'Tx hash',
        value: (
          <TransactionId
            value={txHash || ''}
            hideTooltip
            href={`https://live.blockcypher.com/btc-testnet/tx/${txHash}`}
          />
        ),
      },
    ],
    [address, amount, feesPaid, receiveAmount, txHash],
  );

  return (
    <>
      <Heading>
        {!txHash ? 'Transfer processing...' : 'Transfer complete'}
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

      <Button text="Done" onClick={onClose} className="mt-8" />
      <TransactionStepDialog disableFocusTrap={false} />
    </>
  );
};
