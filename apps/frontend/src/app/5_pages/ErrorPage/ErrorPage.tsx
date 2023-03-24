import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useRouteError } from 'react-router-dom';

import { ErrorRenderer } from '../../1_atoms/ErrorRenderer/ErrorRenderer';
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
      <ErrorRenderer
        error={
          <>
            <p className="w-full p-3">
              <i>{error.statusText || error.message}</i>
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre>{JSON.stringify(error, undefined, 2)}</pre>
            )}
          </>
        }
      />
      <Footer />
    </>
  );
};
