import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';

export const adjustStakeTabs = [
  {
    label: t(translations.stakePage.stakeForm.increase),
    activeClassName: 'text-primary-20',
    dataAttribute: 'stake-increase',
  },
  {
    label: t(translations.stakePage.stakeForm.decrease),
    activeClassName: 'text-primary-20',
    dataAttribute: 'stake-decrease',
  },
  {
    label: t(translations.stakePage.stakeForm.extend),
    activeClassName: 'text-primary-20',
    dataAttribute: 'stake-extend',
  },
  {
    label: t(translations.stakePage.stakeForm.delegate),
    activeClassName: 'text-primary-20',
    dataAttribute: 'stake-delegate',
  },
];
