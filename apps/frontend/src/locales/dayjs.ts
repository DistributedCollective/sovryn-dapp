import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/pt-br';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';
import i18next from 'i18next';

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsLocalizedFormat);

i18next.on('languageChanged', (lng: string) => {
  dayjs.locale(lng);
});
