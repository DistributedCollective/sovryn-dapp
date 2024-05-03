import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import styles from './Banner.module.css';
import { LandingPromoCard } from './components/LandingPromoCard/LandingPromoCard';

export const Banner: FC = () => {
  const navigate = useNavigate();
  const handleRunesClick = useCallback(() => {
    window.open(
      'https://sovryn.com/all-things-sovryn/bitcoin-runes-tokens',
      '_blank',
    );
  }, []);
  return (
    <div className="w-full relative pb-16">
      <Carousel
        arrows={false}
        draggable={true} // Needs to be true when we have more than 1 promo
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
        showDots={true} // Needs to be true when we have more than 1 promo
        autoPlay={true} // Needs to be true when we have more than 1 promo
        dotListClass={styles.dot}
        autoPlaySpeed={15000}
        infinite
      >
        <LandingPromoCard
          heading={t(
            translations.landingPage.promotions.sovrynIsLiveOnBob.title,
          )}
          description={t(
            translations.landingPage.promotions.sovrynIsLiveOnBob.description,
          )}
          actions={
            <>
              <Button
                style={ButtonStyle.secondary}
                size={ButtonSize.large}
                text={t(
                  translations.landingPage.promotions.sovrynIsLiveOnBob.cta,
                )}
                onClick={() => navigate('/earn/market-making')}
                hrefExternal
              />
            </>
          }
          className="border-primary"
        />
        <LandingPromoCard
          heading={t(translations.landingPage.promotions.runesBridge.title)}
          description={t(
            translations.landingPage.promotions.runesBridge.description,
          )}
          actions={
            <>
              <Button
                style={ButtonStyle.secondary}
                size={ButtonSize.large}
                text={t(translations.landingPage.promotions.runesBridge.cta)}
                onClick={handleRunesClick}
                hrefExternal
              />
            </>
          }
          className="border-sovryn-blue"
        />
      </Carousel>
    </div>
  );
};
