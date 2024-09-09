import React, { useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { eventDriven } from '../../../../../store/rxjs/event-driven';
import { Nullable } from '../../../../../types/global';
import { LiquidityBookPool } from '../../LiquidityBookPage.types';
import { LBModalType } from '../../utils/constants';
import { Content } from './Content';

export const LiquidityBookModal = () => {
  const { subscribe } = useMemo(
    () => eventDriven<Nullable<LiquidityBookPool>>(LBModalType.deposit),
    [],
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [pool, setPool] = React.useState<Nullable<LiquidityBookPool>>(null);

  useEffect(() => {
    const sub = subscribe(value => {
      setIsOpen(value !== null);
      setPool(value);
    });

    return () => sub.unsubscribe();
  }, [subscribe]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPool(null);
  }, []);

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(translations.liquidityBookDeposit.title)}
        onClose={handleClose}
      />
      <DialogBody>
        {isOpen && pool && <Content pool={pool} onClose={handleClose} />}
      </DialogBody>
    </Dialog>
  );
};
