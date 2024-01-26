import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BITCOIN } from '../../../../../constants/currencies';
import { useAccount } from '../../../../../hooks/useAccount';
import { useGetRBTCPrice } from '../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../locales/i18n';
import { ProtocolTypes, PoolValues } from './ProtocolSection.types';
import { ProtocolDepositSection } from './components/ProtocolDepositSection/ProtocolDepositSection';
import { ProtocolTvlSection } from './components/ProtocolTvlSection/ProtocolTvlSection';

export const ProtocolSection: FC = () => {
  const { account } = useAccount();
  const [selectedCurrency, setSelectedCurrency] = useState(BITCOIN);
  const [value, setValue] = useState(Decimal.ZERO);
  const [protocolValues, setProtocolValues] = useState<PoolValues>({});
  const { price: btcPrice } = useGetRBTCPrice();

  const handleValueUpdate = useCallback(
    (newBalance: Decimal, protocolIdentifier: ProtocolTypes) => {
      setProtocolValues(prevValues => {
        const updatedValues = {
          ...prevValues,
          [protocolIdentifier]: newBalance,
        };
        if (newBalance.isZero()) {
          delete updatedValues[protocolIdentifier];
        }
        return updatedValues;
      });
    },
    [setProtocolValues],
  );

  const totalValue = useMemo(
    () =>
      Object.values(protocolValues).reduce(
        (total, value) => total.add(value),
        Decimal.ZERO,
      ),
    [protocolValues],
  );

  useEffect(() => {
    setValue(totalValue);
  }, [totalValue]);

  useEffect(() => {
    if (!account) {
      setProtocolValues({});
      setValue(Decimal.ZERO);
    }
  }, [account]);

  return (
    <div className="flex flex-col gap-3">
      <ProtocolTvlSection
        totalValue={value}
        selectedCurrency={selectedCurrency}
        btcPrice={btcPrice}
        onCurrencyChange={setSelectedCurrency}
      />
      <Paragraph className="text-right text-gray-30 font-medium">
        {t(translations.portfolioPage.protocolSection.depositValue)}
      </Paragraph>
      <ProtocolDepositSection
        selectedCurrency={selectedCurrency}
        btcPrice={btcPrice}
        onValueChange={handleValueUpdate}
      />
    </div>
  );
};
