import React, { FC, useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import { getAssetData } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/onboard-common';
import { SwapRoute } from '@sovryn/sdk';
import { SmartRouter } from '@sovryn/sdk';
import {
  Accordion,
  AmountInput,
  applyDataAttr,
  Button,
  ButtonStyle,
  ButtonType,
  Checkbox,
  ErrorBadge,
  ErrorLevel,
  Heading,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  SelectOption,
  SimpleTable,
  SimpleTableRow,
  TooltipTrigger,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../2_molecules/MaxButton/MaxButton';
import { TradingChart } from '../../2_molecules/TradingChart/TradingChart';
import { BOB_MIGRATION_LINK } from '../../3_organisms/RuneBridgeDialog/constants';
import { TOKEN_RENDER_PRECISION, USD } from '../../../constants/currencies';
import {
  getBobDeprecatedAssetTooltips,
  getTokenDisplayName,
} from '../../../constants/tokens';
import { useAccount } from '../../../hooks/useAccount';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { useDollarValue } from '../../../hooks/useDollarValue';
import { useWeiAmountInput } from '../../../hooks/useWeiAmountInput';
import { translations } from '../../../locales/i18n';
import {
  COMMON_SYMBOLS,
  findAsset,
  listAssetsOfChain,
} from '../../../utils/asset';
import { isBobChain } from '../../../utils/chain';
import { removeTrailingZerosFromString } from '../../../utils/helpers';
import { decimalic, fromWei, toWei } from '../../../utils/math';
import {
  CATEGORY_TOKENS,
  DEFAULT_SLIPPAGE_TOLERANCE,
  DEFAULT_SWAP_DESTINATIONS,
  FIXED_MYNT_RATE,
  FIXED_RATE_ROUTES,
  MAXIMUM_ALLOWED_SLIPPAGE,
  MYNT_TOKEN,
} from './ConvertPage.constants';
import {
  DEFAULT_SWAP_ENTRIES,
  SMART_ROUTER_STABLECOINS,
  SWAP_ROUTES,
} from './ConvertPage.constants';
import { CategoryType } from './ConvertPage.types';
import { AssetDropdownWithFilters } from './components/AssetDropdownWithFilters/AssetDropdownWithFilters';
import { useConversionMaintenance } from './hooks/useConversionMaintenance';
import { useGetMaximumAvailableAmount } from './hooks/useGetMaximumAvailableAmount';
import { useHandleConversion } from './hooks/useHandleConversion';

const commonTranslations = translations.common;
const pageTranslations = translations.convertPage;

const ConvertPage: FC = () => {
  const currentChainId = useCurrentChain();

  const [hasQuoteError, setHasQuoteError] = useState(false);

  const smartRouter = useMemo(
    () => new SmartRouter(getProvider(currentChainId), SWAP_ROUTES),
    [currentChainId],
  );

  const [slippageWarningAccepted, setSlippageWarningAccepted] = useState(false);

  const [sourceCategories, setSourceCategories] = useState<CategoryType[]>([
    CategoryType.All,
  ]);

  const [destinationCategories, setDestinationCategories] = useState<
    CategoryType[]
  >([CategoryType.All]);

  const tokensToOptions = useCallback(
    (
      addresses: string[],
      chain: ChainId,
      callback: (options: SelectOption<string>[]) => void,
      categories: CategoryType[],
    ) => {
      Promise.all(
        addresses
          .filter(
            // filter out WBTC token on RSK chain
            item =>
              findAsset('WBTC', RSK_CHAIN_ID).address.toLowerCase() !==
              item.toLowerCase(),
          )
          .map(address => smartRouter.getTokenDetails(address, chain)),
      ).then(tokens => {
        const tokensWithCategories = tokens.map(token => {
          const category = Object.keys(CATEGORY_TOKENS).find(type =>
            CATEGORY_TOKENS[type].includes(token.symbol),
          ) as CategoryType;
          return { ...token, category };
        });

        const filteredTokens = tokensWithCategories.filter(token => {
          if (categories.includes(CategoryType.BTC)) {
            if (
              token.symbol.toUpperCase() === CategoryType.BTC ||
              token.symbol.includes(CategoryType.BTC)
            ) {
              return true;
            }
          }

          return (
            categories.includes(token.category) ||
            categories.includes(CategoryType.All)
          );
        });

        callback(
          filteredTokens.map(token => ({
            value: token.symbol,
            label: (
              <AssetRenderer
                showAssetLogo
                asset={token.symbol}
                chainId={chain}
                assetClassName="font-medium"
              />
            ),
          })),
        );
      });
    },
    [smartRouter],
  );

  const { account } = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromToken = searchParams.get('from') || '';
  const toToken = searchParams.get('to') || '';
  const categoryFromToken = searchParams.get('categoryFrom') || '';
  const categoryToToken = searchParams.get('categoryTo') || '';
  const { balance: myntBalance } = useAssetBalance(MYNT_TOKEN);

  const parsedSourceCategories = useMemo(
    () =>
      categoryFromToken ? categoryFromToken.split(',') : [CategoryType.All],
    [categoryFromToken],
  );

  const parsedDestinationCategories = useMemo(
    () => (categoryToToken ? categoryToToken.split(',') : [CategoryType.All]),
    [categoryToToken],
  );

  const [slippageTolerance, setSlippageTolerance] = useState(
    DEFAULT_SLIPPAGE_TOLERANCE,
  );

  const [priceInQuote, setPriceQuote] = useState(false);
  const hasMyntBalance = useMemo(() => myntBalance.gt(0), [myntBalance]);
  const [amount, setAmount, weiAmount] = useWeiAmountInput('');

  const [quote, setQuote] = useState('');
  const [route, setRoute] = useState<SwapRoute | undefined>();

  const defaultSourceToken = useMemo(() => {
    if (fromToken) {
      const item = listAssetsOfChain(currentChainId).find(
        item => item.symbol.toLowerCase() === fromToken.toLowerCase(),
      );

      if (item) {
        return item.symbol;
      }
    }
    return DEFAULT_SWAP_ENTRIES[currentChainId] ?? COMMON_SYMBOLS.ETH;
  }, [currentChainId, fromToken]);

  const defaultDestinationToken = useMemo(() => {
    if (toToken) {
      const item = listAssetsOfChain(currentChainId).find(
        item => item.symbol.toLowerCase() === toToken.toLowerCase(),
      );

      if (item) {
        return item.symbol;
      }
    }
    return DEFAULT_SWAP_DESTINATIONS[currentChainId] ?? COMMON_SYMBOLS.SOV;
  }, [currentChainId, toToken]);

  const [sourceToken, setSourceToken] = useState<string>(defaultSourceToken);

  const handleCategorySelect = useCallback(
    (
      category: CategoryType,
      setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
    ) =>
      setCategories(prevCategories =>
        category === CategoryType.All
          ? [CategoryType.All]
          : prevCategories.includes(category)
          ? prevCategories.length === 1
            ? [CategoryType.All]
            : prevCategories.filter(prevCategory => prevCategory !== category)
          : [
              ...prevCategories.filter(
                prevCategory => prevCategory !== CategoryType.All,
              ),
              category,
            ],
      ),
    [],
  );

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(true);

  const [tokenOptions, setTokenOptions] = useState<SelectOption<string>[]>([]);

  const [destinationTokenOptions, setDestinationTokenOptions] = useState<
    SelectOption<string>[]
  >([]);

  useEffect(() => {
    const newToken = DEFAULT_SWAP_ENTRIES[currentChainId];
    if (!!newToken) {
      setAmount('');
      setSourceToken(newToken);
    }
  }, [currentChainId, setAmount]);

  useEffect(() => {
    smartRouter
      .getEntries(currentChainId)
      .then(tokens =>
        tokensToOptions(
          tokens,
          currentChainId,
          setTokenOptions,
          sourceCategories,
        ),
      );
  }, [currentChainId, smartRouter, tokensToOptions, sourceCategories]);

  useEffect(() => {
    (async () => {
      const sourceTokenDetails = await getAssetData(
        sourceToken,
        currentChainId,
      );
      smartRouter
        .getDestination(currentChainId, sourceTokenDetails.address)
        .then(tokens =>
          tokensToOptions(
            tokens,
            currentChainId,
            setDestinationTokenOptions,
            destinationCategories,
          ),
        );

      if (sourceToken === MYNT_TOKEN) {
        setDestinationToken(COMMON_SYMBOLS.SOV);
      }
    })();
  }, [
    currentChainId,
    smartRouter,
    sourceToken,
    tokensToOptions,
    destinationCategories,
  ]);

  const sourceTokenOptions = useMemo(
    () =>
      hasMyntBalance
        ? tokenOptions
        : tokenOptions.filter(option => option.value !== MYNT_TOKEN),
    [hasMyntBalance, tokenOptions],
  );

  const [destinationToken, setDestinationToken] = useState<string>(
    defaultDestinationToken,
  );

  const onTransactionSuccess = useCallback(() => setAmount(''), [setAmount]);

  const maximumAmountToConvert = useGetMaximumAvailableAmount(
    sourceToken,
    destinationToken,
  );

  const isValidAmount = useMemo(
    () => Number(amount) <= Number(maximumAmountToConvert),
    [amount, maximumAmountToConvert],
  );

  const isMyntFixRoute = useMemo(
    () => route && route.name === 'MyntFixedRate',
    [route],
  );

  const minimumReceived = useMemo(() => {
    if (!quote || !slippageTolerance || !route) {
      return '';
    }

    if (FIXED_RATE_ROUTES.includes(route.name)) {
      return quote;
    }

    return Decimal.from(quote)
      .mul(100 - Number(slippageTolerance))
      .div(100)
      .toString();
  }, [quote, route, slippageTolerance]);

  const { usdValue: minimumReceivedUsdValue } = useDollarValue(
    destinationToken,
    minimumReceived !== ''
      ? toWei(minimumReceived).toString()
      : Decimal.ZERO.toString(),
  );

  const renderMinimumReceived = useMemo(
    () => (
      <>
        <AmountRenderer
          value={minimumReceived}
          suffix={getTokenDisplayName(destinationToken)}
          precision={TOKEN_RENDER_PRECISION}
        />

        <span className="opacity-75">
          {' ('}
          <AmountRenderer
            value={minimumReceivedUsdValue}
            suffix={USD}
            showRoundingPrefix={false}
          />
          {')'}
        </span>
      </>
    ),
    [destinationToken, minimumReceived, minimumReceivedUsdValue],
  );

  const priceToken = useMemo<string>(() => {
    if (!destinationToken) {
      return sourceToken;
    }
    if (
      priceInQuote ||
      SMART_ROUTER_STABLECOINS.find(token => token === destinationToken)
    ) {
      return destinationToken;
    }
    return sourceToken;
  }, [destinationToken, sourceToken, priceInQuote]);

  const price = useMemo(() => {
    if (
      !quote ||
      !minimumReceived ||
      decimalic(quote).isZero() ||
      decimalic(amount).isZero()
    ) {
      return '';
    }

    if (isMyntFixRoute) {
      return FIXED_MYNT_RATE;
    }

    if (priceToken === destinationToken) {
      return decimalic(minimumReceived).div(amount).toString();
    } else {
      return decimalic(amount).div(minimumReceived).toString();
    }
  }, [
    amount,
    destinationToken,
    isMyntFixRoute,
    minimumReceived,
    priceToken,
    quote,
  ]);

  useEffect(() => {
    (async () => {
      setQuote('');
      setRoute(undefined);

      if (!sourceToken || !destinationToken || weiAmount.lte(0)) {
        return;
      }

      try {
        const [sourceTokenDetails, destinationTokenDetails] = await Promise.all(
          [
            getAssetData(sourceToken, currentChainId),
            getAssetData(destinationToken, currentChainId),
          ],
        );

        const result = await smartRouter.getBestQuote(
          currentChainId,
          sourceTokenDetails.address,
          destinationTokenDetails.address,
          weiAmount,
        );

        setRoute(result.route);
        const quote = removeTrailingZerosFromString(
          fromWei(result.quote.toString()),
        );
        setQuote(quote);
        setHasQuoteError(false);
      } catch {
        setHasQuoteError(true);
      }
    })();
  }, [sourceToken, destinationToken, weiAmount, currentChainId, smartRouter]);

  const onMaximumAmountClick = useCallback(
    () => setAmount(maximumAmountToConvert.toString()),
    [maximumAmountToConvert, setAmount],
  );

  const onSwitchClick = useCallback(() => {
    if (destinationToken) {
      setDestinationToken(sourceToken);
      setSourceToken(destinationToken);
      setHasQuoteError(false);
      setAmount('');
    }
    if (destinationToken) {
      setDestinationToken(sourceToken);
      setSourceToken(destinationToken);
      setHasQuoteError(false);
      setAmount('');
    }
  }, [destinationToken, setAmount, sourceToken]);

  const onSourceTokenChange = useCallback(
    (value: string) => {
      setSourceToken(value);
      setHasQuoteError(false);
      setAmount('');
    },
    [setAmount],
  );

  const onDestinationTokenChange = useCallback((value: string) => {
    setDestinationToken(value);
    setHasQuoteError(false);
  }, []);

  const { handleSubmit } = useHandleConversion(
    sourceToken,
    destinationToken,
    weiAmount,
    route,
    slippageTolerance,
    onTransactionSuccess,
  );

  const isInMaintenance = useConversionMaintenance(
    sourceToken,
    destinationToken,
    route,
  );

  const { usdValue: sourceUsdValue } = useDollarValue(
    sourceToken,
    weiAmount.toString(),
  );

  const renderDestinationAmount = useMemo(
    () => quote || t(commonTranslations.na),
    [quote],
  );

  const { usdValue: destinationUsdValue } = useDollarValue(
    destinationToken,
    quote !== '' ? toWei(renderDestinationAmount).toString() : '0',
  );

  const slippagePercent = useMemo(() => {
    if (
      !sourceUsdValue ||
      !destinationUsdValue ||
      Number(sourceUsdValue) === 0
    ) {
      return 0;
    }
    const diff = Number(sourceUsdValue) - Number(destinationUsdValue);
    return (diff / Number(sourceUsdValue)) * 100;
  }, [sourceUsdValue, destinationUsdValue]);

  const isSlippageHigh = useMemo(
    () => slippagePercent > MAXIMUM_ALLOWED_SLIPPAGE,
    [slippagePercent],
  );

  const isSubmitDisabled = useMemo(
    () =>
      isInMaintenance ||
      !account ||
      !amount ||
      Number(amount) <= 0 ||
      Number(amount) > Number(maximumAmountToConvert) ||
      !destinationToken ||
      !route ||
      (isSlippageHigh && !slippageWarningAccepted),
    [
      isInMaintenance,
      account,
      amount,
      maximumAmountToConvert,
      destinationToken,
      route,
      isSlippageHigh,
      slippageWarningAccepted,
    ],
  );

  const { usdValue: priceUsdValue } = useDollarValue(
    priceToken,
    price !== '' ? toWei(price).toString() : Decimal.ZERO.toString(),
  );

  const renderPriceAmount = useMemo(() => {
    if (price) {
      return (
        <>
          <AmountRenderer
            value={price}
            suffix={getTokenDisplayName(priceToken)}
            precision={TOKEN_RENDER_PRECISION}
            trigger={TooltipTrigger.hover}
          />

          <span className="opacity-75">
            {' ('}
            <AmountRenderer
              value={priceUsdValue}
              suffix={USD}
              showRoundingPrefix={false}
            />
            {')'}
          </span>
        </>
      );
    }
    return t(commonTranslations.na);
  }, [price, priceToken, priceUsdValue]);

  const renderPair = useMemo(
    () => `${sourceToken}/${destinationToken}/${currentChainId}`,
    [sourceToken, destinationToken, currentChainId],
  );

  const togglePriceQuote = useCallback(
    () => setPriceQuote(value => !value),
    [],
  );

  const isSlippageWarningVisible = useMemo(
    () => isSlippageHigh && quote,
    [isSlippageHigh, quote],
  );

  const deprecatedTooltips =
    isBobChain(currentChainId) &&
    (getBobDeprecatedAssetTooltips(sourceToken) ||
      getBobDeprecatedAssetTooltips(destinationToken));

  useEffect(() => {
    if (fromToken) {
      setSourceToken(fromToken);
    }
    if (toToken) {
      setDestinationToken(toToken);
    }
    if (categoryFromToken) {
      const sourceCategories = parsedSourceCategories.map(
        category => CategoryType[category] || CategoryType.All,
      );
      setSourceCategories(sourceCategories);
    }
    if (categoryToToken) {
      const destinationCategories = parsedDestinationCategories.map(
        category => CategoryType[category] || CategoryType.All,
      );
      setDestinationCategories(destinationCategories);
    }
  }, [
    fromToken,
    toToken,
    categoryFromToken,
    categoryToToken,
    parsedSourceCategories,
    parsedDestinationCategories,
  ]);

  useEffect(() => {
    if (hasMyntBalance && fromToken === MYNT_TOKEN) {
      setSourceToken(MYNT_TOKEN);
    } else if (!hasMyntBalance && fromToken === MYNT_TOKEN) {
      setSourceToken(COMMON_SYMBOLS.DLLR);
    }
  }, [hasMyntBalance, fromToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (sourceToken) {
      urlParams.set('from', sourceToken);
    } else {
      urlParams.delete('from');
    }

    if (destinationToken) {
      urlParams.set('to', destinationToken);
    } else {
      urlParams.delete('to');
    }

    if (sourceToken === destinationToken) {
      urlParams.delete('to');
    }

    if (
      sourceCategories.length > 0 &&
      !sourceCategories.includes(CategoryType.All)
    ) {
      urlParams.set('categoryFrom', sourceCategories.join(','));
    } else {
      urlParams.delete('categoryFrom');
    }

    if (
      destinationCategories.length > 0 &&
      !destinationCategories.includes(CategoryType.All)
    ) {
      urlParams.set('categoryTo', destinationCategories.join(','));
    } else {
      urlParams.delete('categoryTo');
    }

    if (sourceToken === destinationToken) {
      setDestinationToken('');
    }

    if (
      toToken !== destinationToken ||
      fromToken !== sourceToken ||
      categoryToToken !== destinationCategories.join(',') ||
      categoryFromToken !== sourceCategories.join(',')
    ) {
      setSearchParams(new URLSearchParams(urlParams));
    }
  }, [
    sourceToken,
    destinationToken,
    setSearchParams,
    toToken,
    fromToken,
    sourceCategories,
    destinationCategories,
    categoryToToken,
    categoryFromToken,
  ]);

  useEffect(() => {
    if (!account) {
      setHasQuoteError(false);
      setAmount('');
    }
  }, [account, setAmount]);

  // Set destination token if not already set and there is only one option
  useEffect(() => {
    if (
      sourceToken &&
      (!destinationToken ||
        !destinationTokenOptions.find(
          option => option.value === destinationToken,
        )) &&
      destinationTokenOptions.length === 1
    ) {
      setDestinationToken(destinationTokenOptions[0].value);
    }
  }, [sourceToken, destinationTokenOptions, destinationToken]);

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10 container mx-auto">
        <Heading className="text-center mb-4 lg:text-2xl">
          {t(pageTranslations.title)}
        </Heading>
        <Paragraph
          className="text-center mb-6 lg:mb-10"
          size={ParagraphSize.base}
        >
          {t(pageTranslations.subtitle)}
        </Paragraph>

        <div className="flex flex-col-reverse items-center lg:items-stretch lg:flex-row lg:space-x-6 xl:w-9/12 w-full">
          <TradingChart pair={renderPair} />

          <div className="p-0 sm:border sm:border-gray-50 sm:rounded lg:min-w-[28rem] sm:p-6 sm:bg-gray-90 lg:self-start h-full w-full sm:w-auto mb-6 lg:mb-0">
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
                  chainId={currentChainId}
                />
              </div>

              <div className="w-full flex flex-row justify-between items-start gap-3 mt-3.5">
                <div>
                  <AmountInput
                    value={amount}
                    onChangeText={setAmount}
                    label={t(commonTranslations.amount)}
                    min={0}
                    invalid={!isValidAmount}
                    disabled={!account}
                    className="w-full flex-grow-0 flex-shrink"
                    dataAttribute="convert-from-amount"
                    placeholder="0"
                  />

                  <div className="flex justify-end text-tiny text-gray-30 mt-1">
                    <AmountRenderer value={sourceUsdValue} suffix={USD} />
                  </div>
                </div>

                <AssetDropdownWithFilters
                  token={sourceToken}
                  selectedCategories={sourceCategories}
                  tokenOptions={sourceTokenOptions}
                  onCategorySelect={category =>
                    handleCategorySelect(category, setSourceCategories)
                  }
                  onTokenChange={onSourceTokenChange}
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

              <div className="w-full flex flex-row justify-between items-start gap-3 mt-3.5">
                <div>
                  <AmountInput
                    value={renderDestinationAmount}
                    label={t(commonTranslations.amount)}
                    readOnly
                    placeholder={t(commonTranslations.na)}
                    className="w-full flex-grow-0 flex-shrink"
                    dataAttribute="convert-to-amount"
                  />
                  <div
                    className={classNames(
                      {
                        'text-warning': isSlippageWarningVisible,
                      },
                      'flex justify-end text-tiny text-gray-30 mt-1',
                    )}
                  >
                    <AmountRenderer value={destinationUsdValue} suffix={USD} />
                  </div>
                </div>

                <AssetDropdownWithFilters
                  token={destinationToken}
                  selectedCategories={destinationCategories}
                  tokenOptions={destinationTokenOptions}
                  onCategorySelect={category =>
                    handleCategorySelect(category, setDestinationCategories)
                  }
                  onTokenChange={onDestinationTokenChange}
                  dataAttribute="convert-to-asset"
                />
              </div>
            </div>

            <Accordion
              className="mt-4 mb-3 text-xs"
              label={t(translations.common.advancedSettings)}
              open={showAdvancedSettings}
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              dataAttribute="convert-settings"
            >
              <div className="mt-2">
                <AmountInput
                  value={slippageTolerance}
                  onChange={e => setSlippageTolerance(e.target.value)}
                  label={t(pageTranslations.slippageTolerance)}
                  className="max-w-none w-full"
                  unit="%"
                  step="0.01"
                  decimalPrecision={2}
                  placeholder="0"
                  max="100"
                />
              </div>
            </Accordion>

            {sourceToken && destinationToken && quote ? (
              <SimpleTable className="mt-3">
                <SimpleTableRow
                  label={t(pageTranslations.minimumReceived)}
                  valueClassName="text-primary-10"
                  value={renderMinimumReceived}
                />
                <SimpleTableRow
                  label={t(pageTranslations.maximumPrice)}
                  valueClassName="text-primary-10"
                  className="cursor-pointer"
                  onClick={togglePriceQuote}
                  value={renderPriceAmount}
                />
              </SimpleTable>
            ) : null}

            {hasQuoteError && (
              <ErrorBadge
                level={ErrorLevel.Critical}
                message={t(pageTranslations.form.quoteError)}
                dataAttribute="convert-quote-error"
              />
            )}

            {isSlippageWarningVisible && (
              <div className="mt-4 bg-gray-80 rounded p-3 gap-3">
                <ErrorBadge
                  level={ErrorLevel.Warning}
                  message={t(pageTranslations.form.swapValueWarning)}
                />
                <Checkbox
                  checked={slippageWarningAccepted}
                  onChangeValue={setSlippageWarningAccepted}
                  label={t(pageTranslations.form.slippageWarning)}
                />
              </div>
            )}
            {deprecatedTooltips && (
              <div className="flex flex-col items-center mt-4 bg-gray-80 rounded p-3 gap-1">
                {deprecatedTooltips && (
                  <ErrorBadge
                    className="lg:max-w-80"
                    level={ErrorLevel.Warning}
                    message={t(deprecatedTooltips.convert)}
                  />
                )}
                <Button
                  text={t(translations.common.learnMore)}
                  style={ButtonStyle.ghost}
                  href={BOB_MIGRATION_LINK}
                  hrefExternal
                />
              </div>
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
      </div>
    </>
  );
};

export default ConvertPage;
