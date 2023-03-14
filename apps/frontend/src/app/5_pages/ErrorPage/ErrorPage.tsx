import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useRouteError } from 'react-router-dom';

import { Footer, Header } from '../../3_organisms';
import { translations } from '../../../locales/i18n';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';

type ErrorRouteProps = Error & {
  statusText?: string;
  status?: number;
};

export const ErrorPage: FC = () => {
  const error = useRouteError() as ErrorRouteProps;

  return error?.status === 404 ? (
    <NotFoundPage />
  ) : (
    <>
      <Helmet>
        <title>{t(translations.errorPage.meta.title)}</title>
      </Helmet>
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
