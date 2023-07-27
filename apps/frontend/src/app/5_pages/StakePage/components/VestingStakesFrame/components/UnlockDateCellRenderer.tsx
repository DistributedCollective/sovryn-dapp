import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../locales/i18n';
import { dateFormat } from '../../../../../../utils/helpers';
import { Vesting } from '../VestingStakesFrame.types';
import { useGetVestingStakeStartEndDates } from '../hooks/useGetVestingStakeStartEndDates';

export const UnlockDateCellRenderer: FC<Vesting> = ({ vestingContract }) => {
  const { endDate } = useGetVestingStakeStartEndDates(vestingContract);
  const renderEndDate = useMemo(
    () => (endDate ? dateFormat(Number(endDate)) : t(translations.common.na)),
    [endDate],
  );

  return <>{renderEndDate}</>;
};
