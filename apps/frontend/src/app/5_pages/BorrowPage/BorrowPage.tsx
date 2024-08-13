import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { BOB_CHAIN_ID, RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkSwitch } from '../../2_molecules/NetworkSwitch/NetworkSwitch';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import AavePage from '../AavePage/AavePage';
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
        <NetworkSwitch
          components={{
            [RSK_CHAIN_ID]: (
              <>
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
                  {hasOpenLoans && (
                    <OpenLoansTable loans={loans} loading={loading} />
                  )}
                  <BorrowAssetsTable />
                </div>
              </>
            ),
            [BOB_CHAIN_ID]: <AavePage />,
          }}
        />
      </div>
    </>
  );
};
export default BorrowPage;
