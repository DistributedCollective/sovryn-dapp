import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BITCOIN, USD } from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';
import { useTotalStakingRewards } from '../../../../../RewardsPage/components/TotalRewardsEarned/hooks/useTotalStakingRewards';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../ProtocolSection.utils';

type ProtocolTvlSectionProps = {
  totalValue: Decimal;
  selectedCurrency: string;
  btcPrice: string;
  onCurrencyChange: (currency: string) => void;
};

export const ProtocolTvlSection: FC<ProtocolTvlSectionProps> = ({
  totalValue,
  selectedCurrency,
  btcPrice,
  onCurrencyChange,
}) => {
  const navigate = useNavigate();

  const currencies = useMemo(() => [BITCOIN, USD], []);
  const { totalStakingRewards } = useTotalStakingRewards();

  const renderCurrencyClassName = useMemo(
    () => (currency: string) =>
      classNames('ml-2 p-1 h-6', {
        'bg-gray-50': selectedCurrency === currency,
      }),
    [selectedCurrency],
  );

  const renderRewardsClassName = useMemo(
    () =>
      Number(totalStakingRewards) > 0 ? 'text-positive cursor-pointer' : '',
    [totalStakingRewards],
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <Paragraph className="text-gray-30 font-medium">
          {t(translations.portfolioPage.protocolTvlSection.totalValue)}
        </Paragraph>

        <div className="flex justify-end">
          {currencies.map(currency => (
            <Button
              key={currency}
              text={t(translations.common[currency.toLowerCase()])}
              className={renderCurrencyClassName(currency)}
              onClick={() => onCurrencyChange(currency)}
              style={ButtonStyle.secondary}
              dataAttribute={`portfolio-total-value-${currency.toLowerCase()}`}
            />
          ))}
        </div>
      </div>

      <div className="rounded md:bg-gray-80 text-gray-10 font-medium md:text-[2.25rem] md:p-3 mb-4 truncate">
        <AmountRenderer
          value={getConvertedValue(totalValue, selectedCurrency, btcPrice)}
          suffix={selectedCurrency}
          precision={getCurrencyPrecision(selectedCurrency)}
          dataAttribute="portfolio-total-value"
          isAnimated
        />
      </div>

      <div className="flex justify-between items-center md:mb-6 mb-4 text-xs font-medium">
        <Paragraph className="text-gray-30">
          {t(translations.portfolioPage.protocolTvlSection.totalRewardsEarned)}
        </Paragraph>
        <div
          className={renderRewardsClassName}
          onClick={() => navigate('/rewards')}
        >
          <AmountRenderer
            value={getConvertedValue(
              decimalic(totalStakingRewards),
              selectedCurrency,
              btcPrice,
            )}
            useTooltip={false}
            suffix={selectedCurrency}
            precision={getCurrencyPrecision(selectedCurrency)}
            dataAttribute="portfolio-total-earned-rewards"
            isAnimated
          />
        </div>
      </div>
    </>
  );
};
