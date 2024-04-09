import { contracts } from '@sovryn/contracts';
import { getNetworkByChainId } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

export const getAvailableTokens = (chainId: string = RSK_CHAIN_ID) =>
  contracts.assets[getNetworkByChainId(chainId)]?.map(item => item.symbol) ??
  [];

export const initialUsdValues = getAvailableTokens().reduce(
  (obj, token) => ({ ...obj, [token]: Decimal.ZERO }),
  {},
);
