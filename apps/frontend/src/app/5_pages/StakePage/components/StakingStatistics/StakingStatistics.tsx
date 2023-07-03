import React from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Heading, HelperButton, Link } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  APR,
  TOKEN_RENDER_PRECISION,
  VP,
} from '../../../../../constants/currencies';
import { MAX_STAKING_APR_LINK } from '../../../../../constants/links';
import { translations } from '../../../../../locales/i18n';
import { formatValue, fromWei } from '../../../../../utils/math';
import { StakingStatRender } from '../../StakePage.utils';
import { useGetStakingStatistics } from './hooks/useGetStakingStatistics';

export const StakingStatistics = () => {
  const { totalStakedSov, totalVotingPower } = useGetStakingStatistics();

  return (
    <div className="w-full bg-gray-80 md:bg-gray-90 py-7 px-6 rounded mb-6">
      <Heading
        children={t(translations.stakePage.statistics.title)}
        className="text-base sm:text-2xl font-medium mb-6"
      />

      <div className="flex justify-between flex-wrap gap-6 items-center">
        <StakingStatRender
          label={t(translations.stakePage.statistics.totalStakedSov)}
          value={
            <AmountRenderer
              value={fromWei(totalStakedSov)}
              suffix={SupportedTokens.sov}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
        <StakingStatRender
          label={t(translations.stakePage.statistics.totalVotingPower)}
          value={
            <AmountRenderer
              value={fromWei(totalVotingPower)}
              suffix={VP}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
        <StakingStatRender
          label={
            <span className="flex items-center gap-1">
              {t(translations.stakePage.statistics.maxStakingApr)}{' '}
              <HelperButton
                content={
                  <Trans
                    i18nKey={t(
                      translations.stakePage.statistics.maxStakingAprInfo,
                    )}
                    components={[
                      <Link
                        text={t(
                          translations.stakePage.statistics
                            .maxStakingAprInfoCta,
                        )}
                        href={MAX_STAKING_APR_LINK}
                        openNewTab
                      />,
                    ]}
                  />
                }
              />
            </span>
          }
          value={`${formatValue(0, 2)}% ${APR}`}
        />
      </div>
    </div>
  );
};
