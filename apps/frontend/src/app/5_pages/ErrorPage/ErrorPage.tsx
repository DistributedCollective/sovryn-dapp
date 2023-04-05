import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useRouteError } from 'react-router-dom';

import { Paragraph } from '@sovryn/ui';

import { ErrorRenderer } from '../../1_atoms/ErrorRenderer/ErrorRenderer';
import { Footer, Header } from '../../3_organisms';
import { translations } from '../../../locales/i18n';
import { isDevEnvironment } from '../../../utils/helpers';
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
            <Paragraph className="w-full p-3">
              <i>{error.statusText || error.message}</i>
            </Paragraph>
            {isDevEnvironment() && (
              <pre>{JSON.stringify(error, undefined, 2)}</pre>
            )}
          </>
        }
      />
      <Footer />
    </>
  );
};
