import React, { FC } from 'react';

import { t } from 'i18next';
import { useRouteError } from 'react-router-dom';

import { Footer, Header } from '../../3_organisms';
import { translations } from '../../../locales/i18n';

export const ErrorPage: FC = () => {
  const error = useRouteError() as Error & { statusText?: string };

  return (
    <>
      <Header />
      <div className="container flex flex-col flex-grow items-center justify-center">
        <h1>{t(translations.errorPage.title)}</h1>
        <p>{t(translations.errorPage.description)}</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre>{JSON.stringify(error, undefined, 2)}</pre>
        )}
      </div>
      <Footer />
    </>
  );
};
