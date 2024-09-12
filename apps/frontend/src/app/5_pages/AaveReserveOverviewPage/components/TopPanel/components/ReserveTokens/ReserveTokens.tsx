import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AssetIcon } from '../../../../../../2_molecules/AssetIcon/AssetIcon';
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
}) => (
  <div className={classNames('divide-y divide-gray-20', className)}>
    <TokenButton
      title={t(translations.aaveReserveOverviewPage.topPanel.underlyingToken)}
      label={symbol}
      logo={<AssetIcon chainId={BOB_CHAIN_ID} symbol={symbol} />}
      onClick={() => onTokenClick(underlyingTokenAddress)}
    />

    <TokenButton
      title={t(translations.aaveReserveOverviewPage.topPanel.aToken)}
      label={`a${symbol}`}
      logo={<AssetIcon chainId={BOB_CHAIN_ID} symbol={symbol} />}
      onClick={() => onTokenClick(aTokenAddress)}
    />

    <TokenButton
      title={t(translations.aaveReserveOverviewPage.topPanel.variableDebtToken)}
      label={t(
        translations.aaveReserveOverviewPage.topPanel.variableDebtTokenName,
        { symbol },
      )}
      logo={<AssetIcon chainId={BOB_CHAIN_ID} symbol={symbol} />}
      onClick={() => onTokenClick(variableDebtTokenAddress)}
    />

    <TokenButton
      title={t(translations.aaveReserveOverviewPage.topPanel.stableDebtToken)}
      label={t(
        translations.aaveReserveOverviewPage.topPanel.stableDebtTokenName,
        { symbol },
      )}
      logo={<AssetIcon chainId={BOB_CHAIN_ID} symbol={symbol} />}
      onClick={() => onTokenClick(stableDebtTokenAddress)}
    />
  </div>
);
