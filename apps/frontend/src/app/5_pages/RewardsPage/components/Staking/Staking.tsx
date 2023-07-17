import React, { FC, useMemo } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph, Table } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BTC_RENDER_PRECISION } from '../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { useGetFeesEarned } from '../../hooks/useGetFeesEarned';
import { useGetLiquidSovClaimAmount } from '../../hooks/useGetLiquidSovClaimAmount';
import { columns } from './Staking.constants';
import { WithdrawFee } from './components/WithdrawFee/WithdrawFee';
import { WithdrawLiquidFee } from './components/WithdrawLiquidFee/WithdrawLiquidFee';

export const Staking: FC = () => {
  const { account } = useAccount();
  const { loading, earnedFees, refetch } = useGetFeesEarned();

  const {
    amount: liquidSovClaimAmount,
    lastWithdrawalInterval,
    refetch: refetchLiquidSovClaim,
  } = useGetLiquidSovClaimAmount();

  const rows = useMemo(() => {
    if (!account || loading) {
      return [];
    }

    return [
      ...earnedFees.map(earnedFee => ({
        type: t(translations.rewardPage.staking.stakingRevenue),
        amount: (
          <AmountRenderer
            value={formatUnits(earnedFee.value, 18)}
            suffix={getTokenDisplayName(earnedFee.token)}
            precision={BTC_RENDER_PRECISION}
            dataAttribute={`${earnedFee.token}-rewards-amount`}
          />
        ),
        action: <WithdrawFee {...earnedFee} refetch={refetch} />,
        token: earnedFee.token,
        key: `${earnedFee.token}-fee`,
      })),
      {
        type: t(translations.rewardPage.staking.stakingSubsidies),
        amount: (
          <AmountRenderer
            value={formatUnits(liquidSovClaimAmount, 18)}
            suffix={getTokenDisplayName(SupportedTokens.sov)}
            precision={BTC_RENDER_PRECISION}
            dataAttribute={`${SupportedTokens.sov}-liquid-amount`}
          />
        ),
        action: (
          <WithdrawLiquidFee
            amountToClaim={liquidSovClaimAmount}
            lastWithdrawalInterval={lastWithdrawalInterval}
            refetch={refetchLiquidSovClaim}
          />
        ),
        token: SupportedTokens.sov,
        key: `${SupportedTokens.sov}-liquid-fee`,
      },
    ];
  }, [
    account,
    earnedFees,
    lastWithdrawalInterval,
    liquidSovClaimAmount,
    loading,
    refetch,
    refetchLiquidSovClaim,
  ]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="lg:bg-gray-80 lg:py-4 lg:px-4 rounded w-full">
        <Table
          columns={columns}
          rows={rows}
          isLoading={!!account ? loading : false}
          rowKey={row => row.key}
          noData={
            !!account
              ? t(translations.rewardPage.stabilityPool.noRewards)
              : t(translations.rewardPage.stabilityPool.notConnected)
          }
          rowTitle={row => (
            <div className="flex flex-col items-start gap-1">
              <Paragraph className="text-gray-40">
                {`${row.type}-${getTokenDisplayName(row.token)}`}
              </Paragraph>
              {row.amount}
            </div>
          )}
          mobileRenderer={row => row.action}
        />
      </div>
    </div>
  );
};
