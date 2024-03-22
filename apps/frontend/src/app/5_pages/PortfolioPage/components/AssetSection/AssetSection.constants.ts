import { contracts } from '@sovryn/contracts';
import { getNetworkByChainId } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';
import { RSK_CHAIN_ID } from '../../../../../config/chains';

export const availableTokens =
  contracts.assets[getNetworkByChainId(RSK_CHAIN_ID)]?.map(
    item => item.symbol,
  ) ?? [];

export const initialUsdValues = availableTokens.reduce(
  (obj, token) => ({ ...obj, [token]: Decimal.ZERO }),
  {},
);
