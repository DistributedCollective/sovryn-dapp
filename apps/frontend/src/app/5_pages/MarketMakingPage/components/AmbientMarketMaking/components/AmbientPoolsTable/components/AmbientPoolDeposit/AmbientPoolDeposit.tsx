import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { BobDepositModal } from '../../../../../BobDepositModal/BobDepositModal';
import { DepositContextProvider } from '../../../../../BobDepositModal/contexts/BobDepositModalContext';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolDepositProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPoolDeposit: FC<AmbientPoolDepositProps> = ({ pool }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Button
        style={ButtonStyle.primary}
        size={ButtonSize.small}
        text={t(translations.common.deposit)}
        onClick={onClick}
      />

      <DepositContextProvider>
        <BobDepositModal isOpen={isOpen} onClose={handleClose} pool={pool} />
      </DepositContextProvider>
    </>
  );
};
