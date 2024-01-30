import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useGetRBTCPrice } from '../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../locales/i18n';
import { AssetBalanceRow } from './components/AssetBalanceRow/AssetBalanceRow';
import { AssetSectionActions } from './components/AssetSectionActions/AssetSectionActions';
import { TotalAssetSection } from './components/TotalAssetSection/TotalAssetSection';

const tokens = [
  SupportedTokens.rbtc,
  SupportedTokens.sov,
  SupportedTokens.dllr,
  SupportedTokens.xusd,
  SupportedTokens.fish,
  SupportedTokens.moc,
  SupportedTokens.rif,
  SupportedTokens.doc,
];

export const AssetSection: FC = () => {
  const { price: btcPrice } = useGetRBTCPrice();

  const [usdValues, setUsdValues] = useState(
    tokens.reduce((obj, token) => {
      obj[token] = '0';
      return obj;
    }, {}),
  );

  const totalUsdValue = useMemo(
    () =>
      Object.keys(usdValues)
        .map(token => usdValues[token])
        .reduce((sum: Decimal, val: string) => sum.add(val), Decimal.ZERO),
    [usdValues],
  );

  return (
    <div className="flex flex-col">
      <TotalAssetSection btcPrice={btcPrice} totalValue={totalUsdValue} />

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
        {tokens.map(token => (
          <AssetBalanceRow
            key={token}
            token={token}
            updateUsdValue={(usdValue: string) =>
              setUsdValues(usdValues => ({
                ...usdValues,
                [token]: usdValue,
              }))
            }
          />
        ))}
      </div>
    </div>
  );
};
