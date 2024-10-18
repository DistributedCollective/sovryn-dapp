import {
  ReserveDataHumanized,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { formatReserves, FormatReserveUSDResponse } from '@aave/math-utils';

import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../config/chains';

import { AAVE_CONTRACT_ADDRESSES } from '../../constants/aave';
import { ETH, WETH } from '../../constants/currencies';

export type Reserve = ReserveDataHumanized & FormatReserveUSDResponse;
export type ReserveData = { reserves: Reserve[]; loading: boolean };

const uiPoolDataProvider = new UiPoolDataProvider({
  provider: getProvider(BOB_CHAIN_ID),
  uiPoolDataProviderAddress: AAVE_CONTRACT_ADDRESSES.UI_POOL_DATA_PROVIDER,
  chainId: Number(BOB_CHAIN_ID),
});

export const useAaveReservesData = (): ReserveData => {
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReservesData = useCallback(async () => {
    const currentTimestamp = dayjs().unix();
    const reservesData = await uiPoolDataProvider.getReservesHumanized({
      lendingPoolAddressProvider:
        AAVE_CONTRACT_ADDRESSES.POOL_ADDRESSES_PROVIDER,
    });
    const formattedReserves = formatReserves({
      reserves: reservesData.reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals:
        reservesData.baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        reservesData.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    setReserves(
      // rename weth to eth. We don't expose WETH through ui.
      formattedReserves.map(r =>
        r.symbol === WETH ? { ...r, symbol: ETH } : r,
      ),
    );
  }, [setReserves]);

  useEffect(() => {
    setLoading(true);
    fetchReservesData().finally(() => setLoading(false));
  }, [fetchReservesData]);

  return { reserves, loading };
};
