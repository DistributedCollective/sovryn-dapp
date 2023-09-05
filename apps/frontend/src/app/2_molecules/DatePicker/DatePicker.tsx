import React, { FC, useCallback, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { DayPicker } from 'react-day-picker';

import { Icon, IconNames, Paragraph } from '@sovryn/ui';

import styles from './DatePicker.module.css';

type DatePickerProps = {
  date: number;
  onChange: (value: number) => void;
  className?: string;
  minDate?: number;
  maxDate?: number;
  label: string;
  isCalendarVisible?: boolean;
  setIsCalendarVisible: (value: React.SetStateAction<boolean>) => void;
};

export const DatePicker: FC<DatePickerProps> = ({
  date,
  onChange,
  className,
  label,
  minDate,
  maxDate,
  isCalendarVisible,
  setIsCalendarVisible,
}) => {
  const [selected, setSelected] = useState<Date | undefined>(
    dayjs.unix(date).toDate(),
  );

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }
    setSelected(date);
    setIsCalendarVisible(false);
    const selectedDateTime = dayjs(date);
    const currentTime = dayjs();
    const timestamp =
      selectedDateTime.unix() +
      currentTime.diff(currentTime.startOf('day'), 'seconds');
    onChange(timestamp);
  };

  const handleCalendarClick = useCallback(() => {
    setIsCalendarVisible(previousValue => !previousValue);
  }, [setIsCalendarVisible]);

  return (
    <div
      className={classNames(
        className,
        'bg-gray-70 rounded min-h-10 px-3 flex items-center justify-between relative m-0',
      )}
    >
      <Paragraph className="font-medium" children={label} />
      <div
        className="cursor-pointer flex items-center"
        onClick={handleCalendarClick}
      >
        {dayjs.unix(date).format('DD/MM/YYYY')}
        <Icon icon={IconNames.CALENDAR} size={11} className="ml-2" />
      </div>

      {isCalendarVisible && (
        <div className="absolute top-10 left-0 right-0 z-10">
          <style>
            {`
                    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                      background-color: #F57118;
                      border-radius: 0;
                    }
                  `}
          </style>
          <DayPicker
            initialFocus={isCalendarVisible}
            mode="single"
            defaultMonth={selected}
            selected={selected}
            onSelect={handleDaySelect}
            fromDate={minDate ? dayjs.unix(minDate).toDate() : dayjs().toDate()}
            toDate={maxDate ? dayjs.unix(maxDate).toDate() : undefined}
            modifiersClassNames={{
              selected: styles.selected,
            }}
            styles={{
              caption_label: { fontSize: '1rem' },
            }}
            className="bg-gray-70 rounded m-0 mt-1 px-0 py-3 flex justify-center"
          />
        </div>
      )}
    </div>
  );
};
