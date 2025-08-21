import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useCurrentChain } from '../../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';
import { useTotalStakingRewards } from '../../../../../RewardsPage/components/TotalRewardsEarned/hooks/useTotalStakingRewards';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../ProtocolSection.utils';

type ProtocolRewardsSectionProps = {
  selectedCurrency: string;
  btcPrice: string;
};

export const ProtocolRewardsSection: FC<ProtocolRewardsSectionProps> = ({
  selectedCurrency,
  btcPrice,
}) => {
  const chainId = useCurrentChain();
  const navigate = useNavigate();
  const { totalStakingRewards } = useTotalStakingRewards();
  const renderRewardsClassName = useMemo(
    () => (Number(totalStakingRewards) > 0 ? 'text-positive' : ''),
    [totalStakingRewards],
  );
  return (
    <div className="flex justify-between items-center md:mb-6 mb-4 text-xs font-medium">
      <Paragraph className="text-gray-30">
        {t(translations.portfolioPage.protocolSection.totalRewardsEarned)}
      </Paragraph>
      <div
        className={classNames('cursor-pointer', renderRewardsClassName)}
        onClick={() => navigate('/rewards')}
      >
        <AmountRenderer
          value={getConvertedValue(
            decimalic(totalStakingRewards),
            selectedCurrency,
            btcPrice,
            chainId,
          )}
          useTooltip={false}
          suffix={selectedCurrency}
          precision={getCurrencyPrecision(selectedCurrency)}
          dataAttribute="portfolio-total-earned-rewards"
          isAnimated
        />
      </div>
    </div>
  );
};
