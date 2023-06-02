import React, { FC, useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { SwapRoute } from '@sovryn/sdk';
import {
  Accordion,
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
  SelectOption,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { defaultChainId } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../2_molecules/MaxButton/MaxButton';
import { TOKEN_RENDER_PRECISION } from '../../../constants/currencies';
import { useAccount } from '../../../hooks/useAccount';
import { useAmountInput } from '../../../hooks/useAmountInput';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { fromWei, toWei } from '../../../utils/math';
import { smartRouter, stableCoins } from './ConvertPage.types';
import { useGetDefaultSourceToken } from './hooks/useGetDefaultSourceToken';
import { useGetMaximumAvailableAmount } from './hooks/useGetMaximumAvailableAmount';
import { useHandleConversion } from './hooks/useHandleConversion';

const commonTranslations = translations.common;
const pageTranslations = translations.convertPage;

const tokensToOptions = (
  addresses: string[],
  callback: (options: SelectOption<SupportedTokens>[]) => void,
) =>
  Promise.all(
    addresses.map(address => smartRouter.getTokenDetails(address)),
  ).then(tokens =>
    callback(
      tokens.map(token => ({
        value: token.symbol,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token.symbol}
            assetClassName="font-medium"
          />
        ),
      })),
    ),
  );

