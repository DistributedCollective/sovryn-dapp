import React, { FC, useState } from 'react';

import { t } from 'i18next';

import {
  Dialog,
  DialogBody,
  DialogHeader,
  Paragraph,
  ParagraphSize,
  Tabs,
  TabType,
} from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { RepayWithCollateralForm } from './RepayWithCollateralForm';
import { RepayWithWalletBalanceForm } from './RepayWithWalletBalanceForm';

type RepayModalContainerProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
};

enum RepayWith {
  BALANCE = 0,
  COLLATERAL,
}

export const RepayModalContainer: FC<RepayModalContainerProps> = ({
  isOpen,
  handleCloseModal,
}) => {
  const [activeTab, setActiveTab] = useState<RepayWith>(RepayWith.BALANCE);

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(translations.aavePage.repayModal.title)}
        onClose={handleCloseModal}
      />
      <DialogBody className="space-y-3">
        <Paragraph
          size={ParagraphSize.small}
          className="font-medium text-gray-30"
        >
          {t(translations.aavePage.repayModal.repayWith)}
        </Paragraph>

        <Tabs
          className="flex-grow-0"
          contentClassName="p-4"
          index={activeTab}
          onChange={setActiveTab}
          items={[
            {
              activeClassName: 'text-primary-20',
              dataAttribute: 'wallet-balance',
              label: t(translations.aavePage.repayModal.walletBalance),
            },
            {
              activeClassName: 'text-primary-20',
              dataAttribute: 'collateral',
              label: t(translations.aavePage.common.collateral),
            },
          ]}
          type={TabType.secondary}
        />

        {activeTab === RepayWith.BALANCE ? (
          <RepayWithWalletBalanceForm onSuccess={handleCloseModal} />
        ) : (
          <RepayWithCollateralForm onSuccess={handleCloseModal} />
        )}
      </DialogBody>
    </Dialog>
  );
};
