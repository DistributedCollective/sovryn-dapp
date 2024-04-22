import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useGetNativeTokenPrice } from '../../../../../hooks/useGetNativeTokenPrice';
import { translations } from '../../../../../locales/i18n';
import { ProtocolTypes, PoolValues } from './ProtocolSection.types';
import { getNativeToken } from './ProtocolSection.utils';
import { ProtocolDepositSection } from './components/ProtocolDepositSection/ProtocolDepositSection';
import { ProtocolRewardsSection } from './components/ProtocolRewardsSection/ProtocolRewardsSection';
import { ProtocolTotalSection } from './components/ProtocolTotalSection/ProtocolTotalSection';

export const ProtocolSection: FC = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const [selectedCurrency, setSelectedCurrency] = useState(
    getNativeToken(chainId),
  );
  const [value, setValue] = useState(Decimal.ZERO);
  const [protocolValues, setProtocolValues] = useState<PoolValues>({});

  const { price: nativeTokenPrice } = useGetNativeTokenPrice();

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

  useEffect(() => {
    setProtocolValues({});
    setValue(Decimal.ZERO);
  }, [chainId]);

  return (
    <div className="flex flex-col gap-3">
      <ProtocolTotalSection
        totalValue={value}
        selectedCurrency={selectedCurrency}
        nativeTokenPrice={nativeTokenPrice}
        onCurrencyChange={setSelectedCurrency}
      />
      <ProtocolRewardsSection
        selectedCurrency={selectedCurrency}
        btcPrice={nativeTokenPrice}
      />
      <Paragraph className="text-gray-30 font-medium">
        {t(translations.portfolioPage.protocolSection.depositValue)}
      </Paragraph>
      <ProtocolDepositSection
        selectedCurrency={selectedCurrency}
        btcPrice={nativeTokenPrice}
        onValueChange={handleValueUpdate}
      />
    </div>
  );
};
