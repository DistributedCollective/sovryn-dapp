import React, { FC, useCallback, useReducer, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Accordion, Icon, IconNames, Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { MaxDuration } from '../MaxDuration/MaxDuration';
import styles from './AdvancedSettings.module.css';

type AdvancedSettingsProps = {
  date: number;
  onChange: (value: number) => void;
  className?: string;
  maxDate: number;
  disabled: boolean;
};

export const AdvancedSettings: FC<AdvancedSettingsProps> = ({
  date,
  onChange,
  className,
  maxDate,
  disabled,
}) => {
  const [selected, setSelected] = useState<Date | undefined>(
    dayjs.unix(date).toDate(),
  );
  const [open, toggle] = useReducer(v => !v, false);
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

  const onMaxDurationClick = useCallback(() => {
    setSelected(dayjs.unix(maxDate).toDate());
    onChange(dayjs.unix(maxDate).unix());
    setIsCalendarVisible(false);
  }, [maxDate, onChange]);

  const handleCalendarClick = useCallback(() => {
    setIsCalendarVisible(true);
  }, []);

  return (
    <Accordion
      open={open}
      label={t(translations.advancedSettings.label)}
      onClick={toggle}
      className={className}
      disabled={disabled}
      children={
        <div>
          <MaxDuration
            onClick={onMaxDurationClick}
            dataAttribute="borrow-date-picker-max-duration-button"
            className="flex justify-end mb-2 ml-auto cursor-pointer text-xs font-medium underline"
          />
          <div className="bg-gray-70 rounded min-h-10 px-3 flex items-center justify-between relative m-0">
            <Paragraph
              children={t(
                translations.fixedInterestPage.newLoanDialog.labels
                  .firstRolloverDate,
              )}
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
                  toDate={dayjs.unix(maxDate).toDate()}
                  fromDate={dayjs().toDate()}
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
        </div>
      }
      dataAttribute="borrow-advanced-settings-accordion"
    />
  );
};
