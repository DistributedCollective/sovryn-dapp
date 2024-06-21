import { Decimal } from '@sovryn/utils';

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  ETH,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { isBobChain, isRskChain } from '../../../../../utils/chain';
import { decimalic } from '../../../../../utils/math';

export const getCurrencyPrecision = (selectedCurrency: string) =>
  selectedCurrency === BITCOIN ? BTC_RENDER_PRECISION : TOKEN_RENDER_PRECISION;

export const getNativeToken = (chainId: string) => {
  if (isRskChain(chainId)) {
    return BITCOIN;
  } else if (isBobChain(chainId)) {
    return ETH;
  } else {
    return ETH; // TODO: Change once we have more supported chains.
  }
};

const convertedValue = (btcAmount: Decimal, btcPrice: string) =>
  decimalic(btcPrice).mul(btcAmount).toString();

export const getConvertedValue = (
  btcAmount: Decimal,
  selectedCurrency: string,
  btcPrice: string,
  chainId: string,
) =>
  selectedCurrency === getNativeToken(chainId)
    ? btcAmount
    : convertedValue(btcAmount, btcPrice);
