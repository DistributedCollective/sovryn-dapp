import classNames from 'classnames';

import {
  PERCENTAGE_OPTIONS_BASE_STYLE,
  PERCENTAGE_OPTIONS_SELECTED_STYLE,
} from './AmountForm.constants';

export const renderPercentageClassName = (
  withdrawAmountPercentage: number,
  percentage: number,
) =>
  classNames(PERCENTAGE_OPTIONS_BASE_STYLE, {
    [PERCENTAGE_OPTIONS_SELECTED_STYLE]:
      withdrawAmountPercentage === percentage,
  });
