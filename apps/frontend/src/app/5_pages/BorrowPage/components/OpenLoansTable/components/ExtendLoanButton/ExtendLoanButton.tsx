import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { ExtendLoanDialog } from '../ExtendLoanDialog/ExtendLoanDialog';

export const ExtendLoanButton: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        text={t(translations.fixedInterestPage.borrowAssetsTable.action)}
        style={ButtonStyle.secondary}
        onClick={() => setIsOpen(true)}
      />

      <ExtendLoanDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
