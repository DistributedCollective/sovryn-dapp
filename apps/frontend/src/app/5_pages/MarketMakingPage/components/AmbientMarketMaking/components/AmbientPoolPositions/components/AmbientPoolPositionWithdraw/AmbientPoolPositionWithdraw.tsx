import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { useMaintenance } from '../../../../../../../../../hooks/useMaintenance';
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
  const { checkMaintenance, States } = useMaintenance();
  const withdrawLocked = checkMaintenance(States.BOB_WITHDRAW_LIQUIDITY);

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
        disabled={withdrawLocked}
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
