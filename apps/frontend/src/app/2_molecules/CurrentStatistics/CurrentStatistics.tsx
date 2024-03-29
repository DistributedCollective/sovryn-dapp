import React, { FC } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph } from '@sovryn/ui';

import { AssetPairRenderer } from '../AssetPairRenderer/AssetPairRenderer';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';
import styles from './CurrentStatistics.module.css';

export type CurrentStatisticsProps = {
  symbol: SupportedTokens;
  symbol2?: SupportedTokens;
  label1: string;
  label2: string;
  value1: React.ReactNode;
  value2: React.ReactNode;
};

export const CurrentStatistics: FC<CurrentStatisticsProps> = ({
  symbol,
  symbol2,
  label1,
  label2,
  value1,
  value2,
}) => (
  <>
    {!!symbol2 ? (
      <AssetPairRenderer asset1={symbol} asset2={symbol2} />
    ) : (
      <AssetRenderer
        logoClassName={styles.assetLogo}
        showAssetLogo
        asset={symbol}
      />
    )}

    <div className="flex gap-8">
      <div className="mt-6 flex flex-col gap-2">
        <Paragraph className="font-medium text-gray-30">{label1}</Paragraph>
        {value1}
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <Paragraph className="font-medium text-gray-30">{label2}</Paragraph>
        {value2}
      </div>
    </div>
  </>
);
