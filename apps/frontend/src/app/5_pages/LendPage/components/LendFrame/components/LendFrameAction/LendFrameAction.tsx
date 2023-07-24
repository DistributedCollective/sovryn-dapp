import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { LendFrameProps } from '../../LendFrame.types';
import { useGetAssetBalanceOf } from '../LendFrameBalance/hooks/useGetAssetBalanceOf';

export const LendFrameAction: FC<LendFrameProps> = ({ pool }) => {
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { account } = useAccount();
  const { assetBalance } = useGetAssetBalanceOf(asset);

  return (
    <div className="flex items-center justify-end">
      {!account || Number(assetBalance) === 0 ? (
        <Button
          style={ButtonStyle.primary}
          size={ButtonSize.small}
          text={t(translations.lendPage.actions.lend)}
          dataAttribute="lend-frame-lend-button"
          className="w-full md:w-auto prevent-row-click"
          disabled={!account}
        />
      ) : (
        <Button
          style={ButtonStyle.primary}
          size={ButtonSize.small}
          text={t(translations.lendPage.actions.adjust)}
          dataAttribute="lend-frame-adjust-button"
          className="w-full md:w-auto prevent-row-click"
          disabled={!account}
        />
      )}
    </div>
  );
};
