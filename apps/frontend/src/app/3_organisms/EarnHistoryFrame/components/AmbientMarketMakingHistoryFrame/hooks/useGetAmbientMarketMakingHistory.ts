import { useCallback, useMemo } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { getAssetDataByAddress } from '@sovryn/contracts';
import { NotificationType, OrderOptions } from '@sovryn/ui';

import { EXPORT_RECORD_LIMIT } from '../../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../locales/i18n';
import { isBobChain } from '../../../../../../utils/chain';
import { bobClient, sepoliaSdexClient } from '../../../../../../utils/clients';
import {
  LiquidityChange,
  LiquidityChange_OrderBy,
  useGetLiquidityChangesLazyQuery,
  useGetLiquidityChangesQuery,
} from '../../../../../../utils/graphql/bob/generated';
import { dateFormat } from '../../../../../../utils/helpers';
import { decimalic } from '../../../../../../utils/math';
import { getTransactionType } from '../AmbientMarketMakingHistoryFrame.utils';

export const useGetAmbientMarketMakingHistory = (
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const config = useMemo(
    () => ({
      user: account,
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as LiquidityChange_OrderBy,
      orderDirection: orderOptions.orderDirection,
    }),
    [
      account,
      orderOptions.orderBy,
      orderOptions.orderDirection,
      page,
      pageSize,
    ],
  );

  const { data, loading, refetch } = useGetLiquidityChangesQuery({
    variables: config,
    // todo: we shouldn't use sepolia client in the end
    client: isBobChain(chainId) ? bobClient : sepoliaSdexClient,
  });

  const [getLiquidityChanges] = useGetLiquidityChangesLazyQuery({
    client: isBobChain(chainId) ? bobClient : sepoliaSdexClient,
  });

  const exportData = useCallback(async () => {
    const { data } = await getLiquidityChanges({
      variables: {
        ...config,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });
    const list = (data?.liquidityChanges || []) as LiquidityChange[];

    if (list.length < 1) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return await Promise.all(
      list.map(async liquidityChange => {
        const baseToken = await getAssetDataByAddress(
          liquidityChange?.pool.base,
          chainId,
        );
        const quoteToken = await getAssetDataByAddress(
          liquidityChange?.pool.quote,
          chainId,
        );

        return {
          timestamp: dateFormat(Number(liquidityChange.time)),
          transactionType: getTransactionType(liquidityChange),
          'Base Token': getTokenDisplayName(baseToken.symbol || ''),
          'Base Balance': `${formatUnits(
            (liquidityChange.changeType === 'mint'
              ? decimalic(liquidityChange.baseFlow)
              : decimalic(liquidityChange.baseFlow).mul(-1)
            ).toString(),
            baseToken?.decimals,
          ).toString()}`,
          'Quote Token': getTokenDisplayName(quoteToken.symbol || ''),
          'Quote Balance': `${formatUnits(
            (liquidityChange.changeType === 'mint'
              ? decimalic(liquidityChange.quoteFlow)
              : decimalic(liquidityChange.quoteFlow).mul(-1)
            ).toString(),
            quoteToken?.decimals,
          ).toString()}`,
          transactionId: liquidityChange.transactionHash,
        };
      }),
    );
  }, [addNotification, chainId, config, getLiquidityChanges]);

  return {
    data,
    loading,
    refetch,
    exportData,
  };
};
