import React, { FC, useMemo } from 'react';

import { getCurrencyPrecision } from '../../5_pages/PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { useGetNativeTokenPrice } from '../../../hooks/useGetNativeTokenPrice';
import { decimalic } from '../../../utils/math';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type NativeTokenAmountProps = {
  usdValue?: string | number;
  dataAttribute?: string;
  precision?: number;
  token?: 'BTC' | 'ETH';
};

export const NativeTokenAmount: FC<NativeTokenAmountProps> = ({
  usdValue,
  dataAttribute,
  precision,
  token,
}) => {
  const { price: nativeTokenPrice, nativeToken } =
    useGetNativeTokenPrice(token);

  const value = useMemo(
    () =>
      !!Number(nativeTokenPrice)
        ? decimalic(usdValue || 0)
            .div(nativeTokenPrice)
            .toString()
        : '0',
    [nativeTokenPrice, usdValue],
  );

  return (
    <AmountRenderer
      value={value}
      suffix={nativeToken}
      precision={precision || getCurrencyPrecision(nativeToken)}
      dataAttribute={dataAttribute}
    />
  );
};
