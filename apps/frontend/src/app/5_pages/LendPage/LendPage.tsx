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
import { useHandleLending } from './hooks/useHandleLending';

const LendPage: FC = () => {
  const { account } = useAccount();

  const { push: adjust } = useMemo(
    () => eventDriven<Nullable<AdjustModalState>>(LendModalAction.Adjust),
    [],
  );

  const handleAdjustClick = useCallback(async () => {
    adjust({
      token: SupportedTokens.xusd,
      apy: decimalic('0.1'),
      balance: decimalic('1000'),
    });
  }, [adjust]);

  const handleCloseModal = useCallback(() => adjust(null), [adjust]);
  const handleComplete = useCallback(() => {}, []);

  const { handleDeposit, handleWithdraw } = useHandleLending(
    handleCloseModal,
    handleComplete,
  );

  return (
    <>
      {account ? (
        <>
          <div className="w-full flex flex-col items-center text-gray-10 mt-9 sm:mt-24">
            <Button text="Adjust XUSD" onClick={handleAdjustClick} />
          </div>
          <AdjustLendingModalContainer
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        </>
      ) : (
        <>connect wallet first</>
      )}
    </>
  );
};

export default LendPage;
