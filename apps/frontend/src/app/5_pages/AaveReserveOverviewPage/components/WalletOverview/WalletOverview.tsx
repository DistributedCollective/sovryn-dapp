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
import { ETH, WETH } from '../../../../../constants/currencies';
import { useWalletConnect } from '../../../../../hooks';
import { translations } from '../../../../../locales/i18n';
import { BorrowAction } from './components/BorrowAction/BorrowAction';
import { SupplyAction } from './components/SupplyAction/SupplyAction';

const pageTranslations = translations.aaveReserveOverviewPage;

const ETH_ASSET_SYMBOLS = [ETH, WETH];

type WalletOverviewProps = {
  asset: string;
};

export const WalletOverview: FC<WalletOverviewProps> = ({
  asset: initialAsset,
}) => {
  const [asset, setAsset] = useState(initialAsset);
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
            {ETH_ASSET_SYMBOLS.includes(asset) && (
              <Tabs
                className="mb-5"
                index={ETH_ASSET_SYMBOLS.indexOf(asset)}
                onChange={e => setAsset(ETH_ASSET_SYMBOLS[e])}
                items={ETH_ASSET_SYMBOLS.map(s => ({
                  activeClassName: 'text-primary-20',
                  dataAttribute: s,
                  label: s,
                }))}
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
