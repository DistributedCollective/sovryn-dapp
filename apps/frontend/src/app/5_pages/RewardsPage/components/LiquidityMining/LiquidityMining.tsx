import React, { FC, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { Paragraph, Table } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { useRequiredChain } from '../../../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../utils/asset';
import { columns } from './LiquidityMining.constants';
import { LiquidityMiningAction } from './components/LiquidityMiningAction/LiquidityMiningAction';
import { LiquidityMiningMobile } from './components/LiquidityMiningMobile/LiquidityMiningMobile';
import { useGetLendingRewards } from './hooks/useGetLendingRewards';
import { useGetLiquidityRewards } from './hooks/useGetLiquidityRewards';
import { useGetTradingRewards } from './hooks/useGetTradingRewards';
import { useHandleRewards } from './hooks/useHandleRewards';

const pageTranslations = translations.rewardPage.liquidityMining;

export const LiquidityMining: FC = () => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();
  const { invalidChain } = useRequiredChain();
  const { vestedRewards, liquidRewards, loading } =
    useGetLiquidityRewards(account);
  const {
    availableTradingRewards,
    loading: tradingRewardsLoading,
    refetch,
  } = useGetTradingRewards(account);

  const { lendingRewards, loading: lendingRewardsLoading } =
    useGetLendingRewards(account);

  const isLoading = useMemo(
    () => loading || tradingRewardsLoading || lendingRewardsLoading,
    [loading, tradingRewardsLoading, lendingRewardsLoading],
  );

  const claimDisabled = useMemo(() => {
    return (
      (liquidRewards.isZero() &&
        vestedRewards.isZero() &&
        lendingRewards.isZero() &&
        availableTradingRewards === '0') ||
      invalidChain ||
      isLoading
    );
  }, [
    liquidRewards,
    vestedRewards,
    lendingRewards,
    availableTradingRewards,
    invalidChain,
    isLoading,
  ]);

  const handleRewards = useHandleRewards();

  const sovSuffix = useMemo(
    () => findAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol,
    [],
  );

  const rows = useMemo(() => {
    if (claimDisabled) {
      return [];
    }

    return [
      {
        type: (
          <div className="mb-2 pt-3 grid grid-cols-1 gap-2 leading-5">
            <div>
              {liquidRewards && (
                <Paragraph
                  dataAttribute="liquidity-mining-amm-lp-rewards-liquid-type"
                  children={t(pageTranslations.types.ammLPrewardsLiquid)}
                />
              )}
              {vestedRewards && (
                <Paragraph
                  dataAttribute="liquidity-mining-amm-lp-rewards-vested-type"
                  children={t(pageTranslations.types.ammLPrewardsVested)}
                />
              )}
            </div>
            {lendingRewards && (
              <Paragraph
                dataAttribute="liquidity-mining-lending-rewards-vested-type"
                children={t(pageTranslations.types.lendingRewardsVested)}
              />
            )}
            {availableTradingRewards && (
              <Paragraph
                dataAttribute="liquidity-mining-trading-fee-rebate-vested-type"
                children={t(pageTranslations.types.tradingFeeRebateVested)}
              />
            )}
          </div>
        ),
        amount: (
          <div className="mb-2 pt-3 grid grid-cols-1 gap-2">
            <div className="grid grid-cols-1">
              {liquidRewards && (
                <AmountRenderer
                  value={liquidRewards}
                  suffix={sovSuffix}
                  precision={TOKEN_RENDER_PRECISION}
                  dataAttribute="liquidity-mining-amm-lp-rewards-liquid-amount"
                />
              )}
              {vestedRewards && (
                <AmountRenderer
                  value={vestedRewards}
                  suffix={sovSuffix}
                  precision={TOKEN_RENDER_PRECISION}
                  dataAttribute="liquidity-mining-amm-lp-rewards-vested-amount"
                />
              )}
            </div>
            {lendingRewards && (
              <AmountRenderer
                value={lendingRewards}
                suffix={sovSuffix}
                precision={TOKEN_RENDER_PRECISION}
                dataAttribute="liquidity-mining-lending-rewards-vested-amount"
              />
            )}
            {availableTradingRewards && (
              <AmountRenderer
                value={availableTradingRewards}
                suffix={sovSuffix}
                precision={TOKEN_RENDER_PRECISION}
                dataAttribute="liquidity-mining-trading-fee-rebate-vested-amount"
              />
            )}
          </div>
        ),
        pool: (
          <div className="mb-2 pt-3 grid grid-cols-1 gap-2 leading-5">
            {(liquidRewards || vestedRewards) && (
              <div className="flex items-center min-h-8">
                <Paragraph
                  dataAttribute="liquidity-mining-amm-lp-rewards-pool"
                  children="—"
                />
              </div>
            )}
            {lendingRewards && (
              <Paragraph
                dataAttribute="liquidity-mining-lending-rewards-vested-pool"
                children={`${
                  findAsset(COMMON_SYMBOLS.DLLR, RSK_CHAIN_ID).symbol
                }, ${BITCOIN.toLocaleUpperCase()}`}
              />
            )}
            {availableTradingRewards && (
              <Paragraph
                dataAttribute="liquidity-mining-trading-fee-rebate-vested-pool"
                children={BITCOIN.toLocaleUpperCase()}
              />
            )}
          </div>
        ),
        action: (
          <LiquidityMiningAction
            className="flex justify-end w-full md:w-auto h-full pt-3"
            claimDisabled={claimDisabled}
            onClick={handleRewards}
            dataAttribute="liquidity-mining-rewards-claim-all"
          />
        ),
        key: 'liquidity-mining-rewards',
      },
    ];
  }, [
    claimDisabled,
    liquidRewards,
    vestedRewards,
    lendingRewards,
    availableTradingRewards,
    sovSuffix,
    handleRewards,
  ]);

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  return (
    <div className="flex flex-col items-center w-full gap-y-8">
      <div className="lg:bg-gray-80 lg:py-4 lg:px-4 rounded w-full">
        <Table
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          rowKey={row => row.key}
          dataAttribute="liquidity-mining-rewards-table"
          noData={
            <span className="italic">
              {!!account
                ? t(pageTranslations.noRewards)
                : t(pageTranslations.notConnected)}
            </span>
          }
          className="hidden md:table"
        />
        <LiquidityMiningMobile
          className="block md:hidden bg-gray-80 rounded w-full"
          liquidRewards={liquidRewards}
          vestedRewards={vestedRewards}
          lendingRewards={lendingRewards}
          availableTradingRewards={availableTradingRewards}
          claimDisabled={claimDisabled}
        />
      </div>
    </div>
  );
};
