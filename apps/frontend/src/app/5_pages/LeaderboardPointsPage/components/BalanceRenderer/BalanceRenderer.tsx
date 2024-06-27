import React, { FC, useMemo } from 'react';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { areAddressesEqual } from '../../../../../utils/helpers';
import { User, UserDeposit } from '../../LeaderboardPointsPage.types';
import usersDeposits from './data/usersDeposits.json';

type BalanceRendererProps = {
  user: User;
};

export const BalanceRenderer: FC<BalanceRendererProps> = ({ user }) => {
  const usersDepositsData: UserDeposit[] = usersDeposits;
  const deposits = useMemo(
    () =>
      usersDepositsData.filter(deposit =>
        areAddressesEqual(deposit.userAddress, user.wallet),
      ),
    [usersDepositsData, user.wallet],
  );

  return (
    <div className="min-w-14 py-2">
      {deposits.map((item, index) => (
        <div key={index}>
          <AmountRenderer value={item.totalAmount} suffix={item.tokenSymbol} />
        </div>
      ))}
    </div>
  );
};
