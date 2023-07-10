import React, { FC, useMemo } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Table } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BTC_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { useGetFeesEarned } from '../../hooks/useGetFeesEarned';
import { useGetLiquidSovClaimAmount } from '../../hooks/useGetLiquidSovClaimAmount';
import { WithdrawFee } from './components/WithdrawFee/WithdrawFee';
import { WithdrawLiquidFee } from './components/WithdrawLiquidFee/WithdrawLiquidFee';
import { columns } from './constants';

export const Staking: FC = () => {
  const { loading, earnedFees, refetch } = useGetFeesEarned();

  const {
    amount: liquidSovClaimAmount,
    lastWithdrawalInterval,
    refetch: refetchLiquidSovClaim,
  } = useGetLiquidSovClaimAmount();

  const rows = useMemo(() => {
    return [
      ...earnedFees.map(earnedFee => ({
        type: t(translations.rewardPage.stabilityPool.stakingRevenue),
        amount: (
          <AmountRenderer
            value={formatUnits(earnedFee.value, 18)}
            suffix={earnedFee.token}
            precision={BTC_RENDER_PRECISION}
            dataAttribute={`${earnedFee.token}-rewards-amount`}
          />
        ),
        action: <WithdrawFee {...earnedFee} refetch={refetch} />,
        key: `${earnedFee.token}-fee`,
      })),
      {
        type: t(translations.rewardPage.stabilityPool.stabilitySubsidies),
        amount: (
          <AmountRenderer
            value={formatUnits(liquidSovClaimAmount, 18)}
            suffix={SupportedTokens.sov}
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
        key: `${SupportedTokens.sov}-liquid-fee`,
      },
    ];
  }, [
    earnedFees,
    lastWithdrawalInterval,
    liquidSovClaimAmount,
    refetch,
    refetchLiquidSovClaim,
  ]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-gray-80 py-4 px-4 rounded w-full">
        <Table
          columns={columns}
          rows={rows}
          isLoading={loading}
          rowKey={row => row.key}
          noData={t(translations.rewardPage.stabilityPool.noRewards)}
          rowTitle={row => row.type}
        />
      </div>
    </div>
  );
};
