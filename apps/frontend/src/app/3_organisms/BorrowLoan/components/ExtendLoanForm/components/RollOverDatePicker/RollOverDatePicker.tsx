import React, { FC, useCallback, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { DayPicker } from 'react-day-picker';

import { Icon, IconNames, Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import styles from './RollOverDatePicker.module.css';

type RollOverDatePickerProps = {
  date: number;
  onChange: (value: number) => void;
  className?: string;
  minDate: number;
};

const pageTranslations = translations.fixedInterestPage.extendLoanDialog;

export const RollOverDatePicker: FC<RollOverDatePickerProps> = ({
  date,
  onChange,
  className,
  minDate,
}) => {
  const [selected, setSelected] = useState<Date | undefined>(
    dayjs.unix(date).toDate(),
  );
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

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
  }, []);

  return (
    <div
      className={classNames(
        className,
        'bg-gray-70 rounded min-h-10 px-3 flex items-center justify-between relative m-0',
      )}
    >
      <Paragraph
        className="font-medium"
        children={t(pageTranslations.labels.nextRolloverDate)}
      />
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
            fromDate={dayjs.unix(minDate).toDate()}
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
