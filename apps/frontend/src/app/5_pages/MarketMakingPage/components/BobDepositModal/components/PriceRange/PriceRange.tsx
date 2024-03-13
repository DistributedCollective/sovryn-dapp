import React, { FC, useMemo, useState } from 'react';

import classNames from 'classnames';

import {
  Accordion,
  Button,
  ButtonStyle,
  SimpleTable,
  SimpleTableRow,
  Toggle,
  ToggleAlignment,
} from '@sovryn/ui';

const BUTTON_OPTIONS = ['5', '10', '25', '50', 'Ambient'];

export const PriceRange: FC = () => {
  const [isPriceRangeExpanded, setIsPriceRangeExpanded] = useState(false);
  const [isBalanced, setIsBalanced] = useState(true);

  const [selectedRangeWidth, setSelectedRangeWidth] = useState(
    BUTTON_OPTIONS[0],
  );

  const isAmbientRange = useMemo(
    () => selectedRangeWidth === 'Ambient',
    [selectedRangeWidth],
  );

  const renderRangeWidthClassName = useMemo(
    () => (selectedRange: string) =>
      classNames('ml-2 p-1 w-12 h-6', {
        'bg-gray-50': selectedRangeWidth === selectedRange,
        'w-fit px-2': selectedRange === 'Ambient',
      }),
    [selectedRangeWidth],
  );

  return (
    <div className="bg-gray-90 px-2 py-4 mt-6 rounded">
      <Accordion
        label="Price range"
        open={isPriceRangeExpanded}
        onClick={() => setIsPriceRangeExpanded(!isPriceRangeExpanded)}
        labelClassName="justify-between"
      >
        <div>
          <Toggle
            checked={isBalanced}
            onChange={() => setIsBalanced(!isBalanced)}
            label="Balanced"
            alignment={ToggleAlignment.RIGHT}
          />
        </div>

        <div>
          {isBalanced && (
            <>
              <div className="flex items-center flex-col">
                <div className="text-xs font-medium text-gray-30">
                  Range width
                </div>
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

              <SimpleTable className="mt-4">
                <SimpleTableRow label="Min price" value="1950.86 DLLR" />
                <SimpleTableRow label="Max price" value="1950.86 DLLR" />
              </SimpleTable>
            </>
          )}
        </div>
      </Accordion>
    </div>
  );
};
