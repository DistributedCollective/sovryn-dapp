import React, { useMemo } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import {
  HelperButton,
  Link,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useLoadContract } from '../../../../../hooks/useLoadContract';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../utils/asset';
import { isRskChain } from '../../../../../utils/chain';
import { fromWei } from '../../../../../utils/math';
import { APR, MAX_STAKING_APR_LINK, VP } from '../../StakePage.constants';
import { GlobalStatistics } from '../../StakePage.utils';
import { useGetStakingStatistics } from './hooks/useGetStakingStatistics';

export const StakingStatistics = () => {
  const chainId = useCurrentChain();
  const stakingContract = useLoadContract('staking', 'protocol', chainId);

  const { totalVotingPower, maxStakingApr } = useGetStakingStatistics();
  const totalStakedSov = useAssetBalance(
    COMMON_SYMBOLS.SOV,
    chainId,
    stakingContract?.address,
  );

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
              value={totalStakedSov?.balance}
              suffix={findAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
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
        {isRskChain(chainId) && (
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
        )}
      </div>
    </div>
  );
};
