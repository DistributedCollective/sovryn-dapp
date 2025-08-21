import React, { FC, ReactNode, useEffect, useState } from 'react';

import { t } from 'i18next';

import { Link, LinkStyle } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../../constants/lending';
import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { translations } from '../../../../../../locales/i18n';
import { getRskExplorerUrl } from '../../../../../../utils/helpers';
import { decimalic } from '../../../../../../utils/math';
import { COMMON_SYMBOLS } from '../../../../../../utils/asset';
import { getAssetData } from '@sovryn/contracts';

type AssetTooltipContentProps = {
  asset?: string;
  pools?: string[];
};

export const AssetTooltipContent: FC<AssetTooltipContentProps> = ({
  asset,
  pools,
}) => {
  const rskExplorerUrl = getRskExplorerUrl();
  const [tooltipContent, setTooltipContent] = useState<ReactNode>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!asset && !pools) {
        setTooltipContent(null);
        return;
      }

      const tokens: string[] = [];
      if (asset) {
        tokens.push(asset);
      }
      if (pools) {
        tokens.push(...pools);
      }

      try {
        const links = await Promise.all(
          tokens.map(async token => {
            const { address } = await getAssetData(token, RSK_CHAIN_ID);

            const minimumCollateralRatio =
              token === COMMON_SYMBOLS.SOV
                ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV
                : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS;

            return (
              <div className="flex items-center prevent-row-click" key={token}>
                <Link
                  text={getTokenDisplayName(token)}
                  href={`${rskExplorerUrl}/address/${address}`}
                  openNewTab
                  dataAttribute="lend-asset-tooltip"
                  style={LinkStyle.secondary}
                />
                <div className="font-medium ml-1">
                  – {decimalic(minimumCollateralRatio.mul(100)).toString()}%{' '}
                  {t(translations.lendPage.table.collateralRatio)}
                </div>
              </div>
            );
          }),
        );

        setTooltipContent(links);
      } catch (error) {
        console.error('Error fetching token details:', error);
        setTooltipContent(null);
      }
    };

    fetchTokenDetails();
  }, [asset, pools, rskExplorerUrl]);

  return <>{tooltipContent}</>;
};
