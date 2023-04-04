import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';

import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';
import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  ErrorBadge,
  ErrorLevel,
  Heading,
  Paragraph,
  ParagraphSize,
  Select,
  SimpleTable,
  SimpleTableRow,
  Tabs,
  TabSize,
  TabType,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../2_molecules/MaxButton/MaxButton';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
  TOKEN_RENDER_PRECISION,
} from '../../3_organisms/ZeroLocForm/constants';
import { useZeroData } from '../../3_organisms/ZeroLocForm/hooks/useZeroData';
import { useAccount } from '../../../hooks/useAccount';
import { useAmountInput } from '../../../hooks/useAmountInput';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { useGetRBTCPrice } from '../../../hooks/zero/useGetRBTCPrice';
import { useGetTroves } from '../../../hooks/zero/useGetTroves';
import { translations } from '../../../locales/i18n';
import { calculateCollateralRatio } from '../../../utils/helpers';
import { formatValue, decimalic } from '../../../utils/math';
import { tokenList } from './EarnPage.types';
import { useHandleStabilityDeposit } from './hooks/useHandleStabilityDeposit';

const commonTranslations = translations.common;
const pageTranslations = translations.earnPage;

const EarnPage: FC = () => {
  const [index, setIndex] = useState(0);
  const [amountInput, setAmount, amount] = useAmountInput('');
  const [poolBalance, setPoolBalance] = useState(Decimal.ZERO);
  const [ZUSDInStabilityPool, setZUSDInStabilityPool] = useState(Decimal.ZERO);
  const [rewardsAmount, setRewardsAmount] = useState(Decimal.ZERO);
  const [token, setToken] = useState<SupportedTokens>(SupportedTokens.dllr);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useAccount();
  const { value: block } = useBlockNumber();
  const { price } = useGetRBTCPrice();
  const { isRecoveryMode } = useZeroData(Decimal.from(price));
  const [isUnderCollateralized, setIsUnderCollateralized] = useState(false);
  const [showUnderCollateralizedError, setShowUnderCollateralizedError] =
    useState(false);

  const {
    data: troves,
    loading: loadingTroves,
    refetch: refetchTroves,
  } = useGetTroves();

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  useEffect(() => {
    refetchTroves();
  }, [refetchTroves, block]);

  const getStabilityDeposit = useCallback(() => {
    if (account) {
      setIsLoading(true);
      liquity
        .getStabilityDeposit(account)
        .then(result =>
          setPoolBalance(decimalic(result.currentZUSD.toString())),
        )
        .finally(() => setIsLoading(false));
    }
  }, [account, liquity]);

  useEffect(() => {
    getStabilityDeposit();
  }, [getStabilityDeposit]);

  const getZUSDInStabilityPool = useCallback(() => {
    liquity
      .getZUSDInStabilityPool()
      .then(result => setZUSDInStabilityPool(decimalic(result.toString())));
  }, [liquity]);

  useEffect(() => {
    getZUSDInStabilityPool();
  }, [getZUSDInStabilityPool]);

  useEffect(() => {
    liquity
      .getStabilityDeposit(account)
      .then(result =>
        setRewardsAmount(decimalic(result.collateralGain.toString())),
      );
  }, [liquity, account, block]);

  const hasRewardsToClaim = useMemo(
    () => Number(rewardsAmount) > 0,
    [rewardsAmount],
  );

  const actions = useMemo(() => {
    const tabs = [
      {
        label: t(commonTranslations.deposit),
        activeClassName: 'text-primary-20',
        dataAttribute: 'earn-deposit',
      },
    ];

    if (!poolBalance.isZero()) {
      tabs.push({
        label: t(commonTranslations.withdraw),
        activeClassName: 'text-primary-20',
        dataAttribute: 'earn-withdraw',
      });
    } else {
      setIndex(0);
    }

    return tabs;
  }, [poolBalance]);

  const isDeposit = useMemo(() => index === 0, [index]);

  const { checkMaintenance, States } = useMaintenance();
  const actionLocked = checkMaintenance(
    isDeposit ? States.ZERO_STABILITY_ADD : States.ZERO_STABILITY_REMOVE,
  );
  const dllrLocked = checkMaintenance(States.ZERO_DLLR);

  const { weiBalance } = useAssetBalance(token);

  const balance = useMemo(
    () => Decimal.fromBigNumberString(weiBalance),
    [weiBalance],
  );

  const onTokenChange = useCallback(
    (value: SupportedTokens) => {
      setToken(value);
      setAmount('');
    },
    [setAmount],
  );

  const { weiBalance: zusdWeiBalance } = useAssetBalance(SupportedTokens.zusd);
  const { weiBalance: dllrWeiBalance } = useAssetBalance(SupportedTokens.dllr);

  useEffect(() => {
    if (
      isDeposit &&
      Number(zusdWeiBalance) > 0 &&
      Number(dllrWeiBalance) === 0
    ) {
      setToken(SupportedTokens.zusd);
    } else {
      setToken(SupportedTokens.dllr);
    }
  }, [dllrWeiBalance, zusdWeiBalance, isDeposit, isLoading]);

  const getAssetRenderer = useCallback(
    (token: SupportedTokens) => (
      <AssetRenderer showAssetLogo asset={token} assetClassName="font-medium" />
    ),
    [],
  );

  useEffect(() => setAmount(''), [isDeposit, setAmount]);

  const maximumAmount = useMemo(
    () => (isDeposit ? balance : poolBalance),
    [balance, isDeposit, poolBalance],
  );

  const onMaximumAmountClick = useCallback(
    () => setAmount(maximumAmount.toString()),
    [maximumAmount, setAmount],
  );

  const onTransactionSuccess = useCallback(() => {
    getStabilityDeposit();
    getZUSDInStabilityPool();
    setAmount('0');
  }, [getStabilityDeposit, getZUSDInStabilityPool, setAmount]);

  const handleSubmitStabilityDeposit = useHandleStabilityDeposit(
    token,
    decimalic(amount),
    hasRewardsToClaim,
    isDeposit,
    onTransactionSuccess,
  );

  const poolShare = useMemo(() => {
    if (ZUSDInStabilityPool.isZero()) {
      return Decimal.ZERO;
    }
    return poolBalance.div(ZUSDInStabilityPool).mul(100);
  }, [ZUSDInStabilityPool, poolBalance]);

  const isAmountZero = useMemo(() => {
    return Number(amount) === 0;
  }, [amount]);

  const newPoolBalance = useMemo(() => {
    let newBalance = poolBalance;
    if (isDeposit) {
      newBalance = newBalance.add(amount);
    } else {
      newBalance = newBalance.sub(amount);
    }
    if (newBalance.lt(0)) {
      return Decimal.ZERO;
    }
    return newBalance;
  }, [poolBalance, isDeposit, amount]);

  const newPoolBalanceLabel = useMemo(() => {
    if (isAmountZero) {
      return t(commonTranslations.na);
    }

    return (
      <AmountRenderer
        value={newPoolBalance}
        suffix={SupportedTokens.zusd}
        precision={TOKEN_RENDER_PRECISION}
      />
    );
  }, [isAmountZero, newPoolBalance]);

  const newPoolShare = useMemo(() => {
    if (isAmountZero) {
      return t(commonTranslations.na);
    }

    let newZUSDInStabilityPool = ZUSDInStabilityPool;
    if (isDeposit) {
      newZUSDInStabilityPool = newZUSDInStabilityPool.add(amount);
    } else {
      newZUSDInStabilityPool = newZUSDInStabilityPool.sub(amount);
    }

    if (newZUSDInStabilityPool.isZero()) {
      return '0 %';
    }
    return `${formatValue(
      newPoolBalance.div(newZUSDInStabilityPool).mul(100),
      4,
    )} %`;
  }, [ZUSDInStabilityPool, amount, isAmountZero, isDeposit, newPoolBalance]);

  const isValidAmount = useMemo(
    () => Number(amount) <= Number(maximumAmount),
    [amount, maximumAmount],
  );

  const isInMaintenance = useMemo(
    () => actionLocked || (dllrLocked && token === SupportedTokens.dllr),
    [actionLocked, dllrLocked, token],
  );

  const isSubmitDisabled = useMemo(
    () =>
      !account ||
      !amount ||
      loadingTroves ||
      Number(amount) <= 0 ||
      !isValidAmount ||
      isInMaintenance ||
      isUnderCollateralized,
    [
      account,
      amount,
      isValidAmount,
      isInMaintenance,
      loadingTroves,
      isUnderCollateralized,
    ],
  );

  const handleSubmit = useCallback(() => {
    if (isUnderCollateralized) {
      setShowUnderCollateralizedError(true);
      return;
    }
    if (!isSubmitDisabled) {
      handleSubmitStabilityDeposit();
    }
  }, [isSubmitDisabled, handleSubmitStabilityDeposit, isUnderCollateralized]);

  const tokenOptions = useMemo(
    () =>
      tokenList.map(token => ({
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

  useEffect(() => {
    if (index || amount || token) {
      setShowUnderCollateralizedError(false);
    }
  }, [amount, token, index]);

  useEffect(() => {
    if (index === 1 && troves?.troves && !isInMaintenance) {
      const isLowTroveExists = troves.troves.reduce(
        (acc, { collateral, debt }) => {
          const collateralRatio = calculateCollateralRatio(
            Number(collateral),
            Number(debt),
            Number(price),
          );

          const isRatioBelowThreshold = isRecoveryMode
            ? Decimal.from(collateralRatio).lt(CRITICAL_COLLATERAL_RATIO)
            : Decimal.from(collateralRatio).lt(MINIMUM_COLLATERAL_RATIO);

          return acc || isRatioBelowThreshold;
        },
        false,
      );

      setIsUnderCollateralized(isLowTroveExists);
    }
  }, [troves, index, price, isRecoveryMode, isInMaintenance]);

  return (
    <>
      <Helmet>
        <title>{t(translations.earnPage.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10 mt-9 sm:mt-24">
        <Heading className="text-base sm:text-2xl">
          {t(pageTranslations.title)}
        </Heading>
        <Paragraph
          size={ParagraphSize.base}
          className="mt-2.5 sm:mt-4 sm:text-base"
        >
          {t(pageTranslations.subtitle)}
        </Paragraph>

        <div className="mt-12 w-full p-0 sm:border sm:border-gray-50 sm:rounded sm:w-[28rem] sm:p-6 sm:bg-gray-90">
          <div className="w-full flex flex-row justify-between items-center mb-4">
            <Tabs
              size={TabSize.small}
              type={TabType.secondary}
              items={actions}
              onChange={setIndex}
              index={index}
              className={classNames({
                invisible: poolBalance.isZero(),
              })}
            />

            <MaxButton
              onClick={onMaximumAmountClick}
              value={maximumAmount}
              token={token}
              dataAttribute="earn-max-button"
            />
          </div>

          <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
            <AmountInput
              value={amountInput}
              onChangeText={setAmount}
              label={t(translations.common.amount)}
              min={0}
              max={maximumAmount.toString()}
              disabled={!account}
              invalid={!isValidAmount}
              className="w-full flex-grow-0 flex-shrink"
              dataAttribute="earn-amount-input"
              placeholder="0"
            />

            <Select
              value={token}
              onChange={onTokenChange}
              options={tokenOptions}
              labelRenderer={() => getAssetRenderer(token)}
              className="min-w-[6.7rem]"
              dataAttribute="earn-token-select"
            />
          </div>
          {!isValidAmount && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={t(pageTranslations.form.invalidAmountError)}
              dataAttribute="earn-amount-input-error"
            />
          )}

          <SimpleTable className="mt-3">
            <SimpleTableRow
              label={t(pageTranslations.currentPoolBalance)}
              value={
                <AmountRenderer
                  value={poolBalance}
                  suffix={SupportedTokens.zusd}
                  precision={TOKEN_RENDER_PRECISION}
                />
              }
            />
            <SimpleTableRow
              label={t(pageTranslations.currentPoolShare)}
              value={`${formatValue(poolShare, 4)} %`}
            />
          </SimpleTable>
          <SimpleTable className="mt-3">
            <SimpleTableRow
              label={t(pageTranslations.newPoolBalance)}
              valueClassName={classNames('transition-colors', {
                'text-primary-10': !isAmountZero,
              })}
              value={newPoolBalanceLabel}
            />
            <SimpleTableRow
              label={t(pageTranslations.newPoolShare)}
              valueClassName={classNames('transition-colors', {
                'text-primary-10': !isAmountZero,
              })}
              value={newPoolShare}
            />
          </SimpleTable>
          <Button
            type={ButtonType.reset}
            style={ButtonStyle.primary}
            text={t(commonTranslations.buttons.confirm)}
            className={classNames('w-full mt-8', {
              'opacity-30 cursor-not-allowed bg-primary': isSubmitDisabled,
            })}
            onClick={handleSubmit}
            dataAttribute="earn-submit"
          />
          {isInMaintenance && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
          {showUnderCollateralizedError && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={t(translations.earnPage.form.undercollateralized)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EarnPage;
