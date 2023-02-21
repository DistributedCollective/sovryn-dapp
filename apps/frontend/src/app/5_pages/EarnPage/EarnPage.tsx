import { BigNumber } from '@ethersproject/bignumber';
import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { useLoaderData } from 'react-router-dom';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  applyDataAttr,
  Button,
  ButtonStyle,
  ButtonType,
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

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { useAccount } from '../../../hooks/useAccount';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { translations } from '../../../locales/i18n';
import { fromWei, toWei } from '../../../utils/math';
import { tokenList } from './EarnPage.types';
import { useHandleStabilityDeposit } from './hooks/useHandleStabilityDeposit';

const commonTranslations = translations.common;
const pageTranslations = translations.earnPage;

const EarnPage: FC = () => {
  const [index, setIndex] = useState(0);
  const [amount, setAmount] = useState('0');
  const [poolBalance, setPoolBalance] = useState('0');
  const [ZUSDInStabilityPool, setZUSDInStabilityPool] = useState('0');
  const [token, setToken] = useState<SupportedTokens>(SupportedTokens.dllr);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useAccount();

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const getStabilityDeposit = useCallback(() => {
    if (account) {
      setIsLoading(true);
      liquity
        .getStabilityDeposit(account)
        .then(result => setPoolBalance(result.currentZUSD.toString()))
        .finally(() => setIsLoading(false));
    }
  }, [account, liquity]);

  useEffect(() => {
    getStabilityDeposit();
  }, [getStabilityDeposit]);

  const getZUSDInStabilityPool = useCallback(() => {
    liquity
      .getZUSDInStabilityPool()
      .then(result => setZUSDInStabilityPool(result.toString()));
  }, [liquity]);

  useEffect(() => {
    getZUSDInStabilityPool();
  }, [getZUSDInStabilityPool]);

  const actions = useMemo(() => {
    const tabs = [
      {
        label: t(commonTranslations.deposit),
        activeClassName: 'text-primary-20',
        dataAttribute: 'earn-deposit',
      },
    ];

    if (!BigNumber.from(toWei(poolBalance)).isZero()) {
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

  const { value: weiBalance } = useAssetBalance(token);

  const balance = useMemo(() => fromWei(weiBalance), [weiBalance]);

  const onTokenChange = useCallback((value: SupportedTokens) => {
    setToken(value);
    setAmount('0');
  }, []);

  const { value: zusdWeiBalance } = useAssetBalance(SupportedTokens.zusd);
  const { value: dllrWeiBalance } = useAssetBalance(SupportedTokens.dllr);

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

  useEffect(() => setAmount('0'), [isDeposit]);

  const maximumAmount = useMemo(
    () => (isDeposit ? balance : poolBalance),
    [balance, isDeposit, poolBalance],
  );

  const onMaximumAmountClick = useCallback(
    () => setAmount(maximumAmount),
    [maximumAmount],
  );

  const onTransactionSuccess = useCallback(() => {
    getStabilityDeposit();
    getZUSDInStabilityPool();
  }, [getStabilityDeposit, getZUSDInStabilityPool]);

  const handleSubmit = useHandleStabilityDeposit(
    token,
    amount,
    isDeposit,
    onTransactionSuccess,
  );

  const poolShare = useMemo(() => {
    if (BigNumber.from(toWei(ZUSDInStabilityPool)).isZero()) {
      return '0';
    }
    return fromWei(
      BigNumber.from(toWei(poolBalance, 24)).div(toWei(ZUSDInStabilityPool)),
      4,
    ).toString();
  }, [ZUSDInStabilityPool, poolBalance]);

  const isAmountZero = useMemo(() => {
    return Number(amount) === 0;
  }, [amount]);

  const newPoolBalance = useMemo(() => {
    if (isAmountZero) {
      return t(commonTranslations.na);
    }
    let newBalance = BigNumber.from(toWei(poolBalance));
    if (isDeposit) {
      newBalance = newBalance.add(toWei(amount));
    } else {
      newBalance = newBalance.sub(toWei(amount));
    }
    if (newBalance.lt(0)) {
      return '0';
    }
    return fromWei(newBalance);
  }, [isAmountZero, poolBalance, isDeposit, amount]);

  const newPoolBalanceLabel = useMemo(() => {
    if (isAmountZero) {
      return t(commonTranslations.na);
    }
    return `${newPoolBalance} ${SupportedTokens.zusd.toUpperCase()}`;
  }, [isAmountZero, newPoolBalance]);

  const newPoolShare = useMemo(() => {
    if (isAmountZero) {
      return t(commonTranslations.na);
    }

    let newZUSDInStabilityPool = toWei(ZUSDInStabilityPool);
    if (isDeposit) {
      newZUSDInStabilityPool = newZUSDInStabilityPool.add(toWei(amount));
    } else {
      newZUSDInStabilityPool = newZUSDInStabilityPool.sub(toWei(amount));
    }

    if (newZUSDInStabilityPool.isZero()) {
      return '0 %';
    }
    return `${fromWei(
      BigNumber.from(toWei(newPoolBalance, 24)).div(newZUSDInStabilityPool),
      4,
    ).toString()} %`;
  }, [ZUSDInStabilityPool, amount, isAmountZero, isDeposit, newPoolBalance]);

  const isValidAmount = useMemo(
    () => Number(amount) <= Number(maximumAmount),
    [amount, maximumAmount],
  );

  const isSubmitDisabled = useMemo(
    () => !account || !amount || Number(amount) <= 0 || !isValidAmount,
    [account, amount, isValidAmount],
  );

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

  return (
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
              invisible: BigNumber.from(toWei(poolBalance)).isZero(),
            })}
          />

          <button
            onClick={onMaximumAmountClick}
            className="text-xs font-medium underline whitespace-nowrap"
            {...applyDataAttr('earn-max-button')}
          >
            ({t(commonTranslations.max)}
            <AmountRenderer
              value={maximumAmount}
              precision={4}
              suffix={token.toUpperCase()}
            />
            )
          </button>
        </div>

        <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
          <AmountInput
            value={amount}
            onChangeText={setAmount}
            label={t(translations.common.amount)}
            min={0}
            max={maximumAmount}
            disabled={!account}
            invalid={!isValidAmount}
            className="w-full flex-grow-0 flex-shrink"
            dataAttribute="earn-amount-input"
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
          <Paragraph className="text-error-light font-medium mt-2">
            {t(pageTranslations.form.invalidAmountError)}
          </Paragraph>
        )}
        <SimpleTable className="mt-3">
          <SimpleTableRow
            label={t(pageTranslations.currentPoolBalance)}
            value={`${poolBalance} ${SupportedTokens.zusd.toUpperCase()}`}
          />
          <SimpleTableRow
            label={t(pageTranslations.currentPoolShare)}
            value={`${poolShare} %`}
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
          className="w-full mt-8"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          dataAttribute="earn-submit"
        />
      </div>
    </div>
  );
};

export default EarnPage;
