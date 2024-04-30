import { Decimal } from '@sovryn/utils';

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  ETH,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { isRskChain } from '../../../../../utils/chain';
import { decimalic } from '../../../../../utils/math';

export const getCurrencyPrecision = (selectedCurrency: string) =>
  selectedCurrency === BITCOIN ? BTC_RENDER_PRECISION : TOKEN_RENDER_PRECISION;

export const getNativeToken = () =>
  isRskChain(getCurrentChain()) ? BITCOIN : ETH;

const convertedValue = (btcAmount: Decimal, btcPrice: string) =>
  decimalic(btcPrice).mul(btcAmount).toString();

export const getConvertedValue = (
  btcAmount: Decimal,
  selectedCurrency: string,
  btcPrice: string,
) =>
  selectedCurrency === getNativeToken()
    ? btcAmount
    : convertedValue(btcAmount, btcPrice);
