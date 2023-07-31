import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { NewLoanDialog } from '../NewLoanDialog/NewLoanDialog';

export const NewLoanButton: FC = () => {
  const { account } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        text={t(translations.fixedInterestPage.borrowAssetsTable.action)}
        style={ButtonStyle.primary}
        onClick={() => setIsOpen(true)}
        disabled={!account}
      />

      <NewLoanDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
