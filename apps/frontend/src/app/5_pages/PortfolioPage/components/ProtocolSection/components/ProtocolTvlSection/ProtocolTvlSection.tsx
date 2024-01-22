import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  USD,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { useGetRBTCPrice } from '../../../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';
import { useTotalStakingRewards } from '../../../../../RewardsPage/components/TotalRewardsEarned/hooks/useTotalStakingRewards';

type ProtocolTvlSectionProps = {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
};

export const ProtocolTvlSection: FC<ProtocolTvlSectionProps> = ({
  selectedCurrency,
  onCurrencyChange,
}) => {
  const currencies = useMemo(() => [BITCOIN, USD], []);
  const { price: btcPrice } = useGetRBTCPrice();

  const { totalStakingRewards } = useTotalStakingRewards();

  const currencyPrecision = useMemo(
    () =>
      selectedCurrency === BITCOIN
        ? BTC_RENDER_PRECISION
        : TOKEN_RENDER_PRECISION,
    [selectedCurrency],
  );

  const renderCurrencyClassName = useMemo(
    () => (currency: string) =>
      classNames('ml-2 p-1 h-6', {
        'bg-gray-50': selectedCurrency === currency,
      }),
    [selectedCurrency],
  );

  const renderRewardsClassName = useMemo(
    () => (Number(totalStakingRewards) > 0 ? 'text-positive' : ''),
    [totalStakingRewards],
  );

  const getEqualUsdValue = useCallback(
    (btcAmount: string) => {
      if (btcPrice) {
        return decimalic(btcPrice).mul(btcAmount).toString();
      }
      return 0;
    },
    [btcPrice],
  );

  const renderEquivalentValue = useMemo(
    () => (btcAmount: string) =>
      selectedCurrency === BITCOIN ? btcAmount : getEqualUsdValue(btcAmount),
    [selectedCurrency, getEqualUsdValue],
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

      <div className="rounded md:bg-gray-80 text-gray-10 font-medium md:text-[2.25rem] md:p-3 mb-4">
        <AmountRenderer
          value={renderEquivalentValue('1')}
          suffix={selectedCurrency}
          precision={currencyPrecision}
          dataAttribute="portfolio-total-value"
          isAnimated
        />
      </div>

      <div className="flex justify-between items-center md:mb-6 mb-4 text-xs font-medium">
        <Paragraph className="text-gray-30">
          {t(translations.portfolioPage.protocolTvlSection.totalRewardsEarned)}
        </Paragraph>
        <div className={renderRewardsClassName}>
          <AmountRenderer
            value={renderEquivalentValue(totalStakingRewards)}
            suffix={selectedCurrency}
            precision={currencyPrecision}
            dataAttribute="portfolio-total-earned-rewards"
            isAnimated
          />
        </div>
      </div>
    </>
  );
};
