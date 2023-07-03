import React, { useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Heading, Tooltip, TooltipTrigger } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  TOKEN_RENDER_PRECISION,
  VP,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { decimalic, fromWei } from '../../../../../utils/math';
import { StakingStatRender } from '../../StakePage.utils';
import { useGetStakingStatistics } from '../StakingStatistics/hooks/useGetStakingStatistics';
import { useGetPersonalStakingStatistics } from './hooks/useGetPersonalStakingStatistics';

export const PersonalStakingStatistics = () => {
  const { stakedSov, votingPower } = useGetPersonalStakingStatistics();
  const { totalVotingPower } = useGetStakingStatistics();
  const [votingPowerShare, setVotingPowerShare] = useState(0);

  const updateVotingPowerShare = useCallback(() => {
    const vp = decimalic(votingPower.toString());
    const totalVp = decimalic(totalVotingPower.toString());
    const share = vp.div(totalVp).mul(100);
    setVotingPowerShare(share.toNumber());
  }, [votingPower, totalVotingPower]);

  useEffect(() => {
    if (votingPower && totalVotingPower) {
      updateVotingPowerShare();
    }
  }, [updateVotingPowerShare, votingPower, totalVotingPower]);

  return (
    <div className="w-full bg-gray-80 md:bg-gray-90 py-7 px-6 rounded mb-6">
      <Heading
        children={t(translations.stakePage.personalStatistics.title)}
        className="text-base sm:text-2xl font-medium mb-6"
      />

      <div className="flex justify-between flex-wrap gap-6 items-center">
        <StakingStatRender
          label={t(translations.stakePage.personalStatistics.stakedSov)}
          value={
            <AmountRenderer
              value={fromWei(stakedSov)}
              suffix={SupportedTokens.sov}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
        <StakingStatRender
          label={t(translations.stakePage.personalStatistics.votingPower)}
          value={
            <Tooltip
              content={
                <div className="flex flex-col">
                  <div className="flex flex-nowrap">
                    {t(
                      translations.stakePage.personalStatistics.votingPowerInfo
                        .line1,
                    )}
                    : {fromWei(votingPower)} {VP}
                  </div>
                  <div>
                    {t(
                      translations.stakePage.personalStatistics.votingPowerInfo
                        .line2,
                    )}
                    : {fromWei(0)} {VP}
                  </div>
                  <div>
                    {t(
                      translations.stakePage.personalStatistics.votingPowerInfo
                        .line3,
                    )}
                    : {fromWei(votingPower)} {VP}
                  </div>
                </div>
              }
              trigger={TooltipTrigger.click}
              tooltipClassName="max-w-96"
            >
              <div>
                <AmountRenderer
                  value={fromWei(votingPower)}
                  suffix={VP}
                  precision={TOKEN_RENDER_PRECISION}
                  useTooltip={false}
                />
              </div>
            </Tooltip>
          }
        />
        <StakingStatRender
          label={t(translations.stakePage.personalStatistics.votingPowerShare)}
          value={
            <AmountRenderer value={votingPowerShare} suffix="%" precision={2} />
          }
        />
      </div>
    </div>
  );
};
