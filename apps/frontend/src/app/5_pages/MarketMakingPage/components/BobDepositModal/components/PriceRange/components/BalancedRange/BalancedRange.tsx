import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  SimpleTable,
  SimpleTableRow,
  Slider,
} from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { BUTTON_OPTIONS, INFINITE } from './BalancedRange.constants';
import { renderRangeWidthClassName } from './BalancedRange.utils';

export const BalancedRange: FC = () => {
  const { rangeWidth, setRangeWidth } = useDepositContext();

  const isInfiniteRange = useMemo(() => rangeWidth === 100, [rangeWidth]);

  const onRangeChange = useCallback(
    (value: number) => {
      setRangeWidth(value);
    },
    [setRangeWidth],
  );

  return (
    <>
      <div className="flex items-center flex-col">
        <div className="text-xs font-medium text-gray-30">
          {t(translations.bobMarketMakingPage.depositModal.rangeWidth)}
        </div>
        <div className="bg-gray-80 rounded text-gray-10 text-sm font-medium px-12 py-2 mt-2">
          {!isInfiniteRange ? `~ ${rangeWidth}%` : INFINITE}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {BUTTON_OPTIONS.map(item => (
          <Button
            text={item === 100 ? INFINITE : `${item}%`}
            key={item}
            onClick={() => onRangeChange(item)}
            style={ButtonStyle.secondary}
            className={renderRangeWidthClassName(rangeWidth, item)}
          />
        ))}
      </div>

      <div className="px-4 mt-4">
        <Slider onChange={onRangeChange} value={rangeWidth} />
      </div>

      <SimpleTable className="mt-12">
        <SimpleTableRow label="Min price" value="1950.86 DLLR" />
        <SimpleTableRow label="Max price" value="1950.86 DLLR" />
      </SimpleTable>
    </>
  );
};
