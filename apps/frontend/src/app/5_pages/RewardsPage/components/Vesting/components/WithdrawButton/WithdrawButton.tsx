import React, { useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonType, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { VestingContractTableRecord } from '../../Vesting.types';
import { useGetUnlockedBalance } from '../../hooks/useGetUnlockedBalance';
import { useHandleWithdraw } from '../../hooks/useHandleWithdraw';

export const WithdrawButton = (item: VestingContractTableRecord) => {
  const handleWithdraw = useHandleWithdraw(item);

  const { isLoading, result } = useGetUnlockedBalance(item);
  const isDisabled = useMemo(() => !result || result === 0, [result]);

  return (
    <div className="flex justify-end w-full md:w-auto h-full pt-3">
      <Button
        onClick={handleWithdraw}
        loading={isLoading}
        text={t(translations.common.buttons.withdraw)}
        type={ButtonType.button}
        style={ButtonStyle.secondary}
        disabled={isDisabled}
      />
    </div>
  );
};
