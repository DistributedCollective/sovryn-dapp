import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Pool as AmbientPool } from '@sovryn/sdk';
import {
  ButtonSize,
  ButtonStyle,
  Button,
  Tooltip,
  TooltipTrigger,
} from '@sovryn/ui';

import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../../../locales/i18n';
import { BobDepositModal } from '../../../../../BobDepositModal/BobDepositModal';
import { DepositContextProvider } from '../../../../../BobDepositModal/contexts/BobDepositModalContext';
import { useCheckAmbientPoolBlocked } from '../../../../hooks/useCheckAmbientPoolBlocked';

type AmbientPoolDepositProps = {
  pool: AmbientPool;
};

export const AmbientPoolDeposit: FC<AmbientPoolDepositProps> = ({ pool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { account } = useAccount();

  const onClick = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const { checkMaintenance, States } = useMaintenance();
  const depositLocked = checkMaintenance(States.BOB_DEPOSIT_LIQUIDITY);
  const poolBlocked = useCheckAmbientPoolBlocked(pool);

  const isLocked = depositLocked || poolBlocked.isBlocked;

  return (
    <>
      <Tooltip
        trigger={TooltipTrigger.click}
        content={
          poolBlocked.isBlocked && poolBlocked.message
            ? poolBlocked.message
            : t(translations.maintenanceMode.featureDisabled)
        }
        disabled={!isLocked}
      >
        <Button
          className="md:w-auto w-full"
          style={ButtonStyle.primary}
          size={ButtonSize.small}
          text={t(translations.common.deposit)}
          onClick={e => {
            e.stopPropagation();
            onClick();
          }}
          disabled={!account || isLocked}
        />
      </Tooltip>

      <DepositContextProvider>
        {isOpen && (
          <BobDepositModal isOpen={isOpen} onClose={handleClose} pool={pool} />
        )}
      </DepositContextProvider>
    </>
  );
};
