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
import { translations } from '../../../../../../locales/i18n';
import { fromWei, toWei } from '../../../../../../utils/math';
import {
  GAS_LIMIT_RUNE_BRIDGE_WITHDRAW,
  WITHDRAW_FEE_RUNE_PERCENTAGE,
  WITHDRAW_FEE_BASE_CURRENCY_BTC,
  WITHDRAW_MIN_AMOUNT,
  WITHDRAW_MAX_AMOUNT,
} from '../../../constants';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useContractService } from '../../../hooks/useContractService';
import { useRuneBridgeLocked } from '../../../hooks/useRuneBridgeLocked';
import { TransferPolicies } from '../../TransferPolicies';

export const AmountForm: React.FC = () => {
  const { amount, limits, selectedToken, set } = useContext(SendFlowContext);
  const { tokenBalances } = useContractService();
  const runeBridgeLocked = useRuneBridgeLocked();

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
    const limit = parseUnits(limits.max.toString(), 10);
    const tokenBalance = tokenBalances.find(token => {
      return token.tokenContractAddress === selectedToken.tokenContractAddress;
    });
    if (!tokenBalance) {
      return limit;
    }
    const maxAmountWei = toWei(tokenBalance.balance, tokenBalance.decimals);
    return limit.gt(maxAmountWei) ? limit : maxAmountWei;
  }, [limits.max, selectedToken.tokenContractAddress, tokenBalances]);

  const maxExceed = useMemo(() => {
    if (value === '' || value === '0') {
      return false;
    }
    return toWei(value).gt(maxAmount);
  }, [maxAmount, value]);

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
            max: Number(selectedToken.balance),
          },
        }));
      }
    },
    [set, tokenBalances],
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
              onChange={e => onSelectToken(e)}
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
        <div className="mt-4">
          <TransferPolicies
            minimumAmount={`${WITHDRAW_MIN_AMOUNT} ${
              selectedToken?.symbol ?? 'RUNE'
            }`}
            maximumAmount={`${WITHDRAW_MAX_AMOUNT} ${
              selectedToken?.symbol ?? 'RUNE'
            }`}
            serviceFee={`${WITHDRAW_FEE_RUNE_PERCENTAGE}% + ${WITHDRAW_FEE_BASE_CURRENCY_BTC} BTC`}
            className="mb-6"
          />
        </div>

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
