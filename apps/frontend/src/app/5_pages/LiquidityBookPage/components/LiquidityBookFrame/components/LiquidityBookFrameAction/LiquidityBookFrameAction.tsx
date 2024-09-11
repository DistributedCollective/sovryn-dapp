import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { eventDriven } from '../../../../../../../store/rxjs/event-driven';
import { Nullable } from '../../../../../../../types/global';
import {
  LiquidityBookPool,
  LiquidityBookProps,
} from '../../../../LiquidityBookPage.types';
import { useGetUserOwnedBins } from '../../../../hooks/useGetUserOwnedBins';
import { useHandleLiquidity } from '../../../../hooks/useHandleLiquidity';
import { LBModalType } from '../../../../utils/constants';

export const LiquidityBookFrameAction: FC<LiquidityBookProps> = ({ pool }) => {
  const { push } = useMemo(
    () => eventDriven<Nullable<LiquidityBookPool>>(LBModalType.deposit),
    [],
  );
  const { account } = useAccount();
  const { userOwnedBins, nonZeroAmounts, loading } = useGetUserOwnedBins(pool);

  const onComplete = useCallback(() => {
    console.log('Successful transaction');
  }, []);

  const { handleWithdraw } = useHandleLiquidity(pool);

  const isWithdrawDisabled = useMemo(() => {
    return (
      !account || !userOwnedBins.length || !nonZeroAmounts.length || loading
    );
  }, [account, userOwnedBins, nonZeroAmounts, loading]);

  const deposit = useCallback(() => push(pool), [pool, push]);

  const withdraw = useCallback(
    () => handleWithdraw(onComplete),
    [handleWithdraw, onComplete],
  );

  return (
    <div className="flex items-center justify-center lg:justify-end">
      <Button
        style={ButtonStyle.ghost}
        text={t(translations.liquidityBookPage.actions.deposit)}
        onClick={deposit}
        disabled={!account}
      />
      <Button
        style={ButtonStyle.ghost}
        text={t(translations.liquidityBookPage.actions.withdraw)}
        onClick={withdraw}
        disabled={isWithdrawDisabled}
        className="ml-2"
      />
    </div>
  );
};
