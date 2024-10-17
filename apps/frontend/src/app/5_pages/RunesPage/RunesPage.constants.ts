import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { RUNES_USE_CASE_ACTIONS, AvailableRunes } from './RunesPage.types';
import convertIcon from './assets/convert.svg';
import earnIcon from './assets/earn.svg';
import iconPups from './assets/iconPups.svg';
import runesBenefitsIcon1 from './assets/l1.svg';
import runesBenefitsIcon2 from './assets/l2.svg';
import runesBenefitsIcon3 from './assets/l3.svg';
import runesBenefitsIcon4 from './assets/l4.svg';

export const AVAILABLE_RUNES: AvailableRunes = {
  POWA: {
    symbol: 'POWA',
  },
  DOG: {
    symbol: 'DOGGOTOTHEMOON',
  },
  PUPS: {
    symbol: 'PUPSWORLDPEACE',
    icon: iconPups,
  },
};

export const RUNES_BENEFITS = [
  {
    title: t(translations.runesPage.benefits.list.l1),
    icon: runesBenefitsIcon1,
  },
  {
    title: t(translations.runesPage.benefits.list.l2),
    icon: runesBenefitsIcon2,
  },
  {
    title: t(translations.runesPage.benefits.list.l3),
    icon: runesBenefitsIcon3,
  },
  {
    title: t(translations.runesPage.benefits.list.l4),
    icon: runesBenefitsIcon4,
  },
];

export const RUNES_USE_CASES = [
  {
    title: t(translations.runesPage.runesUseCases.convert),
    description: t(translations.runesPage.runesUseCases.convertDescription),
    icon: convertIcon,
    action: RUNES_USE_CASE_ACTIONS.convert,
  },
  {
    title: t(translations.runesPage.runesUseCases.earn),
    description: t(translations.runesPage.runesUseCases.earnDescription),
    icon: earnIcon,
    action: RUNES_USE_CASE_ACTIONS.deposit,
  },
];

export const RUNES_REQUEST_EMAIL = 'mailto:shir+newrunes@remake.money';
