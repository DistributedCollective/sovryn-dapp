import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { BorrowAssetsTable } from './components/BorrowAssetsTable/BorrowAssetsTable';
import { OpenLoansTable } from './components/OpenLoansTable/OpenLoansTable';
import { useGetOpenLoans } from './components/OpenLoansTable/hooks/useGetOpenLoans';

const BorrowPage: FC = () => {
  const { account } = useAccount();
  const { data: loans, loading } = useGetOpenLoans();

  const hasOpenLoans = useMemo(
    () => loans?.length > 0 && account,
    [loans, account],
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.fixedInterestPage.meta.title)}</title>
      </Helmet>

      <div className="px-0 container md:mx-9 mx-0 md:mb-2 mb-7">
        <NetworkBanner requiredChainId={RSK_CHAIN_ID}>
          <Heading className="text-center mb-3 lg:text-2xl">
            {t(translations.fixedInterestPage.title)}
          </Heading>

          <Paragraph
            className="text-center mb-6 lg:mb-10"
            size={ParagraphSize.base}
          >
            {t(translations.fixedInterestPage.subtitle)}
          </Paragraph>

          <div className="w-full">
            {hasOpenLoans && <OpenLoansTable loans={loans} loading={loading} />}
            <BorrowAssetsTable />
          </div>
        </NetworkBanner>
      </div>
    </>
  );
};
export default BorrowPage;
