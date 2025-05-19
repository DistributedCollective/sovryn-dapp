import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { WagmiExample } from '../../2_molecules/WagmiExample/WagmiExample';
import { translations } from '../../../locales/i18n';

const pageTranslations = translations.landingPage;

const queryClient = new QueryClient();

const LandingPage: FC = () => {
  // const gettingStartedRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
        <meta
          name="description"
          content={t(pageTranslations.meta.description)}
        />
      </Helmet>

      <div className="container max-w-screen-xl mx-auto mt-10 mb-20">
        <QueryClientProvider client={queryClient}>
          <WagmiExample />
        </QueryClientProvider>

        {/* <div className="flex flex-col lg:flex-row mb-10 gap-4 items-start">
          <div className="flex-1 min-h-40">
            <TitleSection ctaRef={gettingStartedRef} />
            <ProtocolData />
          </div>

          <div className="min-h-40 w-full lg:max-w-[26.5rem] flex justify-end">
            <Banner />
          </div>
        </div>

        <QuickLaunch />

        <div
          className="grid xl:grid-cols-2 pt-3 mb-10 sm:mx-6"
          ref={gettingStartedRef}
        >
          <GetStarted />
          <FaqSection />
        </div> */}
      </div>
    </>
  );
};

export default LandingPage;
