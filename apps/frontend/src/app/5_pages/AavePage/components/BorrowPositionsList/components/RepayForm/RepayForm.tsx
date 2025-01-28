import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize, Tabs, TabType } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { TAB_ITEMS } from './RepayForm.constants';
import { RepayWithCollateralForm } from './RepayWithCollateralForm';
import { RepayWithWalletBalanceForm } from './RepayWithWalletBalanceForm';

type RepayFormProps = {
  asset: string;
  onComplete: () => void;
};

enum RepayWith {
  BALANCE = 0,
  COLLATERAL,
}

export const RepayForm: FC<RepayFormProps> = ({ asset, onComplete }) => {
  const [activeTab, setActiveTab] = useState<RepayWith>(RepayWith.BALANCE);

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
        items={TAB_ITEMS}
        type={TabType.secondary}
      />

      {activeTab === RepayWith.BALANCE ? (
        <RepayWithWalletBalanceForm asset={asset} onComplete={onComplete} />
      ) : (
        <RepayWithCollateralForm onComplete={onComplete} />
      )}
    </div>
  );
};
