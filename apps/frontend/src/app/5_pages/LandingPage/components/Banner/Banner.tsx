import React, { FC } from 'react';

import { t } from 'i18next';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';

import { translations } from '../../../../../locales/i18n';
import styles from './Banner.module.css';
import { LandingPromoCard } from './components/LandingPromoCard/LandingPromoCard';

export const Banner: FC = () => {
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
        // showDots
        autoPlay={false} // Needs to be true when we have more than 1 promo
        dotListClass={styles.dot}
        autoPlaySpeed={15000}
        // infinite
      >
        <LandingPromoCard
          heading={t(
            translations.landingPage.promotions.zeroInterestLoans.title,
          )}
          description={t(
            translations.landingPage.promotions.zeroInterestLoans.description,
          )}
          actions={
            <>
              <Link
                to="/borrow/line-of-credit"
                className="inline-flex box-border items-center justify-center text-center border font-body font-semibold no-underline rounded cursor-pointer px-5 py-2  bg-gray-80 border-gray-50 text-gray-10 text-sm hover:bg-gray-50"
              >
                {t(translations.landingPage.promotions.zeroInterestLoans.cta)}
              </Link>
            </>
          }
          className="border-primary"
        />
      </Carousel>
    </div>
  );
};
