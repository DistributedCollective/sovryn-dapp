import React, { FC } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { Paragraph, ParagraphSize, Table } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { useCacheCall } from '../../../../../hooks';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { bobGateway } from '../../BobGateway.constants';
import { COLUMNS_CONFIG } from './BobGatewayOrders.constants';

export const BobGatewayOrders: FC = () => {
  const { account } = useAccount();

  const { value: orders, loading } = useCacheCall(
    `bob-orders/${account}`,
    BOB_CHAIN_ID,
    async () => {
      if (!account) {
        return [];
      }
      const result = await bobGateway.getOrders(account);
      return result.sort((a, b) => (b.timestamp < a.timestamp ? -1 : 1));
    },
    [account],
    [],
  );

  return (
    <div className="bg-gray-80 py-4 px-4 rounded mt-6">
      <Table
        columns={COLUMNS_CONFIG}
        rows={orders}
        isLoading={loading}
        className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        rowTitle={row => (
          <Paragraph size={ParagraphSize.small} className="text-left">
            {formatUnits(row.tokens, 8)} {row.baseToken.symbol}
            {' - '}
            {dateFormat(row.timestamp)}
          </Paragraph>
        )}
      />
    </div>
  );
};
