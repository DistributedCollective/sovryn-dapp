import React, {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { CTA } from '../../../../2_molecules/CTA/CTA';
import socialBg from '../../../../../assets/images/Leaderboard/social.svg';
import stakeBg from '../../../../../assets/images/Leaderboard/stake.svg';
import tradeBg from '../../../../../assets/images/Leaderboard/trade.svg';
import { translations } from '../../../../../locales/i18n';
import { scrollToElement } from '../../../../../utils/helpers';

const baseTranslation = translations.leaderboardPage.ctaLinksSection;

type CTALinksProps = {
  tableRef: RefObject<HTMLDivElement>;
  setTabIndex: Dispatch<SetStateAction<number>>;
};

export const CTALinks: FC<CTALinksProps> = ({ tableRef, setTabIndex }) => {
  const navigate = useNavigate();

  const socialClickHandler = useCallback(() => {
    if (tableRef.current) {
      scrollToElement(tableRef);
      setTabIndex(2);
    }
  }, [setTabIndex, tableRef]);

  const options = useMemo(
    () => [
      {
        title: t(baseTranslation.stake.title),
        description: t(baseTranslation.stake.description),
        action: t(baseTranslation.stake.cta),
        onClick: () => navigate('/earn/staking'),
        backgroundImage: stakeBg,
      },
      {
        title: t(baseTranslation.trade.title),
        description: t(baseTranslation.trade.description),
        action: t(baseTranslation.trade.cta),
        onClick: () =>
          window.open('https://app.babelfish.money/convert', '_blank'),
        backgroundImage: tradeBg,
      },
      {
        title: t(baseTranslation.social.title),
        description: t(baseTranslation.social.description),
        action: t(baseTranslation.social.cta),
        onClick: socialClickHandler,
        backgroundImage: socialBg,
      },
    ],
    [navigate, socialClickHandler],
  );

  return (
    <div className="w-full sm:p-6 p-4 sm:w-3/4 mt-8 bg-gray-80 rounded min-h-64 grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-4">
      {options.map(
        ({ backgroundImage, title, description, action, onClick }, index) => (
          <CTA
            index={index}
            backgroundImage={backgroundImage}
            title={title}
            description={description}
            action={action}
            navigateTo={onClick}
          />
        ),
      )}
    </div>
  );
};
