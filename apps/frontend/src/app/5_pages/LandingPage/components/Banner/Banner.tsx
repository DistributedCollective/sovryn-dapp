import React, { FC } from 'react';

import { t } from 'i18next';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { GOBOB_LINK } from '../../../../../constants/links';
import { translations } from '../../../../../locales/i18n';
import styles from './Banner.module.css';
import { LandingPromoCard } from './components/LandingPromoCard/LandingPromoCard';

export const Banner: FC = () => {
  return (
    <div className="w-full relative pb-7">
      <Carousel
        arrows={false}
        draggable={false} // Needs to be true when we have more than 1 promo
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
        showDots={false} // Needs to be true when we have more than 1 promo
        autoPlay={false} // Needs to be true when we have more than 1 promo
        dotListClass={styles.dot}
        autoPlaySpeed={15000}
        infinite
      >
        <LandingPromoCard
          heading={t(translations.landingPage.promotions.runesExtraSpice.title)}
          description={t(
            translations.landingPage.promotions.runesExtraSpice.description,
          )}
          actions={
            <>
              <Button
                style={ButtonStyle.secondary}
                size={ButtonSize.large}
                text={t(
                  translations.landingPage.promotions.runesExtraSpice.cta,
                )}
                href={GOBOB_LINK}
                hrefExternal
              />
            </>
          }
        />
      </Carousel>
    </div>
  );
};
