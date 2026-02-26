import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';
import { prettyTx } from '@sovryn/ui';

import { BOB_CHAIN_ID, RSK_CHAIN_ID } from '../config/chains';

import { translations } from '../locales/i18n';
import { COMMON_SYMBOLS, findAsset, findAssetByAddress } from '../utils/asset';

export const getTokenDisplayName = (
  token: string,
  chainId: ChainId = RSK_CHAIN_ID,
): string => findAsset(token, chainId)?.symbol || token.toUpperCase();

export const getTokenDisplayNameByAddress = (
  address: string,
  chainId: ChainId = BOB_CHAIN_ID,
  fallbackPrettified = true,
): string =>
  findAssetByAddress(address, chainId)?.symbol ||
  (fallbackPrettified ? prettyTx(address) : address);

export const getBobDeprecatedAssetTooltips = (asset: string) => {
  if (asset.toUpperCase() === COMMON_SYMBOLS.USDT0) {
    return {
      pool: t(translations.ambientMarketMaking.deprecatedTooltips.usdt.pool),
      convert: t(
        translations.ambientMarketMaking.deprecatedTooltips.usdt.convert,
      ),
    };
  }
  if (asset.toUpperCase() === COMMON_SYMBOLS.WBTC_OLD) {
    return {
      pool: t(translations.ambientMarketMaking.deprecatedTooltips.wbtc.pool),
      convert: t(
        translations.ambientMarketMaking.deprecatedTooltips.wbtc.convert,
      ),
    };
  }

  if (
    ['POWA', 'DOGGOTOTHEMOON', 'PUPSWORLDPEACE'].includes(asset.toUpperCase())
  ) {
    return {
      pool: 'Will be removed soon',
      convert: 'Convert',
    };
  }
};

export const getRskDeprecatedAssetTooltips = (asset: string) => {
  // if (asset.toUpperCase() === COMMON_SYMBOLS.RUSDT) {
  //   return {
  //     pool: t(translations.rusdtMigration.notice),
  //     convert: t(translations.rusdtMigration.convertNotice),
  //   };
  // }

  if (['POWA'].includes(asset.toUpperCase())) {
    return {
      pool: 'Will be removed soon',
      convert: 'Convert',
    };
  }
};
