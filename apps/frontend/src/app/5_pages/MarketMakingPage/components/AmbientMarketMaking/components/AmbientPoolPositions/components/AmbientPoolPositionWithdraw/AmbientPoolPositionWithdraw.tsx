import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { BobWithdrawModal } from '../../../../../BobWIthdrawModal/BobWithdrawModal';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolPositionWithdrawProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const AmbientPoolPositionWithdraw: FC<
  AmbientPoolPositionWithdrawProps
> = ({ pool, position }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = useCallback(
    () => setIsOpen(prevIsOpen => !prevIsOpen),
    [],
  );

  return (
    <>
      <Button
        style={ButtonStyle.secondary}
        size={ButtonSize.small}
        text={t(translations.common.withdraw)}
        onClick={() => setIsOpen(true)}
      />
      <BobWithdrawModal
        isOpen={isOpen}
        onClose={toggleModal}
        pool={pool}
        position={position}
      />
    </>
  );
};
