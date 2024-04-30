import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { BobClaimFeesModal } from '../../../../../BobClaimFeesModal/BobClaimFeesModal';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolPositionClaimFeesProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
  className?: string;
};

export const AmbientPoolPositionClaimFees: FC<
  AmbientPoolPositionClaimFeesProps
> = ({ pool, position, className }) => {
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
        text={t(translations.bobMarketMakingPage.claimFeesModal.claimFees)}
        onClick={() => setIsOpen(true)}
        className={className}
      />
      <BobClaimFeesModal
        isOpen={isOpen}
        onClose={toggleModal}
        pool={pool}
        position={position}
      />
    </>
  );
};
