import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { useRequiredChain } from '../../../../../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { eventDriven } from '../../../../../../../store/rxjs/event-driven';
import { Nullable } from '../../../../../../../types/global';
import { LendModalAction } from '../../../../LendPage.types';
import { useHandleLending } from '../../../../hooks/useHandleLending';
import { AdjustLendingModalContainer } from '../../../AdjustModal/AdjustLendingModalContainer';
import { LendingModalContainer } from '../../../LendModal/LendingModalContainer';
import { LendFrameProps } from '../../LendFrame.types';
import { useGetAssetBalanceOf } from '../LendFrameBalance/hooks/useGetAssetBalanceOf';

export const LendFrameAction: FC<LendFrameProps> = ({ pool }) => {
  const { invalidChain } = useRequiredChain();
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { account } = useAccount();
  const { assetBalance } = useGetAssetBalanceOf(asset);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);

  const { push: adjust } = useMemo(
    () => eventDriven<Nullable<SupportedTokens>>(LendModalAction.Adjust),
    [],
  );
  const { push: lend } = useMemo(
    () => eventDriven<Nullable<SupportedTokens>>(LendModalAction.Lend),
    [],
  );

  const handleAdjustClick = useCallback(async () => {
    adjust(pool.getAsset());
    setIsAdjustModalOpen(true);
  }, [adjust, pool]);

  const handleLendClick = useCallback(async () => {
    lend(pool.getAsset());
    setIsLendModalOpen(true);
  }, [lend, pool]);

  const handleCloseModal = useCallback(() => {
    adjust(null);
    lend(null);
    setIsAdjustModalOpen(false);
    setIsLendModalOpen(false);
  }, [adjust, lend]);

  const handleComplete = useCallback(() => {}, []);

  const { handleDeposit, handleWithdraw } = useHandleLending(
    handleCloseModal,
    handleComplete,
  );

  return (
    <div className="flex items-center justify-center lg:justify-end">
      {!account || Number(assetBalance) === 0 ? (
        <Button
          style={ButtonStyle.primary}
          size={ButtonSize.small}
          text={t(translations.lendPage.actions.deposit)}
          dataAttribute="lend-frame-deposit-button"
          className="w-full lg:w-auto prevent-row-click"
          disabled={!account || invalidChain}
          onClick={handleLendClick}
        />
      ) : (
        <Button
          style={ButtonStyle.secondary}
          size={ButtonSize.small}
          text={t(translations.lendPage.actions.adjust)}
          dataAttribute="lend-frame-adjust-button"
          className="w-full lg:w-auto prevent-row-click"
          disabled={!account || invalidChain}
          onClick={handleAdjustClick}
        />
      )}

      <AdjustLendingModalContainer
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onClose={handleCloseModal}
        isOpen={isAdjustModalOpen}
      />
      <LendingModalContainer
        onDeposit={handleDeposit}
        onClose={handleCloseModal}
        isOpen={isLendModalOpen}
      />
    </div>
  );
};
