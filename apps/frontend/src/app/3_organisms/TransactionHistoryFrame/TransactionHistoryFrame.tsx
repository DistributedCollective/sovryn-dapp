import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import React, { FC, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Heading, HeadingType, Tabs } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { graphZeroUrl } from '../../../utils/constants';
import { GetTransactionHistoryDocument } from '../../../utils/graphql/zero/generated';

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const TransactionHistoryFrame: FC = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const { loading, error, data } = useQuery(GetTransactionHistoryDocument, {
    variables: {
      //TODO: switch to the user's address
      //hardcoded address for testing
      user: '0x008fa28d27e7164eff3d92d7d577854b79f4396f',
    },
    client: zeroClient,
  });

  console.log(data, loading, error);

  const trove = useMemo(() => {
    if (!data) {
      return null;
    }
    return data.trove?.changes;
  }, [data]);

  const items = [
    {
      label: t(translations.transactionHistory.tabs.lineOfCredit),
      content: (
        <div>
          {trove?.map((item, index) => (
            <div key={index}>
              <div>{item.transaction.timestamp}</div>
              <div>{item.transaction.id}</div>
            </div>
          ))}
        </div>
      ),
      activeClassName: 'border-t-primary-30',
      dataLayoutId: 'lineOfCredit',
    },
    {
      label: t(translations.transactionHistory.tabs.stabilityPool),
      content: <div>Stability Pool</div>,
      activeClassName: 'border-t-primary-30',
      dataLayoutId: 'stabilityPool',
    },
    {
      label: t(translations.transactionHistory.tabs.liquidation),
      content: <div>Liquidation</div>,
      activeClassName: 'border-t-primary-30',
      dataLayoutId: 'liquidation',
    },
    {
      label: t(translations.transactionHistory.tabs.redemption),
      content: <div>Redemption</div>,
      activeClassName: 'border-t-primary-30',
      dataLayoutId: 'redemption',
    },
    {
      label: t(translations.transactionHistory.tabs.conversion),
      content: <div>Conversion</div>,
      activeClassName: 'border-t-primary-30',
      dataLayoutId: 'conversion',
    },
    {
      label: t(translations.transactionHistory.tabs.fastBTC),
      content: <div>FastBTC</div>,
      activeClassName: 'border-t-primary-30',
      dataLayoutId: 'fastBTC',
    },
  ];

  return (
    <>
      <Heading type={HeadingType.h3}>
        {t(translations.transactionHistory.title)}
      </Heading>
      <Tabs
        contentClassName="w-full py-4 px-6 border-t border-t-gray-50 -mt-[0.063rem] rounded-tr"
        className="flex items-start mt-7"
        items={items}
        onChange={setIndex}
        index={index}
      />
    </>
  );
};
