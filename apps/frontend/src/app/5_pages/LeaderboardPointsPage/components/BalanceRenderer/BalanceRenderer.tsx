import React, { FC } from 'react';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../../utils/helpers';
import { User } from '../../LeaderboardPointsPage.types';
import usersDeposits from '../../data/usersDeposits.json';

type BalanceRendererProps = {
  user: User;
};

export const BalanceRenderer: FC<BalanceRendererProps> = ({ user }) => {
  const { account } = useAccount();
  const userDeposits = usersDeposits.filter(deposit =>
    areAddressesEqual(deposit.userAddress, user.wallet),
  );

  return (
    <div className="min-w-14">
      {areAddressesEqual(account, user.wallet) ? (
        userDeposits.map((item, index) => (
          <div key={index}>
            <AmountRenderer
              value={item.totalAmount}
              suffix={item.tokenSymbol}
            />
          </div>
        ))
      ) : (
        <div className="lg:hidden">-</div>
      )}
    </div>
  );
};
