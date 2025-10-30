import React, { FC } from 'react';

import { t } from 'i18next';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { LAUNCHPAD_LINKS } from '../../../../../constants/links';
import { translations } from '../../../../../locales/i18n';
import styles from './Banner.module.css';
import { LandingPromoCard } from './components/LandingPromoCard/LandingPromoCard';

export const Banner: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative pb-16">
      <Carousel
        arrows={false}
        draggable
        partialVisible={false}
        focusOnSelect={false}
        responsive={{
          large: {
            breakpoint: { max: 4800, min: 0 },
            items: 1,
            slidesToSlide: 1,
          },
        }}
        minimumTouchDrag={80}
        swipeable
        className="static"
        renderDotsOutside
        showDots
        autoPlay={false} // Needs to be true when we have more than 1 promo
        dotListClass={styles.dot}
        autoPlaySpeed={15000}
        infinite
      >
        <LandingPromoCard
          heading={t(translations.landingPage.promotions.originsLaunch.title)}
          description={t(
            translations.landingPage.promotions.originsLaunch.description,
          )}
          actions={
            <>
              <Button
                style={ButtonStyle.secondary}
                size={ButtonSize.large}
                text={t(translations.landingPage.promotions.originsLaunch.cta)}
                href={LAUNCHPAD_LINKS.ORIGINS_CLAIM}
                hrefExternal
              />
            </>
          }
          className="border-primary"
        />
        <LandingPromoCard
          heading={t(translations.landingPage.promotions.bosLaunch.title)}
          description={t(
            translations.landingPage.promotions.bosLaunch.description,
          )}
          actions={
            <>
              <Button
                style={ButtonStyle.secondary}
                size={ButtonSize.large}
                text={t(translations.landingPage.promotions.bosLaunch.cta)}
                onClick={() => navigate('/earn/staking')}
                hrefExternal
              />
            </>
          }
          className="border-primary"
        />
      </Carousel>
    </div>
  );
};
