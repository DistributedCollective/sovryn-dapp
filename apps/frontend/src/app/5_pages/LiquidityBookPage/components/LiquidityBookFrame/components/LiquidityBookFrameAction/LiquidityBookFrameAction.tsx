import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { LiquidityBookProps } from '../../../../LiquidityBookPage.types';
import { useGetUserOwnedBins } from '../../../../hooks/useGetUserOwnedBins';
import { useHandleLiquidity } from '../../../../hooks/useHandleLiquidity';

export const LiquidityBookFrameAction: FC<LiquidityBookProps> = ({ pool }) => {
  const { account } = useAccount();
  const { userOwnedBins, nonZeroAmounts, loading } = useGetUserOwnedBins(pool);

  const onComplete = useCallback(() => {
    console.log('Successful transaction');
  }, []);

  const { handleDeposit, handleWithdraw } = useHandleLiquidity(pool);

  const isWithdrawDisabled = useMemo(() => {
    return (
      !account || !userOwnedBins.length || !nonZeroAmounts.length || loading
    );
  }, [account, userOwnedBins, nonZeroAmounts, loading]);

  const deposit = useCallback(
    () => handleDeposit('1000000', '500000', onComplete),
    [handleDeposit, onComplete],
  );

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
