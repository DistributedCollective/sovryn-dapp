import React, { FC, ReactElement, useEffect, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { translations } from '../../../../../../../locales/i18n';
import { TokenButton } from './components/TokenButton/TokenButton';

type ReserveTokensProps = {
  symbol: string;
  underlyingTokenAddress: string;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  stableDebtTokenAddress: string;
  onTokenClick: (tokenAddress: string) => void;
  className?: string;
};

export const ReserveTokens: FC<ReserveTokensProps> = ({
  symbol,
  onTokenClick,
  underlyingTokenAddress,
  aTokenAddress,
  variableDebtTokenAddress,
  stableDebtTokenAddress,
  className,
}) => {
  const [tokenLogo, setTokenLogo] = React.useState<string>();

  useEffect(() => {
    getAssetData(symbol, BOB_CHAIN_ID).then(data => {
      setTokenLogo(data.icon);
    });
  }, [symbol]);

  const TokenLogo: ReactElement = useMemo(() => {
    if (!tokenLogo) return <></>;
    else return <div dangerouslySetInnerHTML={{ __html: tokenLogo }} />;
  }, [tokenLogo]);

  return (
    <div className={classNames('divide-y divide-gray-20', className)}>
      <TokenButton
        title={t(translations.aaveReserveOverviewPage.topPanel.underlyingToken)}
        label={symbol}
        logo={TokenLogo}
        onClick={() => onTokenClick(underlyingTokenAddress)}
      />

      <TokenButton
        title={t(translations.aaveReserveOverviewPage.topPanel.aToken)}
        label={`a${symbol}`}
        logo={TokenLogo}
        onClick={() => onTokenClick(aTokenAddress)}
      />

      <TokenButton
        title={t(
          translations.aaveReserveOverviewPage.topPanel.variableDebtToken,
        )}
        label={t(
          translations.aaveReserveOverviewPage.topPanel.variableDebtTokenName,
          { symbol },
        )}
        logo={TokenLogo}
        onClick={() => onTokenClick(variableDebtTokenAddress)}
      />

      <TokenButton
        title={t(translations.aaveReserveOverviewPage.topPanel.stableDebtToken)}
        label={t(
          translations.aaveReserveOverviewPage.topPanel.stableDebtTokenName,
          { symbol },
        )}
        logo={TokenLogo}
        onClick={() => onTokenClick(stableDebtTokenAddress)}
      />
    </div>
  );
};
