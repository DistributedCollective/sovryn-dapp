import React, { FC } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { HelperButton, Link, SimpleTable } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../../config/chains';

import { BITCOIN } from '../../../../../../../constants/currencies';
import { WIKI_LINKS } from '../../../../../../../constants/links';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../../../utils/asset';
import { useHandleRewards } from '../../hooks/useHandleRewards';
import { LiquidityMiningAction } from '../LiquidityMiningAction/LiquidityMiningAction';
import {
  renderAmount,
  renderParagraph,
  renderPool,
} from './LiquidityMiningMobile.utils';

type LiquidityMiningMobileProps = {
  className?: string;
  liquidRewards: Decimal;
  vestedRewards: Decimal;
  lendingRewards: Decimal;
  availableTradingRewards: string;
  claimDisabled?: boolean;
};

const pageTranslations = translations.rewardPage.liquidityMining;

export const LiquidityMiningMobile: FC<LiquidityMiningMobileProps> = ({
  className,
  liquidRewards,
  vestedRewards,
  lendingRewards,
  availableTradingRewards,
  claimDisabled,
}) => {
  const handleRewards = useHandleRewards();
  const { account } = useAccount();

  return account ? (
    claimDisabled ? (
      renderParagraph(t(pageTranslations.noRewards))
    ) : (
      <div className={className}>
        <span className="flex items-center gap-1 text-gray-40 text-xs font-medium p-3">
          {t(translations.rewardPage.liquidityMining.rewardType)}{' '}
          <HelperButton
            content={
              <Trans
                i18nKey={t(
                  translations.rewardPage.liquidityMining.rewardTypeInfo,
                )}
                components={[
                  <Link
                    text={t(
                      translations.rewardPage.liquidityMining.rewardTypeInfoCTA,
                    )}
                    href={WIKI_LINKS.REWARDS}
                    className="no-underline"
                  />,
                ]}
              />
            }
          />
        </span>

        <SimpleTable>
          <div className="grid grid-cols-1 gap-3">
            <div>
              {renderAmount(liquidRewards, 'ammLPrewardsLiquid')}
              {renderAmount(vestedRewards, 'ammLPrewardsVested')}
              {renderPool('—')}
            </div>
            <div>
              {renderAmount(lendingRewards, 'lendingRewardsVested')}
              {renderPool(
                `${
                  findAsset(COMMON_SYMBOLS.DLLR, RSK_CHAIN_ID).symbol
                }, ${BITCOIN.toLocaleUpperCase()}`,
              )}
            </div>
            <div>
              {renderAmount(availableTradingRewards, 'tradingFeeRebateVested')}
              {renderPool(BITCOIN.toLocaleUpperCase())}
            </div>
          </div>
        </SimpleTable>
        <LiquidityMiningAction
          className="w-full p-3"
          claimDisabled={claimDisabled}
          onClick={handleRewards}
          dataAttribute="liquidity-mining-mobile-rewards-claim-all"
        />
      </div>
    )
  ) : (
    renderParagraph(t(pageTranslations.notConnected))
  );
};
