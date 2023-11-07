import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { getTokenDisplayName } from '../../../constants/tokens';
import { translations } from '../../../locales/i18n';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
import { PairRenderer } from '../PairRenderer/PairRenderer';
import styles from './PromoCard.module.css';

type PromoCardProps = {
  className?: string;
  asset1: SupportedTokens;
  asset2: SupportedTokens;
  apy: string;
  rewards: string;
  rewardToken: SupportedTokens;
  rewardsLabel: string;
};

export const PromoCard: FC<PromoCardProps> = ({
  className,
  asset1,
  asset2,
  rewards,
  rewardToken,
  rewardsLabel,
  apy,
}) => (
  <div className={classNames(styles.wrapper, className)}>
    <PairRenderer className="mb-3" asset1={asset1} asset2={asset2} />

    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-gray-30 mb-1.5">{rewardsLabel}</span>
        <span className="text-white text-base">
          <AmountRenderer
            value={rewards}
            suffix={getTokenDisplayName(rewardToken)}
            isAnimated
            precision={0}
          />
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-gray-30 mb-1.5">
          {t(translations.promotion.currentAPY)}
        </span>
        <span className="text-white text-base">
          <AmountRenderer value={apy} suffix="%" isAnimated precision={2} />
        </span>
      </div>
    </div>
  </div>
);
