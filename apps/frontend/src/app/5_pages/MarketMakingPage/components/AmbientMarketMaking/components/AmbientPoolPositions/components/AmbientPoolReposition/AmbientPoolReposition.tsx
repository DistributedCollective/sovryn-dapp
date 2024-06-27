import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { useMaintenance } from '../../../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../../../locales/i18n';
import { DepositContextProvider } from '../../../../../BobDepositModal/contexts/BobDepositModalContext';
import { BobRepositionModal } from '../../../../../BobRepositionModal/BobRepositionModal';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';
import { usePositionStatus } from '../../hooks/usePositionStatus';

type AmbientPoolRepositionProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
  className?: string;
};

export const AmbientPoolReposition: FC<AmbientPoolRepositionProps> = ({
  pool,
  position,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { checkMaintenance, States } = useMaintenance();
  const withdrawLocked = checkMaintenance(States.BOB_WITHDRAW_LIQUIDITY);
  const isOutOfRange = usePositionStatus(pool, position);

  const toggleModal = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);

  if (!isOutOfRange) {
    return null;
  }

  return (
    <>
      <Button
        style={ButtonStyle.secondary}
        size={ButtonSize.small}
        text={t(translations.common.buttons.reposition)}
        onClick={toggleModal}
        disabled={withdrawLocked}
        className={className}
      />
      <DepositContextProvider>
        <BobRepositionModal
          isOpen={isOpen}
          onClose={toggleModal}
          pool={pool}
          position={position}
        />
      </DepositContextProvider>
    </>
  );
};
