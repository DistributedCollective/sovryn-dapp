import React, { FC, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Paragraph,
  ParagraphSize,
  Tabs,
  TabSize,
  TabType,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useWalletConnect } from '../../../../../hooks';
import { translations } from '../../../../../locales/i18n';
import { BorrowAction } from './components/BorrowAction/BorrowAction';
import { SupplyAction } from './components/SupplyAction/SupplyAction';

const pageTranslations = translations.aaveReserveOverviewPage;

type WalletOverviewProps = {
  asset: {
    symbol: string;
    name: string;
  };
};

export const WalletOverview: FC<WalletOverviewProps> = ({
  asset: initialAsset,
}) => {
  const [asset, setAsset] = useState(initialAsset.symbol);
  const { account, connectWallet, pending } = useWalletConnect();

  const assetBalance = Decimal.from(0); // TODO: mocked
  const maxSupplyCap = true; // TODO: mocked

  return (
    <div className="bg-gray-90 p-6 rounded space-y-6 lg:bg-gray-90 lg:p-6 border border-gray-60">
      <Paragraph className="text-base">
        {t(pageTranslations.yourWalletTab.title)}
      </Paragraph>

      {account ? (
        <>
          <div>
            {['ETH', 'WETH'].includes(asset) && (
              <Tabs
                className="mb-5"
                index={asset === 'ETH' ? 0 : 1}
                onChange={e => setAsset(e === 0 ? 'ETH' : 'WETH')}
                items={[
                  {
                    activeClassName: 'text-primary-20',
                    dataAttribute: 'eth',
                    label: 'ETH',
                  },
                  {
                    activeClassName: 'text-primary-20',
                    dataAttribute: 'weth',
                    label: 'WETH',
                  },
                ]}
                size={TabSize.normal}
                type={TabType.secondary}
              />
            )}

            <div>
              <Paragraph
                size={ParagraphSize.small}
                className="text-gray-30 lg:ml-3 lg:mb-2"
              >
                {t(pageTranslations.yourWalletTab.walletBalance)}
              </Paragraph>
              <div className="lg:px-3 lg:py-6 lg:bg-gray-80 lg:rounded lg:w-full">
                <AmountRenderer
                  value={0}
                  suffix={asset}
                  className="text-2xl text-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Supply */}
            <SupplyAction asset={asset} />

            {/* Borrow */}
            <BorrowAction asset={asset} />
          </div>

          {assetBalance.lte(0) && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(pageTranslations.yourWalletTab.yourWalletIsEmpty)}
              dataAttribute="empty-wallet"
            />
          )}

          {maxSupplyCap && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={t(pageTranslations.yourWalletTab.noSupply)}
              dataAttribute="no-supply-available"
            />
          )}
        </>
      ) : (
        <>
          {/* Not connected */}
          <Paragraph className="text-sm italic font-medium">
            {t(pageTranslations.yourWalletTab.connectWalletToSeeData)}
          </Paragraph>

          <Button
            text={t(pageTranslations.yourWalletTab.connectWallet)}
            onClick={connectWallet}
            disabled={pending}
          />
        </>
      )}
    </div>
  );
};
