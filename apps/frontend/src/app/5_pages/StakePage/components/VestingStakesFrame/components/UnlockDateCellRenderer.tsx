import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../locales/i18n';
import { dateFormat } from '../../../../../../utils/helpers';
import { VestingContractTableRecord } from '../VestingStakesFrame.types';

export const UnlockDateCellRenderer: FC<VestingContractTableRecord> = ({
  duration,
  createdAtTimestamp,
}) => {
  const renderEndDate = useMemo(() => {
    if (typeof duration === 'number') {
      const endDate = createdAtTimestamp + duration;
      return dateFormat(Number(endDate));
    }
    return t(translations.common.na);
  }, [duration, createdAtTimestamp]);

  return <>{renderEndDate}</>;
};
