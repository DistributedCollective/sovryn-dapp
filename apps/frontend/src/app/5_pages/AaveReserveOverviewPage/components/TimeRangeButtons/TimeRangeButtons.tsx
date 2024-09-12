import React, { FC, useCallback, useState } from 'react';

import {
  ESupportedTimeRanges,
  ReserveRateTimeRange,
} from '../../../../../hooks/aave/useAaveReservesHistory';

interface TimeRangeButtonsProps {
  onChange: (range: ReserveRateTimeRange) => void;
}

export const TimeRangeButtons: FC<TimeRangeButtonsProps> = ({ onChange }) => {
  const [activeRange, setActiveRange] = useState<ReserveRateTimeRange>(
    ESupportedTimeRanges.OneMonth,
  );

  const handleClick = useCallback(
    (range: ReserveRateTimeRange) => {
      setActiveRange(range);
      onChange(range);
    },
    [onChange],
  );

  return (
    <div className="flex space-x-2 justify-end mb-4">
      {' '}
      <button
        className={`py-1.5 px-4 rounded-md text-sm font-medium ${
          activeRange === ESupportedTimeRanges.OneMonth
            ? 'bg-gray-50 text-white'
            : 'bg-gray-70 text-gray-400'
        }`}
        onClick={() => handleClick(ESupportedTimeRanges.OneMonth)}
      >
        {ESupportedTimeRanges.OneMonth}
      </button>
      <button
        className={`py-1.5 px-4 rounded-md text-sm font-medium ${
          activeRange === ESupportedTimeRanges.SixMonths
            ? 'bg-gray-50 text-white'
            : 'bg-gray-70 text-gray-400'
        }`}
        onClick={() => handleClick(ESupportedTimeRanges.SixMonths)}
      >
        {ESupportedTimeRanges.SixMonths}
      </button>
      <button
        className={`py-1.5 px-4 rounded-md text-sm font-medium ${
          activeRange === ESupportedTimeRanges.OneYear
            ? 'bg-gray-50 text-white'
            : 'bg-gray-70 text-gray-400'
        }`}
        onClick={() => handleClick(ESupportedTimeRanges.OneYear)}
      >
        {ESupportedTimeRanges.OneYear}
      </button>
    </div>
  );
};
