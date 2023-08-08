import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { translations } from '../../../../../locales/i18n';

export const getStakingRevenueType = (token: SupportedTokens) =>
  [SupportedTokens.rbtc, SupportedTokens.mynt].includes(token)
    ? t(translations.rewardPage.staking.stakingRevenueLegacy)
    : t(translations.rewardPage.staking.stakingRevenue);
