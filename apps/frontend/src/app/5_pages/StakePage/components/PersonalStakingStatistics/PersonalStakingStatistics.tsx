import React, { useMemo } from 'react';

import { t } from 'i18next';

import { Heading } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { useAccount } from '../../../../../hooks/useAccount';
import { useGetVotingPowerShare } from '../../../../../hooks/useGetVotingPowerShare';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../utils/asset';
import { fromWei } from '../../../../../utils/math';
import { VP } from '../../StakePage.constants';
import { PersonalStatistics } from '../../StakePage.utils';
import { useGetStakingBalanceOf } from '../../hooks/useGetStakingBalanceOf';
import { useGetTotalVestingsBalance } from '../../hooks/useGetTotalVestingsBalance';
import { useGetPersonalStakingStatistics } from './hooks/useGetPersonalStakingStatistics';

export const PersonalStakingStatistics = () => {
  const { account } = useAccount();
  const { votingPower } = useGetPersonalStakingStatistics();
  const { balance: stakedValue } = useGetStakingBalanceOf(account);

  const votingPowerShare = useGetVotingPowerShare();

  const totalVestingsBalance = useGetTotalVestingsBalance();

  const totalStakedValue = useMemo(
    () => Decimal.fromBigNumberString(stakedValue).add(totalVestingsBalance),
    [stakedValue, totalVestingsBalance],
  );

  return (
    <div className="w-full bg-gray-90 md:bg-gray-90 md:py-6 p-4 md:px-6 rounded mb-6">
      <Heading
        children={t(translations.stakePage.personalStatistics.title)}
        className="text-base md:text-2xl font-medium mb-6"
      />

      <div className="flex flex-wrap lg:gap-16 gap-6 items-center">
        <div className="w-full md:w-auto">
          <PersonalStatistics
            label={t(translations.stakePage.personalStatistics.stakedSov)}
            value={
              <AmountRenderer
                value={totalStakedValue}
                suffix={findAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
                precision={TOKEN_RENDER_PRECISION}
              />
            }
            className="text-[2rem]"
          />
        </div>
        <PersonalStatistics
          label={
            <span className="flex items-center gap-1">
              {t(translations.stakePage.personalStatistics.votingPower)}
            </span>
          }
          value={
            <AmountRenderer
              value={fromWei(votingPower)}
              suffix={VP}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
        <PersonalStatistics
          label={t(translations.stakePage.personalStatistics.votingPowerShare)}
          value={
            <AmountRenderer value={votingPowerShare} suffix="%" precision={5} />
          }
        />
      </div>
    </div>
  );
};
