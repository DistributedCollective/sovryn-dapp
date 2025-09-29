import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { USD } from '../../../../../../../constants/currencies';
import { useCurrentChain } from '../../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../../locales/i18n';
import {
  getCurrencyPrecision,
  getConvertedValue,
  getNativeToken,
} from '../../ProtocolSection.utils';

type ProtocolTotalSectionProps = {
  totalValue: Decimal;
  selectedCurrency: string;
  nativeTokenPrice: string;
  onCurrencyChange: (currency: string) => void;
  className?: string;
  title?: string;
};

export const ProtocolTotalSection: FC<ProtocolTotalSectionProps> = ({
  totalValue,
  selectedCurrency,
  nativeTokenPrice,
  onCurrencyChange,
  className,
  title = t(translations.portfolioPage.protocolSection.totalValue),
}) => {
  const chainId = useCurrentChain();
  const currencies = useMemo(() => [getNativeToken(chainId), USD], [chainId]);

  const renderCurrencyClassName = useMemo(
    () => (currency: string) =>
      classNames('ml-2 p-1 h-6', {
        'bg-gray-50': selectedCurrency === currency,
      }),
    [selectedCurrency],
  );

  const convertedTotalValue = useMemo(
    () =>
      getConvertedValue(
        totalValue,
        selectedCurrency,
        nativeTokenPrice,
        chainId,
      ),
    [totalValue, selectedCurrency, nativeTokenPrice, chainId],
  );

  return (
    <div className={classNames(className, 'flex flex-col gap-3')}>
      <div className="flex justify-between items-center">
        <Paragraph className="text-gray-30 font-medium" children={title} />
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
          value={convertedTotalValue}
          suffix={selectedCurrency}
          precision={getCurrencyPrecision(selectedCurrency)}
          dataAttribute="portfolio-total-value"
          isAnimated
        />
      </div>
    </div>
  );
};
