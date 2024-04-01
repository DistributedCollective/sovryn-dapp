import classNames from 'classnames';

import {
  RANGE_WIDTH_BASE_STYLE,
  RANGE_WIDTH_SELECTED_STYLE,
  RANGE_WIDTH_INFINITE_STYLE,
} from './BalancedRange.constants';

export const renderRangeWidthClassName = (
  rangeWidth: number,
  rangeOption: number,
) =>
  classNames(RANGE_WIDTH_BASE_STYLE, {
    [RANGE_WIDTH_SELECTED_STYLE]: rangeWidth === rangeOption,
    [RANGE_WIDTH_INFINITE_STYLE]: rangeOption === 100,
  });
