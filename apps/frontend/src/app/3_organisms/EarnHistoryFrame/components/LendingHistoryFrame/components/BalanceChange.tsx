import React, { FC, useState, useEffect, useMemo } from 'react';

import { SupportedTokens, getTokenDetailsByAddress } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { LendingHistoryType } from '../../../../../../utils/graphql/rsk/generated';
import { decimalic } from '../../../../../../utils/math';
import { LendingEvent } from '../LendingHistoryFrame.types';

type BalanceChangeProps = {
  item: LendingEvent;
};

export const BalanceChange: FC<BalanceChangeProps> = ({ item }) => {
  const [token, setToken] = useState<SupportedTokens | undefined>();

  useEffect(() => {
    const resolveToken = async () => await getTokenDetailsByAddress(item.asset);

    resolveToken().then(result => setToken(result.symbol));
  }, [item.asset]);

  const amount = useMemo(
    () =>
      item.type === LendingHistoryType.UnLend
        ? decimalic(item.amount).mul(-1)
        : decimalic(item.amount),
    [item.amount, item.type],
  );

  return (
    <>
      <AmountRenderer value={amount} suffix={token} />
    </>
  );
};
