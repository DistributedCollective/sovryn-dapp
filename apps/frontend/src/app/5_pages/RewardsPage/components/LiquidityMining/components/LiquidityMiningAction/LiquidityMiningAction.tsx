import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ButtonType } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

type LiquidityMiningActionProps = {
  claimDisabled?: boolean;
  onClick: () => void;
  dataAttribute?: string;
  className?: string;
};

const pageTranslations = translations.rewardPage.liquidityMining;

export const LiquidityMiningAction: FC<LiquidityMiningActionProps> = ({
  claimDisabled,
  onClick,
  dataAttribute,
  className,
}) => (
  <div className={className}>
    <Button
      type={ButtonType.button}
      style={ButtonStyle.secondary}
      text={t(pageTranslations.actions.claimAll)}
      onClick={onClick}
      disabled={claimDisabled}
      dataAttribute={dataAttribute}
      className="w-full md:w-auto"
    />
  </div>
);
