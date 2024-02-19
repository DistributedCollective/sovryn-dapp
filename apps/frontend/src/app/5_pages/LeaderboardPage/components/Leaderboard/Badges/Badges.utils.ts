import { t } from 'i18next';

import { BadgeStyle } from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';
import { TradingBadges } from '../Leaderboard.types';

const baseTranslation = translations.leaderboardPage.tables.trading.badges;

export const getBadgeDetails = (badge: TradingBadges) => {
  switch (badge) {
    case TradingBadges.EARLY_USER:
      return {
        title: t(baseTranslation.earlyUser),
        style: BadgeStyle.teal,
      };
    case TradingBadges.GENESIS:
      return {
        title: t(baseTranslation.genesis),
        style: BadgeStyle.teal,
      };
    case TradingBadges.NFT:
      return {
        title: t(baseTranslation.nft),
        style: BadgeStyle.teal,
      };
    case TradingBadges.ORIGIN:
      return {
        title: t(baseTranslation.origin),
        style: BadgeStyle.teal,
      };
    case TradingBadges.TOP_IMPORTER_DAY:
      return {
        title: t(baseTranslation.topImporterDay),
        style: BadgeStyle.brown,
      };
    case TradingBadges.TOP_IMPORTER_WEEK:
      return {
        title: t(baseTranslation.topImporterWeek),
        style: BadgeStyle.brown,
      };
  }
};
