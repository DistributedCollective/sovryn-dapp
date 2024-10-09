import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { AssetDetailsData, getAssetData } from '@sovryn/contracts';
import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useWalletConnect } from '../../../../../hooks';
import { useAaveUserReservesData } from '../../../../../hooks/aave/useAaveUserReservesData';
import { translations } from '../../../../../locales/i18n';
import { BorrowAction } from './components/BorrowAction/BorrowAction';
import { SupplyAction } from './components/SupplyAction/SupplyAction';

const pageTranslations = translations.aaveReserveOverviewPage;

type WalletOverviewProps = {
  symbol: string;
};

export const WalletOverview: FC<WalletOverviewProps> = ({ symbol }) => {
  const [asset, setAsset] = useState<AssetDetailsData>();
  const { account, connectWallet, pending } = useWalletConnect();
  const { summary } = useAaveUserReservesData();

  useEffect(() => {
    getAssetData(symbol, BOB_CHAIN_ID).then(setAsset);
  }, [symbol]);

  const reserveSummary = useMemo(
    () => summary.reserves.find(r => r.reserve.symbol === symbol),
    [summary, symbol],
  );

  const supplyCapReached = useMemo(
    () => Decimal.from(reserveSummary?.reserve.supplyUsageRatio ?? 0).gte(1),
    [reserveSummary?.reserve.supplyUsageRatio],
  );

  return (
    <div className="bg-gray-90 p-6 rounded space-y-6 lg:bg-gray-90 lg:p-6 border border-gray-60">
      <Paragraph className="text-base">
        {t(pageTranslations.yourWalletTab.title)}
      </Paragraph>

      {account ? (
        <>
          <div>
            <Paragraph
              size={ParagraphSize.small}
              className="text-gray-30 lg:ml-3 lg:mb-2"
            >
              {t(pageTranslations.yourWalletTab.walletBalance)}
            </Paragraph>
            <div className="lg:px-3 lg:py-6 lg:bg-gray-80 lg:rounded lg:w-full">
              <AmountRenderer
                value={reserveSummary?.walletBalance ?? 0}
                precision={2}
                suffix={asset?.symbol ?? ''}
                className="text-2xl text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            {/* Supply */}
            <SupplyAction
              asset={asset?.symbol ?? ''}
              availableToSupply={Decimal.from(
                reserveSummary?.walletBalance ?? 0,
              )}
              availableToSupplyUsd={Decimal.from(
                reserveSummary?.walletBalanceUsd ?? 0,
              )}
            />

            {/* Borrow */}
            <BorrowAction
              asset={asset?.symbol ?? ''}
              availableToBorrow={Decimal.from(
                reserveSummary?.availableToBorrow ?? 0,
              )}
              availableToBorrowUsd={Decimal.from(
                reserveSummary?.availableToBorrowUsd ?? 0,
              )}
            />
          </div>

          {reserveSummary?.walletBalance.lte(0) && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(pageTranslations.yourWalletTab.yourWalletIsEmpty)}
              dataAttribute="empty-wallet"
            />
          )}

          {supplyCapReached && (
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
