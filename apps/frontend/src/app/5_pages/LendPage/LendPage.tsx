import React, { FC, useCallback, useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Button } from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { eventDriven } from '../../../store/rxjs/event-driven';
import { Nullable } from '../../../types/global';
import { decimalic } from '../../../utils/math';
import { LendModalAction } from './LendPage.types';
import {
  AdjustLendingModalContainer,
  AdjustModalState,
} from './components/AdjustModal/AdjustLendingModalContainer';
import {
  LendingModalContainer,
  LendingModalState,
} from './components/LendModal/LendingModalContainer';
import { useHandleLending } from './hooks/useHandleLending';

const LendPage: FC = () => {
  const { account } = useAccount();

  const { push: adjust } = useMemo(
    () => eventDriven<Nullable<AdjustModalState>>(LendModalAction.Adjust),
    [],
  );
  const { push: lend } = useMemo(
    () => eventDriven<Nullable<LendingModalState>>(LendModalAction.Lend),
    [],
  );

  const handleAdjustClick = useCallback(async () => {
    adjust({
      token: SupportedTokens.xusd,
      apy: decimalic('0.1'),
      balance: decimalic('1000'),
    });
  }, [adjust]);

  const handleLendClick = useCallback(async () => {
    lend({
      token: SupportedTokens.xusd,
      apy: decimalic('0.1'),
    });
  }, [lend]);

  const handleCloseModal = useCallback(() => {
    adjust(null);
    lend(null);
  }, [adjust, lend]);

  const handleComplete = useCallback(() => {}, []);

  const { handleDeposit, handleWithdraw } = useHandleLending(
    handleCloseModal,
    handleComplete,
  );

  return (
    <>
      {account ? (
        <>
          <div className="w-full flex flex-col gap-4 items-center text-gray-10 mt-9 sm:mt-24">
            <Button text="Lend XUSD" onClick={handleLendClick} />

            <Button text="Adjust XUSD" onClick={handleAdjustClick} />
          </div>
          <AdjustLendingModalContainer
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
          <LendingModalContainer onDeposit={handleDeposit} />
        </>
      ) : (
        <>connect wallet first</>
      )}
    </>
  );
};

export default LendPage;
