import React, { FC } from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolPositionWithdrawProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const AmbientPoolPositionWithdraw: FC<
  AmbientPoolPositionWithdrawProps
> = () => {
  return (
    <Button
      style={ButtonStyle.secondary}
      size={ButtonSize.small}
      text={t(translations.common.withdraw)}
    />
  );
};
