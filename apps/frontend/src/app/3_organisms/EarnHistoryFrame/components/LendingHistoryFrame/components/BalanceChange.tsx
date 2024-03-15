import React, { FC, useState, useEffect, useMemo } from 'react';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BITCOIN } from '../../../../../../constants/currencies';
import { LendingHistoryType } from '../../../../../../utils/graphql/rsk/generated';
import { decimalic } from '../../../../../../utils/math';
import { LendingEvent } from '../LendingHistoryFrame.types';
import { isBtcBasedAsset } from '../../../../../../utils/helpers';
import { getAssetDataByAddress } from '@sovryn/contracts';
import { RSK_CHAIN_ID } from '../../../../../../config/chains';

type BalanceChangeProps = {
  item: LendingEvent;
};

export const BalanceChange: FC<BalanceChangeProps> = ({ item }) => {
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    const resolveToken = async () =>
      await getAssetDataByAddress(item.asset, RSK_CHAIN_ID);

    resolveToken().then(result => setToken(result.symbol));
  }, [item.asset]);

  const suffix = useMemo(() => {
    if (token) {
      return isBtcBasedAsset(token) ? BITCOIN : token;
    }
  }, [token]);

  const amount = useMemo(
    () =>
      item.type === LendingHistoryType.UnLend
        ? decimalic(item.amount).mul(-1)
        : decimalic(item.amount),
    [item.amount, item.type],
  );

  return (
    <>
      <AmountRenderer value={amount} suffix={suffix} />
    </>
  );
};
