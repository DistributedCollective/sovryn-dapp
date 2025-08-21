import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { TabType, Tabs } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { TAB_ACTIVE_CLASSNAME } from '../../../../../constants/general';
import { translations } from '../../../../../locales/i18n';
import { FormType } from './LendingForm';

export type LabelProps = {
  balance: Decimal;
  token: SupportedTokens;
  tab: FormType;
  onTabChanged: (value: FormType) => void;
  onMaxClicked: () => void;
};

export const Label: FC<LabelProps> = ({
  balance,
  token,
  onMaxClicked,
  onTabChanged,
}) => {
  const [index, setIndex] = useState(0);

  const tabs = useMemo(
    () => [
      {
        type: FormType.Deposit,
        label: t(translations.lendingAdjust.deposit),
        activeClassName: TAB_ACTIVE_CLASSNAME,
      },
      {
        amountType: FormType.Withdraw,
        label: t(translations.lendingAdjust.withdraw),
        activeClassName: TAB_ACTIVE_CLASSNAME,
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
