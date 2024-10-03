import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useGetNativeTokenPrice } from '../../../../../hooks/useGetNativeTokenPrice';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { getNativeToken } from '../ProtocolSection/ProtocolSection.utils';
import { ProtocolTotalSection } from '../ProtocolSection/components/ProtocolTotalSection/ProtocolTotalSection';
import { getAvailableTokens } from './AssetSection.constants';
import { AssetBalanceRow } from './components/AssetBalanceRow/AssetBalanceRow';
import { AssetSectionActions } from './components/AssetSectionActions/AssetSectionActions';

export const AssetSection: FC = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();

  const [selectedCurrency, setSelectedCurrency] = useState(
    getNativeToken(chainId),
  );
  const [usdValues, setUsdValues] = useState({});
  const { price: nativeTokenPrice } = useGetNativeTokenPrice(chainId);
  const availableTokens = useMemo(() => getAvailableTokens(chainId), [chainId]);

  useEffect(() => {
    setUsdValues({});
    setSelectedCurrency(getNativeToken(chainId));
  }, [chainId]);

  const updateUsdValue = useCallback((token: string, usdValue: string) => {
    setUsdValues(prevUsdValues => {
      if (prevUsdValues[token] === usdValue) {
        return prevUsdValues;
      }
      return {
        ...prevUsdValues,
        [token]: usdValue,
      };
    });
  }, []);

  const totalUsdValue = useMemo(
    () =>
      account
        ? Object.keys(usdValues)
            .map(token => usdValues[token])
            .reduce((sum: Decimal, val: string) => sum.add(val), Decimal.ZERO)
        : Decimal.ZERO,
    [usdValues, account],
  );

  const totalValue = useMemo(
    () => decimalic(totalUsdValue.div(nativeTokenPrice).toString()),
    [totalUsdValue, nativeTokenPrice],
  );

  return (
    <div className="flex flex-col">
      <ProtocolTotalSection
        totalValue={totalValue}
        selectedCurrency={selectedCurrency}
        nativeTokenPrice={nativeTokenPrice}
        onCurrencyChange={setSelectedCurrency}
        title={t(translations.portfolioPage.assetSection.totalAssets)}
        className="md:max-w-sm"
      />

      <AssetSectionActions />

      <div className="flex flex-col gap-2 md:gap-3 mt-3">
        <div className="hidden md:grid grid-cols-3 px-6 py-2">
          <Paragraph>
            {t(translations.portfolioPage.assetSection.asset)}
          </Paragraph>
          <Paragraph>
            {t(translations.portfolioPage.assetSection.balance)}
          </Paragraph>
          <Paragraph>
            {t(translations.portfolioPage.assetSection.usdValue)}
          </Paragraph>
        </div>
        {availableTokens.map(token => (
          <AssetBalanceRow
            key={`${token}-${chainId}`}
            token={token}
            updateUsdValue={(usdValue: string) =>
              updateUsdValue(token, usdValue)
            }
          />
        ))}
      </div>
    </div>
  );
};
