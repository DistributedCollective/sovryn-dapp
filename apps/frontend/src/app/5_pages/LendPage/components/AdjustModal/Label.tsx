import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
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

export const Label: FC<LabelProps> = ({
  balance,
  token,
  onMaxClicked,
  tab,
  onTabChanged,
}) => {
  const handleTabChange = useCallback(
    (type: FormType) => () => onTabChanged(type),
    [onTabChanged],
  );

  return (
    <div className="w-full flex justify-between">
      <div>
        <button onClick={handleTabChange(FormType.Deposit)}>
          {t(translations.lendingAdjust.deposit)}
        </button>
        <button onClick={handleTabChange(FormType.Withdraw)}>
          {t(translations.lendingAdjust.withdraw)}
        </button>
      </div>
      <MaxButton value={balance} token={token} onClick={onMaxClicked} />
    </div>
  );
};
