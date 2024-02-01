import { Decimal } from '@sovryn/utils';

import { BITCOIN } from '../../../../../constants/currencies';
import { decimalic } from '../../../../../utils/math';

export const getConvertedValue = (
  amount: Decimal,
  selectedCurrency: string,
  btcPrice: string,
) =>
  selectedCurrency === BITCOIN
    ? decimalic(amount).div(btcPrice).toString()
    : amount.toString();
