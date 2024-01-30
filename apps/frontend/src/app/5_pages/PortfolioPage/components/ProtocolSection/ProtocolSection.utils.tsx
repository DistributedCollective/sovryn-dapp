import { Decimal } from '@sovryn/utils';

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { decimalic } from '../../../../../utils/math';

export const getCurrencyPrecision = (selectedCurrency: string) =>
  selectedCurrency === BITCOIN ? BTC_RENDER_PRECISION : TOKEN_RENDER_PRECISION;

const convertedValue = (btcAmount: Decimal, btcPrice: string) =>
  decimalic(btcPrice).mul(btcAmount).toString();

export const getConvertedValue = (
  btcAmount: Decimal,
  selectedCurrency: string,
  btcPrice: string,
) =>
  selectedCurrency === BITCOIN
    ? btcAmount
    : convertedValue(btcAmount, btcPrice);
