import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { AdjustLoanDialog } from '../AdjustLoanDialog/AdjustLoanDialog';

export const AdjustLoanButton: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        text={t(translations.fixedInterestPage.openLoansTable.actions.adjust)}
        style={ButtonStyle.primary}
        onClick={() => setIsOpen(true)}
      />

      <AdjustLoanDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
