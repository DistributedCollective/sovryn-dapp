import { useMemo } from 'react';

import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { t } from 'i18next';

import { BridgeParams } from '@sovryn/sdk';

import { getTokenDisplayName } from '../../../../constants/tokens';
import { translations } from '../../../../locales/i18n';
import { useBridgeLimits } from './useBridgeLimits';
import { useTokenBalance } from './useTokenBalance';

interface BridgeValidationResult {
  isValid: boolean;
  messages: string[];
}

export function useBridgeValidation({
  sourceChain,
  targetChain,
  asset,
  amount,
  receiver,
}: Omit<BridgeParams, 'signer'>): BridgeValidationResult {
  const { data: balance } = useTokenBalance(asset, sourceChain);
  const { data: limits } = useBridgeLimits(sourceChain, targetChain, asset);

  return useMemo(() => {
    const messages: string[] = [];

    if (!balance || !limits || !amount || !receiver) {
      return { isValid: false, messages };
    }

    try {
      const amountBN = ethers.BigNumber.from(amount);
      const balanceBN = ethers.BigNumber.from(balance);
      const minBN = ethers.BigNumber.from(limits.minPerToken);
      const maxBN = ethers.BigNumber.from(limits.maxTokensAllowed);

      const isAddressValid = isAddress(receiver);
      const isAmountValid =
        amountBN.gt(0) &&
        amountBN.gte(minBN) &&
        amountBN.lte(maxBN) &&
        amountBN.lte(balanceBN);

      const isValid = isAmountValid && isAddressValid;

      if (amountBN.gt(0)) {
        if (amountBN.gt(balanceBN)) {
          messages.push(t(translations.erc20Bridge.form.insufficientBalance));
        }
        if (amountBN.lt(minBN)) {
          messages.push(
            t(translations.erc20Bridge.form.belowMinimum, {
              min: `${ethers.utils.formatUnits(minBN)} ${getTokenDisplayName(
                asset,
              )}`,
            }),
          );
        }
        if (amountBN.gt(maxBN)) {
          messages.push(
            t(translations.erc20Bridge.form.aboveMaximum, {
              max: `${ethers.utils.formatUnits(maxBN)} ${getTokenDisplayName(
                asset,
              )}`,
            }),
          );
        }
      }

      if (!isAddressValid) {
        messages.push(t(translations.erc20Bridge.form.invalidReceiver));
      }

      return { isValid, messages };
    } catch (error) {
      console.error('Error in validation:', error);
      return {
        isValid: false,
        messages: [t(translations.erc20Bridge.form.invalidNumberFormat)],
      };
    }
  }, [balance, limits, amount, receiver, asset]);
}
