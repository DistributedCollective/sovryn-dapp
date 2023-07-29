import React, { FC, ReactNode, useEffect, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens, getTokenDetailsData } from '@sovryn/contracts';
import { Link, LinkStyle } from '@sovryn/ui';

import { defaultChainId } from '../../../../../config/chains';

import { MINIMUM_COLLATERAL_RATIO } from '../../../../3_organisms/ZeroLocForm/constants';
import { translations } from '../../../../../locales/i18n';
import { getRskExplorerUrl } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';

const collateralRatio = decimalic(MINIMUM_COLLATERAL_RATIO.mul(100)).toString();

type AssetTooltipContentProps = {
  asset?: SupportedTokens;
  pools?: SupportedTokens[];
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

      const tokens: SupportedTokens[] = [];
      if (asset) {
        tokens.push(asset);
      }
      if (pools) {
        tokens.push(...pools);
      }

      try {
        const links = await Promise.all(
          tokens.map(async token => {
            const { address } = await getTokenDetailsData(
              token,
              defaultChainId,
            );
            return (
              <div className="flex items-center prevent-row-click" key={token}>
                <Link
                  text={token.toUpperCase()}
                  href={`${rskExplorerUrl}/address/${address}`}
                  openNewTab
                  dataAttribute="borrow-asset-tooltip"
                  style={LinkStyle.secondary}
                />
                <div className="font-medium ml-1">
                  – {collateralRatio}%{' '}
                  {t(translations.fixedInterestPage.collateralRatio)}
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
