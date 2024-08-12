import React, { FC } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { BOB_CUSTOM_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { useGetBalance } from '../LiquidityBookFrame/hooks/useGetBalance';

export const BalanceRenderer: FC = () => {
  const { account } = useAccount();
  const { balance, loading } = useGetBalance();

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-80 rounded mb-4">
      <Paragraph>{t(translations.liquidityBookPage.walletBalance)}</Paragraph>
      <div className="text-xs">
        {!account ? (
          t(translations.liquidityBookPage.connectWallet)
        ) : loading ? (
          t(translations.liquidityBookPage.loading)
        ) : (
          <AmountRenderer
            suffix={BOB_CUSTOM_CHAIN_ID.nativeCurrency.symbol}
            precision={TOKEN_RENDER_PRECISION}
            value={balance}
          />
        )}
      </div>
    </div>
  );
};
