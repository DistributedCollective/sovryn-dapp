import dayjs from 'dayjs';

import { FilteredDate } from '../../StakeForm.types';

export const getAvailableDates = (
  filteredDates: FilteredDate[],
  selectedYear: string,
  selectedMonth: string,
) => {
  const availableYearsSet = new Set('');
  const availableMonthsSet = new Set('');
  const availableDaysSet = new Set('');

  filteredDates.forEach(yearDate => {
    const year = dayjs(yearDate.date).format('YYYY');
    availableYearsSet.add(year);

    if (selectedYear === null || year === selectedYear) {
      const month = dayjs(yearDate.date).format('MMMM');
      availableMonthsSet.add(month);

      if (selectedMonth === null || month === selectedMonth) {
        const day = dayjs(yearDate.date).format('D');
        availableDaysSet.add(day);
      }
    }
  });

  const availableYears = Array.from(availableYearsSet).map(year => ({
    value: year,
    label: year,
  }));

  const availableMonths = Array.from(availableMonthsSet).map(month => ({
    value: month,
    label: month,
  }));

  const availableDays = Array.from(availableDaysSet).map(day => ({
    value: day,
    label: day,
  }));

  return { availableYears, availableMonths, availableDays };
};
