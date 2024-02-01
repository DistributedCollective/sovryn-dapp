import React, { FC, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BITCOIN, USD } from '../../../../../../../constants/currencies';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { getCurrencyPrecision } from '../../../ProtocolSection/ProtocolSection.utils';
import { getConvertedValue } from '../../AssetSection.utils';

type TotalAssetSectionProps = {
  totalValue: Decimal;
  btcPrice: string;
};

export const TotalAssetSection: FC<TotalAssetSectionProps> = ({
  totalValue,
  btcPrice,
}) => {
  const { account } = useAccount();
  const [selectedCurrency, setSelectedCurrency] = useState(BITCOIN);

  const currencies = useMemo(() => [BITCOIN, USD], []);

  const renderCurrencyClassName = useMemo(
    () => (currency: string) =>
      classNames('ml-2 p-1 h-6', {
        'bg-gray-50': selectedCurrency === currency,
      }),
    [selectedCurrency],
  );

  const convertedAmount = useMemo(
    () =>
      account
        ? getConvertedValue(totalValue, selectedCurrency, btcPrice)
        : Decimal.ZERO,
    [btcPrice, selectedCurrency, totalValue, account],
  );

  return (
    <div className="flex flex-col gap-2 w-full md:max-w-[23.25rem] mb-2.5">
      <div className="flex justify-between items-center">
        <Paragraph className="text-gray-30 font-medium">
          {t(translations.portfolioPage.assetSection.totalAssets)}
        </Paragraph>

        <div className="flex justify-end">
          {currencies.map(currency => (
            <Button
              key={currency}
              text={t(translations.common[currency.toLowerCase()])}
              className={renderCurrencyClassName(currency)}
              onClick={() => setSelectedCurrency(currency)}
              style={ButtonStyle.secondary}
              dataAttribute={`portfolio-total-value-${currency.toLowerCase()}`}
            />
          ))}
        </div>
      </div>

      <div className="rounded md:bg-gray-80 text-gray-10 font-medium md:text-[2.25rem] md:p-3 truncate">
        <AmountRenderer
          value={convertedAmount}
          suffix={selectedCurrency}
          precision={getCurrencyPrecision(selectedCurrency)}
          dataAttribute="portfolio-total-value"
          isAnimated
        />
      </div>
    </div>
  );
};
