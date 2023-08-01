import React, { FC, useMemo } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';

import { translations } from '../../../../../../locales/i18n';
import { dateFormat } from '../../../../../../utils/helpers';
import { VestingContractTableRecord } from '../VestingStakesFrame.types';

export const UnlockDateCellRenderer: FC<VestingContractTableRecord> = ({
  duration,
}) => {
  const currentDate = useMemo(() => dayjs().unix(), []);
  const renderEndDate = useMemo(() => {
    if (typeof duration === 'number') {
      const endDate = currentDate + duration;
      return dateFormat(Number(endDate));
    }
    return t(translations.common.na);
  }, [duration, currentDate]);

  return <>{renderEndDate}</>;
};
