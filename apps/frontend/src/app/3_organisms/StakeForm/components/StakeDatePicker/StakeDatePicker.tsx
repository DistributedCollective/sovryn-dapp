import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { t } from 'i18next';

import { ErrorBadge, ErrorLevel, Select } from '@sovryn/ui';

import { MS } from '../../../../../constants/general';
import { translations } from '../../../../../locales/i18n';
import { FilteredDate } from '../../StakeForm.types';
import { useGetKickoffTs } from '../../hooks/useGetKickoffTs';
import { MaxDuration } from '../MaxDuration/MaxDuration';
import styles from './StakeDatePicker.module.css';
import { Month, StakeDatePickerProps } from './StakeDatePicker.types';
import { getAvailableDates } from './StakeDatePicker.utils';

const MAX_PERIODS = 78;

export const StakeDatePicker: FC<StakeDatePickerProps> = ({
  onChange,
  previouslySelectedDate,
}) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredDates, setFilteredDates] = useState<FilteredDate[]>([]);

  const { kickoffTs } = useGetKickoffTs();
  const currentDate = useMemo(() => new Date(), []);
  const currentUserOffset = useMemo(
    () => currentDate.getTimezoneOffset() / 60,
    [currentDate],
  );

  const { availableYears, availableMonths, availableDays } = getAvailableDates(
    filteredDates,
    selectedYear,
    selectedMonth,
  );

  const [isDateAvailable, setIsDateAvailable] = useState(true);

  const handleSelectDay = useCallback(
    (day: string) => {
      setSelectedDay(day);

      if (selectedYear !== '' && selectedMonth !== '') {
        const monthIndex = Month[selectedMonth];
        const selectedDate = new Date(
          Number(selectedYear),
          monthIndex,
          Number(day),
        );
        const selectedDateString = selectedDate.toLocaleDateString();
        const date = filteredDates.find(
          date => date.date.toLocaleDateString() === selectedDateString,
        )?.key;

        const timestamp = date
          ? Number(
              dayjs(date).subtract(currentUserOffset, 'hour').add(1, 'hour'),
            ) / MS
          : 0;

        onChange(timestamp);
      }
    },
    [selectedYear, selectedMonth, filteredDates, onChange, currentUserOffset],
  );

  const handleSelectYear = useCallback(
    (year: string) => {
      setSelectedYear(year);
      setSelectedMonth('');
      setSelectedDay('');
      onChange(0);
    },
    [onChange],
  );

  const handleSelectMonth = useCallback(
    (month: any) => {
      setSelectedMonth(month);
      setSelectedDay('');
      onChange(0);
    },
    [onChange],
  );

  const onMaxDurationClick = useCallback(() => {
    const maxDate = filteredDates[filteredDates.length - 1];
    if (maxDate) {
      const timestamp =
        Number(
          dayjs(maxDate.key).subtract(currentUserOffset, 'hour').add(1, 'hour'),
        ) / MS;
      setSelectedYear(timestamp ? maxDate.date.getFullYear().toString() : '');
      setSelectedMonth(timestamp ? Month[maxDate.date.getMonth()] : '');
      setSelectedDay(timestamp ? maxDate.date.getDate().toString() : '');
      onChange(timestamp);
    }
  }, [currentUserOffset, filteredDates, onChange]);

  useEffect(() => {
    setFilteredDates(
      dates.map(item => ({
        key: item.getTime(),
        label: item.toLocaleDateString(),
        date: item,
      })),
    );
  }, [dates]);

  useEffect(() => {
    if (!kickoffTs) return;

    const contractDate = dayjs(kickoffTs * MS).toDate();
    const contractOffset = contractDate.getTimezoneOffset() / 60;
    const contractDateDeployed = dayjs(kickoffTs * MS).add(
      contractOffset,
      'hour',
    );
    const userDateUTC = dayjs(currentDate).add(currentUserOffset, 'hour');

    const dates: Date[] = [];
    const datesFutures: Date[] = [];

    let intervalDate = contractDateDeployed;

    while (intervalDate.unix() < userDateUTC.unix()) {
      intervalDate = intervalDate.add(2, 'week');
    }

    for (let i = 1; i < MAX_PERIODS; i++) {
      if (intervalDate.unix() > userDateUTC.unix()) {
        const date = intervalDate.add(2, 'week');
        intervalDate = date;

        if (!previouslySelectedDate) {
          dates.push(date.toDate());
        }

        if (
          previouslySelectedDate &&
          dayjs(previouslySelectedDate * MS)
            .add(contractOffset, 'hour')
            .toDate()
            .getTime() /
            MS <
            date.unix()
        ) {
          datesFutures.push(date.toDate());
        }
      }
    }

    setDates(datesFutures.length ? datesFutures : dates);
    setIsDateAvailable(datesFutures.length > 0 || !previouslySelectedDate);
  }, [kickoffTs, currentDate, currentUserOffset, previouslySelectedDate]);

  return (
    <div className="relative w-full flex lg:flex-row flex-col justify-between items-center gap-3 mt-3.5 mb-6">
      {isDateAvailable ? (
        <>
          <MaxDuration
            onClick={onMaxDurationClick}
            dataAttribute="stake-date-picker-max-duration-button"
          />
          <Select
            value={selectedYear}
            onChange={handleSelectYear}
            options={availableYears}
            className={styles.select}
            dataAttribute="stake-date-picker-year-select"
            labelRenderer={() =>
              selectedYear === ''
                ? t(translations.stakePage.stakeForm.year)
                : selectedYear
            }
          />

          <Select
            value={selectedMonth}
            onChange={handleSelectMonth}
            options={availableMonths}
            className={classNames(
              styles.select,
              !selectedYear && styles.disabled,
            )}
            dataAttribute="stake-date-picker-month-select"
            menuClassName="max-h-[12rem] sm:max-h-[14rem]"
            labelRenderer={() =>
              selectedMonth === ''
                ? t(translations.stakePage.stakeForm.month)
                : selectedMonth
            }
          />

          <Select
            value={selectedDay}
            onChange={handleSelectDay}
            options={availableDays}
            className={classNames(
              styles.select,
              !selectedMonth && styles.disabled,
            )}
            dataAttribute="stake-date-picker-day-select"
            labelRenderer={() =>
              selectedDay === ''
                ? t(translations.stakePage.stakeForm.day)
                : selectedDay
            }
          />
        </>
      ) : (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.stakePage.stakeForm.noAvailableDates)}
          dataAttribute="stake-date-picker-error"
          className="w-full"
        />
      )}
    </div>
  );
};
