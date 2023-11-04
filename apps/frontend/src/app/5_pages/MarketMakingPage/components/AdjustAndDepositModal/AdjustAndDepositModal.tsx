import React, { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Dialog, DialogHeader, DialogBody } from '@sovryn/ui';

import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.marketMakingPage.adjustAndDepositModal;

type AdjustAndDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AdjustAndDepositModal: FC<AdjustAndDepositModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(pageTranslations.titles.adjust)}
        onClose={onClose}
      />
      <DialogBody>
        <>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={SupportedTokens.dllr}
              label1={t(pageTranslations.currentStatistics.returnRate)}
              label2={t(pageTranslations.currentStatistics.currentBalance)}
              value1="Up to 8.55% APR"
              value2="0 DLLR"
            />
          </div>
          <div>Content</div>
        </>
      </DialogBody>
    </Dialog>
  );
};
