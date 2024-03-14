import React, { FC, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';

import {
  Button,
  ButtonStyle,
  SimpleTable,
  SimpleTableRow,
  Slider,
} from '@sovryn/ui';

import { BUTTON_OPTIONS } from './BalancedRange.constants';

export const BalancedRange: FC = () => {
  const [selectedRangeWidth, setSelectedRangeWidth] = useState(
    BUTTON_OPTIONS[0],
  );

  const isAmbientRange = useMemo(
    () => selectedRangeWidth === 'Ambient',
    [selectedRangeWidth],
  );

  const renderRangeWidthClassName = useMemo(
    () => (rangeOption: string) =>
      classNames('ml-2 p-1 w-12 h-6', {
        'bg-gray-50': selectedRangeWidth === rangeOption,
        'w-fit px-2': rangeOption === 'Ambient',
      }),
    [selectedRangeWidth],
  );

  const onSliderChange = useCallback(value => {
    console.log(`value is: ${value} `);
  }, []);

  return (
    <>
      <div className="flex items-center flex-col">
        <div className="text-xs font-medium text-gray-30">Range width</div>
        <div className="bg-gray-80 rounded text-gray-10 text-sm font-medium px-12 py-2 mt-2">
          {!isAmbientRange ? `~ ${selectedRangeWidth}%` : 'Infinite'}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {BUTTON_OPTIONS.map(item => (
          <Button
            text={item !== 'Ambient' ? `${item}%` : item}
            key={item}
            onClick={() => setSelectedRangeWidth(item)}
            style={ButtonStyle.secondary}
            className={renderRangeWidthClassName(item)}
          />
        ))}
      </div>

      <div className="px-4 mt-4">
        <Slider onChange={onSliderChange} />
      </div>

      <SimpleTable className="mt-12">
        <SimpleTableRow label="Min price" value="1950.86 DLLR" />
        <SimpleTableRow label="Max price" value="1950.86 DLLR" />
      </SimpleTable>
    </>
  );
};
