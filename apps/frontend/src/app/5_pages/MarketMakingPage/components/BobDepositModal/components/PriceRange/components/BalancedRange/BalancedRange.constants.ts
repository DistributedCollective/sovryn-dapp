import { t } from 'i18next';

import { translations } from '../../../../../../../../../locales/i18n';

export const INFINITE = t(
  translations.bobMarketMakingPage.depositModal.infinite,
);

export const BUTTON_OPTIONS = [5, 10, 25, 50, 100];

export const RANGE_WIDTH_BASE_STYLE =
  'ml-3 p-1 w-12 h-6 bg-gray-70 border-none text-gray-30 text-xs hover:bg-gray-50';
export const RANGE_WIDTH_SELECTED_STYLE = 'bg-gray-50 text-gray-20';
export const RANGE_WIDTH_INFINITE_STYLE = 'w-fit px-2';
