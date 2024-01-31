import { Decimal } from '@sovryn/utils';

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { decimalic } from '../../../../../utils/math';

export const getCurrencyPrecision = (selectedCurrency: string) =>
  selectedCurrency === BITCOIN ? BTC_RENDER_PRECISION : TOKEN_RENDER_PRECISION;

export const getConvertedValue = (
  amount: Decimal,
  selectedCurrency: string,
  btcPrice: string,
) =>
  selectedCurrency === BITCOIN
    ? decimalic(amount).div(btcPrice).toString()
    : amount.toString();
