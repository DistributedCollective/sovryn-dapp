import React, { useMemo } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  HelperButton,
  Link,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { fromWei } from '../../../../../utils/math';
import { APR, MAX_STAKING_APR_LINK, VP } from '../../StakePage.constants';
import { GlobalStatistics } from '../../StakePage.utils';
import { useGetStakingStatistics } from './hooks/useGetStakingStatistics';

export const StakingStatistics = () => {
  const { totalStakedSov, totalVotingPower, maxStakingApr } =
    useGetStakingStatistics();

  const renderMaxStakingApr = useMemo(
    () =>
      maxStakingApr ? (
        <AmountRenderer
          value={maxStakingApr}
          suffix={` % ${APR}`}
          precision={1}
        />
      ) : (
        '-'
      ),
    [maxStakingApr],
  );

  return (
    <div className="w-full md:py-7 md:px-6">
      <Paragraph
        style={ParagraphStyle.normal}
        size={ParagraphSize.base}
        className="font-medium md:mb-6 mb-4"
      >
        {t(translations.stakePage.statistics.title)}
      </Paragraph>

      <div className="flex md:flex-row flex-col md:justify-between flex-wrap md:gap-6 gap-1 md:items-center">
        <GlobalStatistics
          label={t(translations.stakePage.statistics.totalStakedSov)}
          value={
            <AmountRenderer
              value={fromWei(totalStakedSov)}
              suffix={SupportedTokens.sov}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
        <GlobalStatistics
          label={t(translations.stakePage.statistics.totalVotingPower)}
          value={
            <AmountRenderer
              value={fromWei(totalVotingPower)}
              suffix={VP}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
        <GlobalStatistics
          label={
            <span className="flex items-center gap-1">
              {t(translations.stakePage.statistics.maxStakingApr)}{' '}
              <HelperButton
                tooltipClassName="max-w-56 md:max-72"
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
                        className="mt-4 inline-block"
                        openNewTab
                      />,
                    ]}
                  />
                }
              />
            </span>
          }
          value={renderMaxStakingApr}
        />
      </div>
    </div>
  );
};
