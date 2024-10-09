import React, { FC, useMemo } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { getCurrencyPrecision } from '../../5_pages/PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { useGetNativeTokenPrice } from '../../../hooks/useGetNativeTokenPrice';
import { decimalic } from '../../../utils/math';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type NativeTokenAmountProps = {
  usdValue?: string | number;
  dataAttribute?: string;
  precision?: number;
  chainId?: ChainId;
};

export const NativeTokenAmount: FC<NativeTokenAmountProps> = ({
  usdValue,
  dataAttribute,
  precision,
  chainId,
}) => {
  const currentChainId = useCurrentChain();

  const { price: nativeTokenPrice, nativeToken } = useGetNativeTokenPrice(
    chainId ?? currentChainId,
  );

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
