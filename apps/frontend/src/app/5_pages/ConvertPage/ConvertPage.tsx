import React, { FC, useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { SupportedTokenList } from '@sovryn/contracts';
import {
  AmountInput,
  applyDataAttr,
  Button,
  ButtonStyle,
  ButtonType,
  ErrorBadge,
  ErrorLevel,
  Heading,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  Select,
} from '@sovryn/ui';

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { useAccount } from '../../../hooks/useAccount';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';
import { allowedTokens, bassets } from './ConvertPage.types';
import { useGetDefaultSourceToken } from './hooks/useGetDefaultSourceToken';
import { useGetMaximumAvailableAmount } from './hooks/useGetMaximumAvailableAmount';
import { useHandleConversion } from './hooks/useHandleConversion';

const commonTranslations = translations.common;
const pageTranslations = translations.convertPage;

const ConvertPage: FC = () => {
  const { t } = useTranslation();
  const { account } = useAccount();

  const defaultSourceToken = useGetDefaultSourceToken();

  const [amount, setAmount] = useState('0');
  const [sourceToken, setSourceToken] =
    useState<SupportedTokens>(defaultSourceToken);

  const { checkMaintenance, States } = useMaintenance();
  const convertLocked = checkMaintenance(States.ZERO_CONVERT);
  const dllrLocked = checkMaintenance(States.ZERO_DLLR);

  const tokenOptions = useMemo(
    () =>
      SupportedTokenList.filter(item =>
        allowedTokens.includes(item.symbol),
      ).map(token => ({
        value: token.symbol,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token.symbol}
            assetClassName="font-medium"
          />
        ),
      })),
    [],
  );

  const tokenOptionsWithoutSourceToken = useMemo(
    () => tokenOptions.filter(item => item.value !== sourceToken),
    [sourceToken, tokenOptions],
  );

  const [destinationTokenOptions, setDestinationTokenOptions] = useState(
    tokenOptionsWithoutSourceToken,
  );

  useEffect(() => {
    setDestinationTokenOptions(tokenOptionsWithoutSourceToken);
  }, [tokenOptionsWithoutSourceToken]);

  const [destinationToken, setDestinationToken] = useState<SupportedTokens>(
    destinationTokenOptions[0].value,
  );

  const maximumAmountToConvert = useGetMaximumAvailableAmount(
    sourceToken,
    destinationToken,
  );

  const isValidAmount = useMemo(
    () => Number(amount) <= Number(maximumAmountToConvert),
    [amount, maximumAmountToConvert],
  );

  const onMaximumAmountClick = useCallback(
    () => setAmount(maximumAmountToConvert),
    [maximumAmountToConvert],
  );

  const onSwitchClick = useCallback(() => {
    setDestinationToken(sourceToken);
    setSourceToken(destinationToken);
    setAmount('0');
  }, [destinationToken, sourceToken]);

  const onSourceTokenChange = useCallback((value: SupportedTokens) => {
    setSourceToken(value);
    setAmount('0');
  }, []);

  useEffect(() => {
    if (sourceToken === destinationToken) {
      if (destinationTokenOptions.length === 1) {
        setDestinationTokenOptions(tokenOptionsWithoutSourceToken);
      }
      setDestinationToken(tokenOptionsWithoutSourceToken[0].value);
    }
  }, [
    destinationToken,
    destinationTokenOptions,
    sourceToken,
    tokenOptionsWithoutSourceToken,
  ]);

  useEffect(() => {
    setSourceToken(defaultSourceToken);
  }, [defaultSourceToken]);

  useEffect(() => {
    if (bassets.includes(sourceToken)) {
      setDestinationToken(SupportedTokens.dllr);
      setDestinationTokenOptions(
        tokenOptions.filter(item => item.value === SupportedTokens.dllr),
      );
    }
  }, [sourceToken, tokenOptions]);

  const getAssetRenderer = useCallback(
    (token: SupportedTokens) => (
      <AssetRenderer showAssetLogo asset={token} assetClassName="font-medium" />
    ),
    [],
  );

  const { handleSubmit } = useHandleConversion(
    sourceToken,
    destinationToken,
    amount,
  );
  const locked = useMemo(
    () =>
      convertLocked ||
      (dllrLocked &&
        [sourceToken, destinationToken].includes(SupportedTokens.dllr)),
    [convertLocked, destinationToken, dllrLocked, sourceToken],
  );
  const isSubmitDisabled = useMemo(
    () =>
      locked ||
      !account ||
      !amount ||
      Number(amount) <= 0 ||
      Number(amount) > Number(maximumAmountToConvert),
    [account, amount, maximumAmountToConvert, locked],
  );

  return (
    <div className="w-full flex flex-col items-center text-gray-10 mt-9 sm:mt-24">
      <Heading className="text-base sm:text-2xl font-medium">
        {t(pageTranslations.title)}
      </Heading>
      <Paragraph
        size={ParagraphSize.base}
        className="mt-2.5 sm:mt-4 sm:text-base font-medium"
      >
        {t(pageTranslations.subtitle)}
      </Paragraph>

      <div className="mt-12 w-full p-0 sm:border sm:border-gray-50 sm:rounded sm:w-[28rem] sm:p-6 sm:bg-gray-90">
        <div className="bg-gray-80 rounded p-6">
          <div className="w-full flex flex-row justify-between items-center">
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(pageTranslations.form.convertFrom)}
            </Paragraph>

            <button
              onClick={onMaximumAmountClick}
              className="text-xs font-medium underline whitespace-nowrap"
              {...applyDataAttr('convert-from-max')}
            >
              ({t(commonTranslations.max)}{' '}
              {formatValue(Number(maximumAmountToConvert), 4)}{' '}
              {sourceToken.toUpperCase()})
            </button>
          </div>

          <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              label={t(commonTranslations.amount)}
              min={0}
              invalid={!isValidAmount}
              disabled={!account}
              className="w-full flex-grow-0 flex-shrink"
              dataAttribute="convert-from-amount"
            />

            <Select
              value={sourceToken}
              onChange={onSourceTokenChange}
              options={tokenOptions}
              labelRenderer={() => getAssetRenderer(sourceToken)}
              className="min-w-[6.7rem]"
              dataAttribute="convert-from-asset"
            />
          </div>

          {!isValidAmount && (
            <Paragraph className="text-error-light font-medium mt-2">
              {t(pageTranslations.form.invalidAmountError)}
            </Paragraph>
          )}
        </div>

        <div className="flex justify-center rounded-full -mt-3.5">
          <button
            className="w-11 h-11 rounded-full bg-gray-90 flex justify-center items-center"
            onClick={onSwitchClick}
            {...applyDataAttr('convert-swap-asset')}
          >
            <Icon
              icon={IconNames.PENDING}
              className="text-gray-50 rotate-90 -scale-x-100"
              size={24}
            />
          </button>
        </div>

        <div className="bg-gray-80 rounded p-6 -mt-3.5">
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(pageTranslations.form.convertTo)}
          </Paragraph>

          <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
            <AmountInput
              value={amount}
              label={t(commonTranslations.amount)}
              readOnly
              className="w-full flex-grow-0 flex-shrink"
              dataAttribute="convert-to-amount"
            />
            <Select
              value={destinationToken}
              onChange={setDestinationToken}
              options={destinationTokenOptions}
              labelRenderer={() => getAssetRenderer(destinationToken)}
              className="min-w-[6.7rem]"
              dataAttribute="convert-to-asset"
            />
          </div>
        </div>

        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text={t(commonTranslations.buttons.confirm)}
          className="w-full mt-8"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          dataAttribute="convert-confirm"
        />

        {locked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </div>
    </div>
  );
};

export default ConvertPage;
