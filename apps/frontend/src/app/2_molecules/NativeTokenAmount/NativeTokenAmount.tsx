import React, { FC, useMemo } from 'react';

import { getCurrencyPrecision } from '../../5_pages/PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { BITCOIN, ETH } from '../../../constants/currencies';
import { useChainStore } from '../../../hooks/useChainStore';
import { useGetNativeTokenPrice } from '../../../hooks/useGetNativeTokenPrice';
import { isRskChain } from '../../../utils/chain';
import { decimalic } from '../../../utils/math';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type NativeTokenAmountProps = {
  usdValue: string | number;
  dataAttribute?: string;
  precision?: number;
};

export const NativeTokenAmount: FC<NativeTokenAmountProps> = ({
  usdValue,
  dataAttribute,
  precision,
}) => {
  const { currentChainId } = useChainStore();
  const nativeToken = useMemo(
    () => (isRskChain(currentChainId) ? BITCOIN : ETH),
    [currentChainId],
  );

  const { price: nativeTokenPrice } = useGetNativeTokenPrice();

  const value = useMemo(
    () =>
      !!Number(nativeTokenPrice)
        ? decimalic(usdValue).div(nativeTokenPrice).toString()
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
