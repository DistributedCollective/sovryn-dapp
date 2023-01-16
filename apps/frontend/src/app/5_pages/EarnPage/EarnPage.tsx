import { BigNumber } from '@ethersproject/bignumber';
import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
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

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { TransactionStepDialog } from '../../3_organisms';
import { useAccount } from '../../../hooks/useAccount';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { translations } from '../../../locales/i18n';
import { formatValue, fromWei, toWei } from '../../../utils/math';
import { tokenOptions } from './EarnPage.types';
import { useHandleStabalityDeposit } from './hooks/useHandleStabalityDeposit';

const commonTranslations = translations.common;
const pageTranslations = translations.earnPage;

const EarnPage: FC = () => {
  const [index, setIndex] = useState(0);
  const [amount, setAmount] = useState('0');
  const [poolBalance, setPoolBalance] = useState('0');
  const [ZUSDInStabilityPool, setZUSDInStabilityPool] = useState('0');
  const [sourceToken, setSourceToken] = useState<SupportedTokens>(
    SupportedTokens.dllr,
  );

  const { account } = useAccount();
  const { value: weiBalance } = useAssetBalance(sourceToken);

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const getStabilityDeposit = useCallback(() => {
    if (account) {
      liquity
        .getStabilityDeposit(account)
        .then(result => setPoolBalance(result.currentZUSD.toString()));
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
        label: 'Deposit',
        activeClassName: 'text-primary-20',
      },
    ];

    if (!BigNumber.from(toWei(poolBalance)).isZero()) {
      tabs.push({
        label: 'Withdraw',
        activeClassName: 'text-primary-20',
      });
    } else {
      setIndex(0);
    }

    return tabs;
  }, [poolBalance]);

  const isDeposit = useMemo(() => index === 0, [index]);

  const balance = useMemo(
    () => String(Number(fromWei(weiBalance))),
    [weiBalance],
  );

  const onSourceTokenChange = useCallback((value: SupportedTokens) => {
    setSourceToken(value);
    setAmount('0');
  }, []);

  const { t } = useTranslation();

  const getAssetRenderer = useCallback(
    (token: SupportedTokens) => (
      <AssetRenderer showAssetLogo asset={token} assetClassName="font-medium" />
    ),
    [],
  );

  const onMaximumAmountClick = useCallback(() => setAmount(balance), [balance]);
  const handleSubmit = useHandleStabalityDeposit(
    sourceToken,
    amount,
    isDeposit,
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

  const newPoolBalance = useMemo(() => {
    const newBalance = BigNumber.from(poolBalance).add(
      isDeposit ? amount : -amount,
    );
    if (newBalance.lt(0) || amount === '0') {
      return 'N/A';
    }
    return newBalance.toString();
  }, [amount, poolBalance, isDeposit]);

  const newPoolBalanceLabel = useMemo(() => {
    return newPoolBalance === 'N/A'
      ? newPoolBalance
      : `${newPoolBalance} ${SupportedTokens.zusd.toUpperCase()}`;
  }, [newPoolBalance]);

  const newPoolShare = useMemo(() => {
    if (newPoolBalance === 'N/A') {
      return 'N/A';
    }

    const newZUSDInStabilityPool = toWei(ZUSDInStabilityPool).add(
      toWei(isDeposit ? amount : -amount),
    );

    if (newZUSDInStabilityPool.isZero()) {
      return '0 %';
    }
    return `${fromWei(
      BigNumber.from(toWei(newPoolBalance, 24)).div(newZUSDInStabilityPool),
      4,
    ).toString()} %`;
  }, [ZUSDInStabilityPool, amount, isDeposit, newPoolBalance]);

  const maximumAmount = useMemo(() => {
    if (isDeposit) {
      return balance;
    } else {
      return poolBalance;
    }
  }, [balance, isDeposit, poolBalance]);

  const isValidAmount = useMemo(
    () => Number(amount) <= Number(maximumAmount),
    [amount, maximumAmount],
  );

  const onTransactionSuccess = useCallback(() => {
    getStabilityDeposit();
    getZUSDInStabilityPool();
  }, [getStabilityDeposit, getZUSDInStabilityPool]);

  const isSubmitDisabled = useMemo(
    () => !account || !amount || Number(amount) <= 0 || !isValidAmount,
    [account, amount, isValidAmount],
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
          />

          <button
            onClick={onMaximumAmountClick}
            className="text-xs font-medium underline whitespace-nowrap"
          >
            ({t(commonTranslations.max)} {formatValue(Number(balance), 4)}{' '}
            {sourceToken.toUpperCase()})
          </button>
        </div>

        <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
          <AmountInput
            value={amount}
            onChangeText={setAmount}
            label={'amount'}
            min={0}
            max={maximumAmount}
            invalid={!isValidAmount}
            className="w-full flex-grow-0 flex-shrink"
          />

          <Select
            value={sourceToken}
            onChange={onSourceTokenChange}
            options={tokenOptions}
            labelRenderer={() => getAssetRenderer(sourceToken)}
            className="min-w-[6.7rem]"
          />
        </div>
        {!isValidAmount && (
          <Paragraph className="text-error-light font-medium mt-2">
            {t(pageTranslations.form.invalidAmountError)}
          </Paragraph>
        )}
        <SimpleTable className="mt-3">
          <SimpleTableRow
            label="Current pool balance"
            value={`${poolBalance} ${SupportedTokens.zusd.toUpperCase()}`}
          />
          <SimpleTableRow label="Current pool share" value={`${poolShare} %`} />
        </SimpleTable>
        <SimpleTable className="mt-3">
          <SimpleTableRow
            label="New pool balance"
            value={newPoolBalanceLabel}
          />
          <SimpleTableRow label="New pool share" value={newPoolShare} />
        </SimpleTable>
        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text={t(commonTranslations.buttons.confirm)}
          className="w-full mt-8"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        />
      </div>
      <TransactionStepDialog onSuccess={onTransactionSuccess} />
    </div>
  );
};

export default EarnPage;
