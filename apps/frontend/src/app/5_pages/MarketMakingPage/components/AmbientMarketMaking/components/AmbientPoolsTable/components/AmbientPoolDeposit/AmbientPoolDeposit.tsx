import React, { FC } from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolDepositProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPoolDeposit: FC<AmbientPoolDepositProps> = () => {
  return (
    <Button
      style={ButtonStyle.primary}
      size={ButtonSize.small}
      text={t(translations.common.deposit)}
    />
  );
};
