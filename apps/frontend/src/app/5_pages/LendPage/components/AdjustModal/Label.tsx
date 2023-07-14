import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { TabType, Tabs } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { translations } from '../../../../../locales/i18n';
import { FormType } from './LendingForm';

export type LabelProps = {
  balance: Decimal;
  token: SupportedTokens;
  tab: FormType;
  onTabChanged: (value: FormType) => void;
  onMaxClicked: () => void;
};

const ACTIVE_CLASSNAME = 'bg-gray-70 text-primary-20';

export const Label: FC<LabelProps> = ({
  balance,
  token,
  onMaxClicked,
  tab,
  onTabChanged,
}) => {
  const [index, setIndex] = useState(0);

  const tabs = useMemo(
    () => [
      {
        type: FormType.Deposit,
        label: t(translations.lendingAdjust.deposit),
        activeClassName: ACTIVE_CLASSNAME,
      },
      {
        amountType: FormType.Withdraw,
        label: t(translations.lendingAdjust.withdraw),
        activeClassName: ACTIVE_CLASSNAME,
      },
    ],
    [],
  );

  const handleTabChange = useCallback(
    (tab: number) => {
      setIndex(tab);
      onTabChanged(tabs[tab]?.type!);
    },
    [onTabChanged, tabs],
  );

  return (
    <div className="w-full flex justify-between">
      <Tabs
        items={tabs}
        index={index}
        onChange={handleTabChange}
        type={TabType.secondary}
      />
      <MaxButton value={balance} token={token} onClick={onMaxClicked} />
    </div>
  );
};