const ConvertPage: FC = () => {
  const { account } = useAccount();
  const [slippageTolerance, setSlippageTolerance] = useState('0.5');

  const defaultSourceToken = useGetDefaultSourceToken();

  const [priceInQuote, setPriceQuote] = useState(false);
  const [amountInput, setAmount, amount] = useAmountInput('');
  const [quote, setQuote] = useState('');
  const [route, setRoute] = useState<SwapRoute | undefined>();

  const [sourceToken, setSourceToken] =
    useState<SupportedTokens>(defaultSourceToken);

  const { checkMaintenance, States } = useMaintenance();
  const convertLocked = checkMaintenance(States.ZERO_CONVERT);
  const dllrLocked = checkMaintenance(States.ZERO_DLLR);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [tokenOptions, setTokenOptions] = useState<
    SelectOption<SupportedTokens>[]
  >([]);

  const [destinationTokenOptions, setDestinationTokenOptions] = useState<
    SelectOption<SupportedTokens>[]
  >([]);

  useEffect(() => {
    smartRouter
      .getEntries()
      .then(tokens => tokensToOptions(tokens, setTokenOptions));
  }, []);

  useEffect(() => {
    (async () => {
      const sourceTokenDetails = await getTokenDetails(
        sourceToken,
        defaultChainId,
      );

      smartRouter
        .getDestination(sourceTokenDetails.address)
        .then(tokens => tokensToOptions(tokens, setDestinationTokenOptions));
    })();
  }, [sourceToken]);

  const [destinationToken, setDestinationToken] = useState<
    SupportedTokens | ''
  >('');
  const weiAmount = useMemo(() => toWei(amount), [amount]);

  const onTransactionSuccess = useCallback(() => setAmount(''), [setAmount]);

  const maximumAmountToConvert = useGetMaximumAvailableAmount(
    sourceToken,
    destinationToken as SupportedTokens,
  );

  const isValidAmount = useMemo(
    () => Number(amount) <= Number(maximumAmountToConvert),
    [amount, maximumAmountToConvert],
  );

  const minimumReceived = useMemo(() => {
    if (!quote || !slippageTolerance) {
      return '';
    }

    const tolerance = parseFloat(slippageTolerance).toFixed(3);

    return fromWei(
      toWei(quote)
        .mul((100 - Number(tolerance)) * 1000)
        .div(100 * 1000),
    );
  }, [quote, slippageTolerance]);

  const priceToken = useMemo<SupportedTokens>(() => {
    if (!destinationToken) {
      return sourceToken;
    }
    if (priceInQuote || stableCoins.find(token => token === destinationToken)) {
      return destinationToken;
    }
    return sourceToken;
  }, [destinationToken, sourceToken, priceInQuote]);

  const price = useMemo(() => {
    if (
      !quote ||
      !minimumReceived ||
      toWei(quote).isZero() ||
      toWei(amount).isZero()
    ) {
      return '';
    }

    if (priceToken === destinationToken) {
      return fromWei(toWei(minimumReceived, 36).div(toWei(amount)));
    } else {
      return fromWei(toWei(amount, 36).div(toWei(minimumReceived)));
    }
  }, [amount, destinationToken, minimumReceived, priceToken, quote]);

  useEffect(() => {
    (async () => {
      setQuote('');
      setRoute(undefined);

      if (!sourceToken || !destinationToken || weiAmount.lte(0)) {
        return;
      }

      const [sourceTokenDetails, destinationTokenDetails] = await Promise.all([
        getTokenDetails(sourceToken, defaultChainId),
        getTokenDetails(destinationToken, defaultChainId),
      ]);

      const result = await smartRouter.getBestQuote(
        sourceTokenDetails.address,
        destinationTokenDetails.address,
        weiAmount,
      );

      setRoute(result.route);
      setQuote(fromWei(result.quote.toString()));
    })();
  }, [sourceToken, destinationToken, weiAmount]);

  const onMaximumAmountClick = useCallback(
    () => setAmount(maximumAmountToConvert.toString()),
    [maximumAmountToConvert, setAmount],
  );

  const onSwitchClick = useCallback(() => {
    if (destinationToken) {
      setDestinationToken(sourceToken);
      setSourceToken(destinationToken as SupportedTokens);
      setAmount('');
    }
  }, [destinationToken, setAmount, sourceToken]);

  const onSourceTokenChange = useCallback(
    (value: SupportedTokens) => {
      setSourceToken(value);
      setAmount('');
    },
    [setAmount],
  );

  const getAssetRenderer = useCallback(
    (token: SupportedTokens) => (
      <AssetRenderer showAssetLogo asset={token} assetClassName="font-medium" />
    ),
    [],
  );

  const { handleSubmit } = useHandleConversion(
    sourceToken,
    destinationToken as SupportedTokens,
    weiAmount,
    route,
    onTransactionSuccess,
  );

  const isInMaintenance = useMemo(
    () =>
      convertLocked ||
      (dllrLocked &&
        [sourceToken, destinationToken].includes(SupportedTokens.dllr)),
    [convertLocked, destinationToken, dllrLocked, sourceToken],
  );

  const isSubmitDisabled = useMemo(
    () =>
      isInMaintenance ||
      !account ||
      !amount ||
      Number(amount) <= 0 ||
      Number(amount) > Number(maximumAmountToConvert) ||
      !destinationToken,
    [
      account,
      amount,
      maximumAmountToConvert,
      isInMaintenance,
      destinationToken,
    ],
  );

  const renderDestinationAmount = useMemo(
    () => quote || t(commonTranslations.na),
    [quote],
  );

  const renderPriceAmount = useMemo(() => {
    if (price) {
      return (
        <AmountRenderer
          value={price}
          suffix={priceToken}
          precision={TOKEN_RENDER_PRECISION}
        />
      );
    }
    return t(commonTranslations.na);
  }, [price, priceToken]);

  useEffect(() => {
    setSourceToken(defaultSourceToken);
  }, [defaultSourceToken]);

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>
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

              <MaxButton
                onClick={onMaximumAmountClick}
                value={maximumAmountToConvert}
                token={sourceToken}
                dataAttribute="convert-from-max"
              />
            </div>

            <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
              <AmountInput
                value={amountInput}
                onChangeText={setAmount}
                label={t(commonTranslations.amount)}
                min={0}
                invalid={!isValidAmount}
                disabled={!account}
                className="w-full flex-grow-0 flex-shrink"
                dataAttribute="convert-from-amount"
                placeholder="0"
              />

              <Select
                value={sourceToken}
                onChange={onSourceTokenChange}
                options={tokenOptions}
                labelRenderer={() => getAssetRenderer(sourceToken)}
                className="min-w-[6.7rem]"
                menuClassName="max-h-[20rem]"
                dataAttribute="convert-from-asset"
              />
            </div>

            {!isValidAmount && (
              <ErrorBadge
                level={ErrorLevel.Critical}
                message={t(pageTranslations.form.invalidAmountError)}
                dataAttribute="convert-from-amount-error"
              />
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
                className="text-gray-50 rotate-90"
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
                value={renderDestinationAmount}
                label={t(commonTranslations.amount)}
                readOnly
                placeholder={t(commonTranslations.na)}
                className="w-full flex-grow-0 flex-shrink"
                dataAttribute="convert-to-amount"
              />
              <Select
                value={destinationToken}
                onChange={setDestinationToken}
                options={destinationTokenOptions}
                className="min-w-[6.7rem]"
                menuClassName="max-h-[20rem]"
                dataAttribute="convert-to-asset"
              />
            </div>
          </div>

          {sourceToken && destinationToken && quote ? (
            <>
              <Accordion
                className="mt-4 mb-3 text-xs"
                label={t(translations.common.advancedSettings)}
                open={showAdvancedSettings}
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                dataAttribute="convert-settings"
              >
                <div className="mt-2 mb-4">
                  <AmountInput
                    value={slippageTolerance}
                    onChange={e => setSlippageTolerance(e.target.value)}
                    label={t(pageTranslations.slippageTolerance)}
                    className="max-w-none w-full"
                    unit="%"
                    step="0.001"
                    decimalPrecision={3}
                    placeholder="0"
                    max={100}
                  />
                </div>
              </Accordion>

              <SimpleTable className="mt-3">
                <SimpleTableRow
                  label={t(pageTranslations.minimumReceived)}
                  valueClassName="text-primary-10"
                  value={
                    <AmountRenderer
                      value={minimumReceived}
                      suffix={destinationToken}
                      precision={TOKEN_RENDER_PRECISION}
                    />
                  }
                />
                <SimpleTableRow
                  label={t(pageTranslations.maximumPrice)}
                  valueClassName="text-primary-10"
                  className="cursor-pointer"
                  onClick={() => setPriceQuote(value => !value)}
                  value={renderPriceAmount}
                />
              </SimpleTable>
            </>
          ) : (
            <SimpleTable className="mt-3">
              <SimpleTableRow
                label={t(pageTranslations.price)}
                valueClassName="text-primary-10"
                className="cursor-pointer"
                value={renderPriceAmount}
                onClick={() => setPriceQuote(value => !value)}
              />
            </SimpleTable>
          )}

          <Button
            type={ButtonType.reset}
            style={ButtonStyle.primary}
            text={t(commonTranslations.buttons.confirm)}
            className="w-full mt-8"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            dataAttribute="convert-confirm"
          />

          {isInMaintenance && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ConvertPage;
