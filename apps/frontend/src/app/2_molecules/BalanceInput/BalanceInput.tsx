import React from 'react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import { BigNumberish } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';
import { AmountInput, AmountInputProps } from '@sovryn/ui';

import { useMaxAssetBalance } from '../../../hooks/useMaxAssetBalance';
import { getRskChainId } from '../../../utils/chain';
import { fromWei } from '../../../utils/math';

const DEFAULT_GAS_LIMIT = 1000000; // 1M wei

type BalanceInputProps = Omit<AmountInputProps, 'maxAmount' | 'unit'> & {
  token: SupportedTokens;
  gasLimit?: BigNumberish;
  chainId?: ChainId;
};

export const BalanceInput = forwardRef<HTMLInputElement, BalanceInputProps>(
  (
    { token, gasLimit = DEFAULT_GAS_LIMIT, chainId = getRskChainId(), ...rest },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(
      null,
    ) as React.MutableRefObject<HTMLInputElement>;

    useImperativeHandle(ref, () => inputRef.current);

    const { value: balance } = useMaxAssetBalance(token, chainId, gasLimit);

    return (
      <AmountInput
        ref={inputRef}
        unit={token.toUpperCase()}
        maxAmount={Number(fromWei(balance))}
        {...rest}
      />
    );
  },
);
