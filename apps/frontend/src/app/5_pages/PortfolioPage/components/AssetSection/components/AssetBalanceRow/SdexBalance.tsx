import React, { FC, useCallback, useEffect, useState } from 'react';

import { getProvider } from '@sovryn/ethers-provider';
import { CrocEnv } from '@sovryn/sdex';
import { NotificationType } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useNotificationContext } from '../../../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { findAsset } from '../../../../../../../utils/asset';
import { decimalic } from '../../../../../../../utils/math';

type AssetBalanceRowProps = {
  token: string;
};

export const SdexBalance: FC<AssetBalanceRowProps> = ({ token }) => {
  const { addNotification } = useNotificationContext();
  const [balance, setBalance] = useState<Decimal>(Decimal.ZERO);
  const { account, signer } = useAccount();
  useEffect(() => {
    const env = new CrocEnv(getProvider(BOB_CHAIN_ID), signer);
    env
      .token(findAsset(token, BOB_CHAIN_ID)?.address)
      .balanceDisplay(account)
      .then(amount => {
        console.log(token, amount.toString());
        setBalance(decimalic(amount));
      });
  }, [account, signer, token]);

  const handleWithdraw = useCallback(async () => {
    try {
      const env = new CrocEnv(getProvider(BOB_CHAIN_ID), signer);
      const asset = env.token(findAsset(token, BOB_CHAIN_ID)?.address);
      const amount = await asset.balance(account);
      addNotification({
        id: 'dex-withdraw',
        title: 'Confirm withdrawal in your wallet.',
        type: NotificationType.info,
      });
      const tx = await asset.withdraw(amount, account);
      addNotification({
        id: 'dex-withdraw',
        title: 'Transaction is pending, please wait.',
        type: NotificationType.info,
      });
      await tx.wait();
      addNotification({
        id: 'dex-withdraw',
        title:
          'Withdraw completed, you can refresh the page to see the updated balance.',
        type: NotificationType.success,
      });
    } catch (e) {
      console.error(e);
      addNotification({
        id: 'dex-withdraw',
        title: 'Failed to withdraw.',
        type: NotificationType.error,
        content: e.message,
      });
    }
  }, [account, addNotification, signer, token]);

  if (balance.lte(0)) return null;

  return (
    <div className="flex flex-row italic">
      {' '}
      <AmountRenderer value={balance} showRoundingPrefix={false} />
      <button
        onClick={handleWithdraw}
        className="ml-1 px-2 underline text-primary"
      >
        Withdraw
      </button>
    </div>
  );
};
