import React, { FC, useCallback, useReducer, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';
import 'react-day-picker/dist/style.css';

import { Accordion } from '@sovryn/ui';

import { DatePicker } from '../../../../2_molecules/DatePicker/DatePicker';
import { translations } from '../../../../../locales/i18n';
import { MaxDuration } from '../MaxDuration/MaxDuration';

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
  const [open, toggle] = useReducer(v => !v, false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const onMaxDurationClick = useCallback(() => {
    onChange(dayjs.unix(maxDate).unix());
    setIsCalendarVisible(false);
  }, [maxDate, onChange]);


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

          <DatePicker
            date={date}
            onChange={onChange}
            maxDate={maxDate}
            label={t(
              translations.fixedInterestPage.newLoanDialog.labels
                .firstRolloverDate,
            )}
            isCalendarVisible={isCalendarVisible}
            setIsCalendarVisible={setIsCalendarVisible}
          />
        </div>
      }
      dataAttribute="borrow-advanced-settings-accordion"
    />
  );
};
