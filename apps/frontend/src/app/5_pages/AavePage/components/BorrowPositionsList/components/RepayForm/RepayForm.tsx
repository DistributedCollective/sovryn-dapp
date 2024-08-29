import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize, Tabs, TabType } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { RepayWithCollateralForm } from './RepayWithCollateralForm';
import { RepayWithWalletBalanceForm } from './RepayWithWalletBalanceForm';

type RepayFormProps = {
  asset: string;
  onSuccess: () => unknown;
};

enum RepayWith {
  BALANCE = 0,
  COLLATERAL,
}

export const RepayForm: FC<RepayFormProps> = ({ asset, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<RepayWith>(RepayWith.BALANCE);

  const tabItems = useMemo(() => {
    return [
      {
        activeClassName: 'text-primary-20',
        dataAttribute: 'wallet-balance',
        label: t(translations.aavePage.repayModal.walletBalance),
      },
      {
        activeClassName: 'text-primary-20',
        dataAttribute: 'collateral',
        label: t(translations.aavePage.common.collateral),
        disabled: true,
      },
    ];
  }, []);

  return (
    <div className="space-y-2">
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
        items={tabItems}
        type={TabType.secondary}
      />

      {activeTab === RepayWith.BALANCE ? (
        <RepayWithWalletBalanceForm asset={asset} onSuccess={onSuccess} />
      ) : (
        <RepayWithCollateralForm onSuccess={onSuccess} />
      )}
    </div>
  );
};
