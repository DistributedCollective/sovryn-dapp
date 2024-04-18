import React, { useCallback, useContext, useMemo, useState } from 'react';

import { parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  Paragraph,
  Select,
} from '@sovryn/ui';

import { MaxButton } from '../../../../../2_molecules/MaxButton/MaxButton';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { BITCOIN } from '../../../../../../constants/currencies';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { translations } from '../../../../../../locales/i18n';
import { fromWei, toWei } from '../../../../../../utils/math';
import { GAS_LIMIT_RUNE_BRIDGE_WITHDRAW } from '../../../constants';
import { useRuneContext } from '../../../contexts/rune';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useRuneBridgeLocked } from '../../../hooks/useRuneBridgeLocked';
import { TransferPolicies } from '../../TransferPolicies';

export const AmountForm: React.FC = () => {
  const { amount, limits, selectedToken, set } = useContext(SendFlowContext);
  const { tokenBalances } = useRuneContext();
  const runeBridgeLocked = useRuneBridgeLocked();
  const runeBridgeContract = useGetProtocolContract('runeBridge');

  const [value, setValue] = useState(amount || '');

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        amount: Number(value).toFixed(8),
        step: SendFlowStep.ADDRESS,
      })),
    [set, value],
  );

  const maxAmount = useMemo(() => {
    const limitWei = parseUnits(limits.max.toString(), selectedToken.decimals);
    const tokenBalance = tokenBalances.find(
      token =>
        token.tokenContractAddress === selectedToken.tokenContractAddress,
    );
    if (!tokenBalance) {
      return limitWei;
    }
    const maxAmountWei = toWei(tokenBalance.balance, tokenBalance.decimals);
    return limitWei.lt(maxAmountWei) ? limitWei : maxAmountWei;
  }, [
    limits.max,
    selectedToken.tokenContractAddress,
    selectedToken.decimals,
    tokenBalances,
  ]);

  const maxExceed = useMemo(() => {
    if (value === '' || value === '0') {
      return false;
    }
    return toWei(value, selectedToken.decimals).gt(maxAmount);
  }, [maxAmount, selectedToken.decimals, value]);

  const tokenBalancesLoaded = tokenBalances.length > 0;
  const onMaximumAmountClick = useCallback(
    () => setValue(fromWei(maxAmount, selectedToken.decimals)),
    [maxAmount, selectedToken],
  );
  const onSelectToken = useCallback(
    (token: string) => {
      const selectedToken = tokenBalances.find(
        tokenBalance => tokenBalance.tokenContractAddress === token,
      );
      if (selectedToken) {
        set(prevState => ({
          ...prevState,
          selectedToken: selectedToken,
          limits: {
            ...prevState.limits,
            loading: true,
          },
        }));
        if (runeBridgeContract) {
          runeBridgeContract
            .getEvmToBtcTransferPolicy(token)
            .then(policy => {
              set(prevState => ({
                ...prevState,
                limits: {
                  min: Math.max(
                    Number(
                      fromWei(policy.minTokenAmount, selectedToken.decimals),
                    ),
                    1,
                  ),
                  max: Number(
                    fromWei(policy.maxTokenAmount, selectedToken.decimals),
                  ),
                  flatFeeTokens: Number(
                    fromWei(policy.flatFeeTokens, selectedToken.decimals),
                  ),
                  dynamicFeeTokens: Number(policy.dynamicFeeTokens) / 100,
                  flatFeeBaseCurrency: Number(
                    fromWei(policy.flatFeeBaseCurrency, 18),
                  ),
                  // this needs to be accurate so store the BN
                  flatFeeBaseCurrencyWei: policy.flatFeeBaseCurrency,
                  loading: false,
                },
              }));
            })
            .catch(console.error);
        }
      }
    },
    [set, tokenBalances, runeBridgeContract],
  );
  const options = tokenBalances.map(tokenBalance => {
    return {
      label: tokenBalance.name,
      value: tokenBalance.tokenContractAddress,
    };
  });

  const invalid = useMemo(() => {
    if (!value || value === '0' || !selectedToken.tokenContractAddress) {
      return true;
    }

    const amount = Number(value);
    const selectedTokenBalanceInWei = toWei(
      selectedToken.balance,
      selectedToken.decimals,
    );
    if (amount < 0 || amount < limits.min || amount > limits.max) {
      return true;
    }

    return toWei(amount, selectedToken.decimals)
      .add(GAS_LIMIT_RUNE_BRIDGE_WITHDRAW)
      .gt(selectedTokenBalanceInWei.add(GAS_LIMIT_RUNE_BRIDGE_WITHDRAW) || '0');
  }, [selectedToken, value, limits]);

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium mb-8 text-center">
        {t(translations.runeBridge.send.amountForm.title)}
      </Heading>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <Select
              onChange={onSelectToken}
              options={options}
              value={selectedToken.tokenContractAddress}
            />
          </div>
          <MaxButton
            onClick={onMaximumAmountClick}
            value={fromWei(maxAmount, selectedToken.decimals)}
            token={selectedToken.symbol}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="funding-send-amount-max"
          />
        </div>

        <div>
          <AmountInput
            label={t(translations.common.amount)}
            onChangeText={setValue}
            unit={selectedToken.symbol}
            value={value}
            decimalPrecision={TOKEN_RENDER_PRECISION}
            className="max-w-none"
            placeholder="0"
            invalid={maxExceed || !selectedToken.tokenContractAddress}
            disabled={!selectedToken.tokenContractAddress || runeBridgeLocked}
            dataAttribute="funding-send-amount-input"
          />
          {maxExceed && (
            <Paragraph className="text-error-light font-medium mt-2">
              {t(translations.runeBridge.send.addressForm.maxExceed)}
            </Paragraph>
          )}
        </div>
        {!limits.loading && (
          <div className="mt-4">
            <TransferPolicies
              minimumAmount={`${limits.min} ${selectedToken?.symbol ?? 'RUNE'}`}
              maximumAmount={`${limits.max} ${selectedToken?.symbol ?? 'RUNE'}`}
              serviceFee={[
                limits.dynamicFeeTokens ? `${limits.dynamicFeeTokens}%` : '',
                limits.flatFeeTokens
                  ? `${limits.flatFeeTokens} ${selectedToken.symbol}`
                  : '',
                limits.flatFeeBaseCurrency
                  ? `${limits.flatFeeBaseCurrency} ${BITCOIN}`
                  : '',
              ]
                .filter(x => x)
                .join(' + ')}
              className="mb-6"
            />
          </div>
        )}
        <Button
          text={t(translations.common.buttons.continue)}
          onClick={onContinueClick}
          disabled={!tokenBalancesLoaded || invalid || runeBridgeLocked} // {invalid || runeBridgeLocked}
          style={ButtonStyle.secondary}
          className="mt-10 w-full"
          dataAttribute="funding-send-amount-confirm"
        />

        {runeBridgeLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.runeBridge)}
            dataAttribute="funding-send-amount-confirm-error"
          />
        )}
      </div>
    </>
  );
};
