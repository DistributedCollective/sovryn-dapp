import React, { FC, useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  Select,
} from '@sovryn/ui';

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { TransactionStepDialog } from '../../3_organisms';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';
import { bassets, tokenOptions } from './ConvertPage.types';
import { useGetDefaultSourceToken } from './hooks/useGetDefaultSourceToken';
import { useGetMaximumAvailableAmount } from './hooks/useGetMaximumAvailableAmount';
import { useHandleSubmit } from './hooks/useHandleSubmit';

const commonTranslations = translations.common;
const pageTranslations = translations.convertPage;

const ConvertPage: FC = () => {
  const { t } = useTranslation();
  const { account } = useAccount();

  const defaultSourceToken = useGetDefaultSourceToken();

  const [amount, setAmount] = useState('0');
  const [sourceToken, setSourceToken] =
    useState<SupportedTokens>(defaultSourceToken);

  const tokenOptionsWithoutSourceToken = useMemo(
    () => tokenOptions.filter(item => item.value !== sourceToken),
    [sourceToken],
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

  const maximumAmountToConvert = useGetMaximumAvailableAmount(sourceToken);

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
  }, [sourceToken]);

  const handleSubmit = useHandleSubmit(sourceToken, destinationToken, amount);

  const isSubmitDisabled = useMemo(
    () =>
      !account ||
      !amount ||
      Number(amount) <= 0 ||
      Number(amount) > Number(maximumAmountToConvert),
    [account, amount, maximumAmountToConvert],
  );

  return (
    <div className="w-full flex flex-col items-center mt-9 sm:mt-24">
      <Heading>{t(pageTranslations.title)}</Heading>
      <Paragraph className="mt-4">{t(pageTranslations.subtitle)}</Paragraph>

      <div className="mt-12 w-full p-0 sm:border sm:border-gray-50 sm:rounded sm:w-[28rem] sm:p-6 sm:bg-gray-90">
        <div className="bg-gray-80 rounded p-6">
          <div className="w-full flex flex-row justify-between items-center">
            <Paragraph size={ParagraphSize.base}>
              {t(pageTranslations.form.convertFrom)}
            </Paragraph>

            <button
              onClick={onMaximumAmountClick}
              className="text-gray-20 text-xs font-medium underline whitespace-nowrap"
            >
              ({t(commonTranslations.max)}{' '}
              {formatValue(Number(maximumAmountToConvert), 4)}{' '}
              {sourceToken.toUpperCase()})
            </button>
          </div>

          <div className="w-full flex flex-row justify-between items-center gap-3  mt-3.5">
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              maxAmount={Number(maximumAmountToConvert)}
              label={t(commonTranslations.amount)}
              tooltip={t(pageTranslations.form.sourceAmountTooltip)}
              min={0}
              className="w-full flex-grow-0 flex-shrink"
            />
            <Select
              value={sourceToken}
              onChange={onSourceTokenChange}
              options={tokenOptions}
              labelRenderer={() => (
                <AssetRenderer showAssetLogo asset={sourceToken} />
              )}
              className="min-w-min"
            />
          </div>
        </div>

        <div className="flex justify-center rounded-full -mt-3.5">
          <button
            className="w-11 h-11 rounded-full bg-gray-90 flex justify-center items-center"
            onClick={onSwitchClick}
          >
            <Icon icon={IconNames.PENDING} className="text-gray-50" size={24} />
          </button>
        </div>

        <div className="bg-gray-80 rounded p-6 -mt-3.5">
          <Paragraph size={ParagraphSize.base}>
            {t(pageTranslations.form.convertTo)}
          </Paragraph>

          <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
            <AmountInput
              value={amount}
              label={t(commonTranslations.amount)}
              readOnly
              className="w-full flex-grow-0 flex-shrink"
            />
            <Select
              value={destinationToken}
              onChange={setDestinationToken}
              options={destinationTokenOptions}
              labelRenderer={() => (
                <AssetRenderer showAssetLogo asset={destinationToken} />
              )}
              className="min-w-min"
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
        />
      </div>
      <TransactionStepDialog />
    </div>
  );
};

export default ConvertPage;
