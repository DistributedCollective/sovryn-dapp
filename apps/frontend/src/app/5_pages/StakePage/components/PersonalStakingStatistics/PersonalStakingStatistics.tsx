import React, { useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Heading, HelperButton } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  TOKEN_RENDER_PRECISION,
  VP,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { decimalic, fromWei } from '../../../../../utils/math';
import { PersonalStatRender } from '../../StakePage.utils';
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
    <div className="w-full bg-gray-90 md:bg-gray-90 md:py-6 p-4 md:px-6 rounded mb-6">
      <Heading
        children={t(translations.stakePage.personalStatistics.title)}
        className="text-base md:text-2xl font-medium mb-6"
      />

      <div className="flex flex-wrap lg:gap-16 gap-6 items-center">
        <div className="w-full md:w-auto">
          <PersonalStatRender
            label={t(translations.stakePage.personalStatistics.stakedSov)}
            value={
              <AmountRenderer
                value={fromWei(stakedSov)}
                suffix={SupportedTokens.sov}
                precision={TOKEN_RENDER_PRECISION}
              />
            }
            className="text-[2rem]"
          />
        </div>
        <PersonalStatRender
          label={
            <span className="flex items-center gap-1">
              {t(translations.stakePage.personalStatistics.votingPower)}{' '}
              <HelperButton
                tooltipClassName="max-w-56 md:max-w-96"
                content={
                  <div className="flex flex-col">
                    <div>
                      {t(
                        translations.stakePage.personalStatistics
                          .votingPowerInfo.line1,
                      )}
                      :{' '}
                      <b>
                        {fromWei(votingPower)} {VP}
                      </b>
                    </div>
                    <div>
                      {t(
                        translations.stakePage.personalStatistics
                          .votingPowerInfo.line2,
                      )}
                      :{' '}
                      <b>
                        {fromWei(0)} {VP}
                      </b>
                    </div>
                    <div>
                      {t(
                        translations.stakePage.personalStatistics
                          .votingPowerInfo.line3,
                      )}
                      :{' '}
                      <b>
                        {fromWei(votingPower)} {VP}
                      </b>
                    </div>
                  </div>
                }
              />
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
        <PersonalStatRender
          label={t(translations.stakePage.personalStatistics.votingPowerShare)}
          value={
            <AmountRenderer value={votingPowerShare} suffix="%" precision={2} />
          }
        />
      </div>
    </div>
  );
};
