import { t } from 'i18next';

import { BadgeStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { UserBadges } from '../../Leaderboard.types';

const baseTranslation = translations.leaderboardPage.tables.baseTable.badges;

export const getBadgeDetails = (badge: UserBadges) => {
  switch (badge) {
    case UserBadges.EARLY_USER:
      return {
        title: t(baseTranslation.earlyUser),
        style: BadgeStyle.teal,
      };
    case UserBadges.GENESIS:
      return {
        title: t(baseTranslation.genesis),
        style: BadgeStyle.teal,
      };
    case UserBadges.NFT:
      return {
        title: t(baseTranslation.nft),
        style: BadgeStyle.teal,
      };
    case UserBadges.ORIGIN:
      return {
        title: t(baseTranslation.origin),
        style: BadgeStyle.teal,
      };
    case UserBadges.TOP_IMPORTER_DAY:
      return {
        title: t(baseTranslation.topImporterDay),
        style: BadgeStyle.brown,
      };
    case UserBadges.TOP_IMPORTER_WEEK:
      return {
        title: t(baseTranslation.topImporterWeek),
        style: BadgeStyle.brown,
      };
    case UserBadges.VOTER:
      return {
        title: t(baseTranslation.voter),
        style: BadgeStyle.teal,
      };
    case UserBadges.TOP_STAKER_DAY:
      return {
        title: t(baseTranslation.topStakerDay),
        style: BadgeStyle.brown,
      };
    case UserBadges.TOP_STAKER_WEEK:
      return {
        title: t(baseTranslation.topStakerWeek),
        style: BadgeStyle.brown,
      };
  }
};
