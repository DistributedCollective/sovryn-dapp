import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';

import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';
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

import { RSK_CHAIN_ID } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../2_molecules/MaxButton/MaxButton';
import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { TOKEN_RENDER_PRECISION } from '../../../constants/currencies';
import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../hooks/useAccount';
import { useAmountInput } from '../../../hooks/useAmountInput';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { useGetRBTCPrice } from '../../../hooks/zero/useGetRBTCPrice';
import { useGetTroves } from '../../../hooks/zero/useGetTroves';
import { useUnderCollateralizedTrovesExist } from '../../../hooks/zero/useUnderCollateralizedTrovesExist';
import { translations } from '../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../utils/asset';
import { formatValue, decimalic } from '../../../utils/math';
import { tokenList } from './EarnPage.types';
import { useGetSubsidiesAPR } from './hooks/useGetSubsidiesAPR';
import { useHandleStabilityDeposit } from './hooks/useHandleStabilityDeposit';

const commonTranslations = translations.common;
const pageTranslations = translations.earnPage;

const EarnPage: FC = () => {
  const [index, setIndex] = useState(0);
  const [amountInput, setAmount, amount] = useAmountInput('');
  const [poolBalance, setPoolBalance] = useState(Decimal.ZERO);
  const [ZUSDInStabilityPool, setZUSDInStabilityPool] = useState(Decimal.ZERO);
  const [rewardsAmount, setRewardsAmount] = useState(Decimal.ZERO);
  const [token, setToken] = useState<string>(COMMON_SYMBOLS.ZUSD);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const { apy } = useGetSubsidiesAPR();

  const { account } = useAccount();
  const { value: block } = useBlockNumber();
  const { price } = useGetRBTCPrice();
  const {
    data: troves,
    loading: loadingTroves,
    refetch: refetchTroves,
  } = useGetTroves();
  const { invalidChain } = useRequiredChain();

  const [shouldCheckTroves, setShouldCheckTroves] = useState(true);
  const underCollateralizedTrovesExist =
    useUnderCollateralizedTrovesExist(troves);

  const isUnderCollateralized = useMemo(
    () => shouldCheckTroves && underCollateralizedTrovesExist,
    [shouldCheckTroves, underCollateralizedTrovesExist],
  );

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
    if (!account) {
      return;
    }

    liquity
      .getStabilityDeposit(account)
      .then(result =>
        setRewardsAmount(decimalic(result.collateralGain.toString())),
      );
  }, [liquity, account, price, block]);

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
    (value: string) => {
      setToken(value);
      setAmount('');
    },
    [setAmount],
  );

  const { weiBalance: zusdWeiBalance } = useAssetBalance(COMMON_SYMBOLS.ZUSD);
  const { weiBalance: dllrWeiBalance } = useAssetBalance(COMMON_SYMBOLS.DLLR);

  useEffect(() => {
    if (
      isDeposit &&
      Number(zusdWeiBalance) > 0 &&
      Number(dllrWeiBalance) === 0
    ) {
      setToken(COMMON_SYMBOLS.ZUSD);
    } else {
      setToken(COMMON_SYMBOLS.DLLR);
    }
  }, [dllrWeiBalance, zusdWeiBalance, isDeposit, isLoading]);

  const getAssetRenderer = useCallback(
    (token: string) => (
      <AssetRenderer showAssetLogo asset={token} assetClassName="font-medium" />
    ),
    [],
  );

  useEffect(() => setAmount(''), [isDeposit, setAmount]);

  const maximumAmount = useMemo(() => {
    if (!account) {
      return '';
    }
    return isDeposit ? balance : poolBalance;
  }, [balance, isDeposit, poolBalance, account]);

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
        suffix={COMMON_SYMBOLS.ZUSD}
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
    () => actionLocked || (dllrLocked && token === COMMON_SYMBOLS.DLLR),
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
      isUnderCollateralized ||
      invalidChain,
    [
      account,
      amount,
      loadingTroves,
      isValidAmount,
      isInMaintenance,
      isUnderCollateralized,
      invalidChain,
    ],
  );

  const handleSubmit = useCallback(() => {
    if (!isSubmitDisabled) {
      handleSubmitStabilityDeposit();
    }
  }, [isSubmitDisabled, handleSubmitStabilityDeposit]);

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
    if (index !== 1 || isInMaintenance) {
      setShouldCheckTroves(false);
    }
  }, [index, isInMaintenance]);

  useEffect(() => {
    if (!account) {
      setAmount('');
      setPoolBalance(Decimal.ZERO);
    }
  }, [account, setAmount, setPoolBalance]);

  return (
    <>
      <Helmet>
        <title>{t(translations.earnPage.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10">
        <NetworkBanner
          requiredChainId={RSK_CHAIN_ID}
          childClassName="flex flex-col items-center text-gray-10"
        >
          <Heading className="text-center mb-4 lg:text-2xl">
            {t(pageTranslations.title)}
          </Heading>
          <Paragraph
            className="text-center mb-6 lg:mb-10"
            size={ParagraphSize.base}
          >
            {t(pageTranslations.subtitle)}
          </Paragraph>

          <div className="w-full p-0 sm:border sm:border-gray-50 sm:rounded sm:w-[28rem] sm:p-6 sm:bg-gray-90">
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
                disabled={!account || isUnderCollateralized}
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
            {!isValidAmount && account && (
              <ErrorBadge
                level={ErrorLevel.Critical}
                message={t(pageTranslations.form.invalidAmountError)}
                dataAttribute="earn-amount-input-error"
              />
            )}

            <SimpleTable className="mt-3">
              <SimpleTableRow
                label={t(pageTranslations.subsidiesRewardRate)}
                valueClassName={classNames('transition-colors', {
                  'text-primary-10': !isAmountZero,
                })}
                value={`${formatValue(apy, 2)}% ${t(pageTranslations.apr)}`}
              />
            </SimpleTable>

            <SimpleTable className="mt-3">
              <SimpleTableRow
                label={t(pageTranslations.currentPoolBalance)}
                value={
                  <AmountRenderer
                    value={poolBalance}
                    suffix={COMMON_SYMBOLS.ZUSD}
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
            {isUnderCollateralized && (
              <ErrorBadge
                level={ErrorLevel.Critical}
                message={t(translations.earnPage.form.undercollateralized)}
              />
            )}
          </div>
        </NetworkBanner>
      </div>
    </>
  );
};

export default EarnPage;
