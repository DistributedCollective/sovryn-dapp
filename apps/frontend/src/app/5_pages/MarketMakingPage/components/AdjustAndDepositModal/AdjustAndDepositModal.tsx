import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Dialog,
  DialogHeader,
  DialogBody,
  AmountInput,
  FormGroup,
  Checkbox,
  Button,
  ButtonType,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  Tabs,
  TabType,
  Select,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { LabelWithTabsAndMaxButton } from '../../../../2_molecules/LabelWithTabsAndMaxButton/LabelWithTabsAndMaxButton';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../hooks/useAccount';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { decimalic, toWei } from '../../../../../utils/math';
import { useCheckPoolBlocked } from '../../hooks/useCheckPoolBlocked';
import { useGetExpectedTokenAmount } from '../../hooks/useGetExpectedTokenAmount';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { useHandleMarketMaking } from '../../hooks/useHandleMarketMaking';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { CurrentBalance } from '../PoolsTable/components/CurrentBalance/CurrentBalance';
import { PoolsTableReturns } from '../PoolsTable/components/PoolsTableReturns/PoolsTableReturns';
import { TABS } from './AdjustAndDepositModal.constants';
import { AdjustType } from './AdjustAndDepositModal.types';
import {
  calculatePoolWeiAmount,
  getMinReturn,
} from './AdjustAndDepositModal.utils';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { useGetMaxDeposit } from './hooks/useGetMaxDeposit';
import { useGetPoolBalance } from './hooks/useGetPoolBalance';

const pageTranslations = translations.marketMakingPage.adjustAndDepositModal;

type AdjustAndDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isInitialDeposit: boolean;
  pool: AmmLiquidityPool;
};

export const AdjustAndDepositModal: FC<AdjustAndDepositModalProps> = ({
  isOpen,
  onClose,
  isInitialDeposit,
  pool,
}) => {
  const [adjustType, setAdjustType] = useState(AdjustType.Deposit);
  const [selectedAsset, setSelectedAsset] = useState(pool.assetA);
  const [value, setValue, amount] = useWeiAmountInput('');
  const { account } = useAccount();

  const poolBlocked = useCheckPoolBlocked(pool);

  const adjustTabs = useMemo(() => {
    if (poolBlocked.isBlocked) {
      return TABS.filter(tab => tab.tabAction !== AdjustType.Deposit);
    }

    return TABS;
  }, [poolBlocked.isBlocked]);

  const assetSelectOptions = useMemo(
    () => [
      {
        value: pool.assetA,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={pool.assetA}
            assetClassName="font-medium"
          />
        ),
      },
      {
        value: pool.assetB,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={pool.assetB}
            assetClassName="font-medium"
          />
        ),
      },
    ],
    [pool.assetA, pool.assetB],
  );

  const onChangeIndex = useCallback((index: number) => {
    setAdjustType(index);
  }, []);

  const { balanceA, loadingA, balanceB, refetch } = useGetUserInfo(pool);

  const isV2Pool = useMemo(
    () => pool.converterVersion === 2,
    [pool.converterVersion],
  );

  const onCompleteTransaction = useCallback(() => {
    refetch();
    onClose();
  }, [onClose, refetch]);

  const { onDepositV1, onDepositV2, onWithdrawV1, onWithdrawV2 } =
    useHandleMarketMaking(onCompleteTransaction);

  const decimalAmount = useMemo(
    (): Decimal => decimalic(amount.toString()),
    [amount],
  );

  const isAmountZero = useMemo(() => amount.isZero(), [amount]);
  const { tokenPoolBalance } = useGetPoolBalance(
    isAmountZero,
    adjustType,
    loadingA,
    selectedAsset === pool.assetA ? pool.poolTokenA : pool.poolTokenB!,
    account,
  );

  const poolWeiAmount = calculatePoolWeiAmount(
    Decimal.fromBigNumberString(amount.toString()),
    selectedAsset === pool.assetA ? balanceA : balanceB,
    tokenPoolBalance,
  );

  const isDeposit = useMemo(
    () => adjustType === AdjustType.Deposit,
    [adjustType],
  );
  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const { maximumV1Deposit, balanceTokenA, balanceTokenB } = useGetMaxDeposit(
    pool,
    isDeposit,
  );

  const maxTokenToDepositAmount = useMemo(() => {
    if (isV2Pool) {
      return selectedAsset === pool.assetA ? balanceTokenA : balanceTokenB;
    }

    return maximumV1Deposit;
  }, [
    balanceTokenA,
    balanceTokenB,
    isV2Pool,
    maximumV1Deposit,
    pool.assetA,
    selectedAsset,
  ]);

  const maxWithdrawalAmount = useMemo(
    () => (selectedAsset === pool.assetA ? balanceA : balanceB),
    [balanceA, balanceB, pool.assetA, selectedAsset],
  );

  const maxBalance = useMemo(
    () => (isDeposit ? maxTokenToDepositAmount : maxWithdrawalAmount),
    [isDeposit, maxTokenToDepositAmount, maxWithdrawalAmount],
  );

  const handleMaxClick = useCallback(
    () => setValue(maxBalance.toString()),
    [maxBalance, setValue],
  );

  const decimalValue = useMemo(() => decimalic(value), [value]);

  const expectedTokenAmount = useGetExpectedTokenAmount(pool, decimalValue);
  const minReturn1 = getMinReturn(decimalAmount);
  const minReturn2 = getMinReturn(
    Decimal.from(toWei(expectedTokenAmount.toString()).toString()),
  );

  const handleSubmit = useCallback(() => {
    if (isV2Pool) {
      if (isDeposit) {
        onDepositV2(pool, selectedAsset, decimalAmount);
      } else {
        onWithdrawV2(pool, selectedAsset, poolWeiAmount, decimalAmount, '1');
      }
    } else {
      if (isDeposit) {
        onDepositV1(pool, decimalAmount, expectedTokenAmount);
      } else {
        onWithdrawV1(pool, poolWeiAmount, decimalAmount, [
          minReturn1,
          minReturn2,
        ]);
      }
    }
  }, [
    isV2Pool,
    isDeposit,
    onDepositV2,
    pool,
    selectedAsset,
    decimalAmount,
    onWithdrawV2,
    poolWeiAmount,
    onDepositV1,
    expectedTokenAmount,
    onWithdrawV1,
    minReturn1,
    minReturn2,
  ]);

  const isValidForm = useMemo(
    () => decimalValue.lte(maxBalance) || isAmountZero,
    [maxBalance, decimalValue, isAmountZero],
  );

  const isSubmitDisabled = useMemo(
    () =>
      decimalAmount.isZero() ||
      (!hasDisclaimerBeenChecked && isInitialDeposit) ||
      !isValidForm,
    [decimalAmount, isValidForm, hasDisclaimerBeenChecked, isInitialDeposit],
  );

  useEffect(() => {
    setValue('');
    if (isInitialDeposit) {
      setAdjustType(AdjustType.Deposit);
    }
  }, [setValue, isInitialDeposit, adjustType, account]);

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(
          pageTranslations.titles[
            isInitialDeposit ? 'initialDeposit' : 'adjust'
          ],
        )}
        onClose={onClose}
      />
      <DialogBody>
        <>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={pool.assetA}
              symbol2={pool.assetB}
              label1={t(pageTranslations.currentStatistics.returnRate)}
              label2={t(pageTranslations.currentStatistics.currentBalance)}
              value1={
                <PoolsTableReturns
                  className="text-xs font-semibold"
                  pool={pool}
                />
              }
              value2={
                <CurrentBalance
                  pool={pool}
                  balanceA={balanceA}
                  balanceB={balanceB}
                />
              }
            />
          </div>

          <div>
            <FormGroup
              label={
                pool.converterVersion === 1 ? (
                  isInitialDeposit ? (
                    <div className="flex justify-end w-full">
                      <MaxButton
                        value={maxBalance}
                        token={selectedAsset}
                        onClick={handleMaxClick}
                      />
                    </div>
                  ) : (
                    <LabelWithTabsAndMaxButton
                      token={selectedAsset}
                      maxAmount={maxBalance}
                      tabs={adjustTabs}
                      onTabChange={setAdjustType}
                      onMaxAmountClicked={handleMaxClick}
                      index={adjustType}
                      setIndex={setAdjustType}
                      dataAttributePrefix="adjust-amm-pool"
                    />
                  )
                ) : (
                  <>
                    {!isInitialDeposit && (
                      <Tabs
                        index={adjustType}
                        items={adjustTabs}
                        onChange={onChangeIndex}
                        type={TabType.secondary}
                      />
                    )}
                  </>
                )
              }
              labelElement="div"
              className="max-w-none mt-8"
              dataAttribute="adjust-amm-pool-amount"
            >
              {pool.converterVersion === 2 && (
                <div className="w-full flex flex-row justify-between items-baseline mb-2 mt-6">
                  <Select
                    value={selectedAsset}
                    options={assetSelectOptions}
                    onChange={setSelectedAsset}
                    className="h-[1.875rem] w-[9.25rem]"
                  />
                  <MaxButton
                    value={maxBalance}
                    token={selectedAsset}
                    onClick={handleMaxClick}
                  />
                </div>
              )}

              <AmountInput
                value={value}
                onChangeText={setValue}
                maxAmount={maxBalance.toNumber()}
                label={t(translations.common.amount)}
                className="max-w-none"
                unit={<AssetRenderer asset={selectedAsset} />}
                disabled={!account}
                invalid={!isValidForm}
                placeholder="0"
              />
              {!isValidForm && (
                <ErrorBadge
                  level={ErrorLevel.Critical}
                  message={t(
                    translations.marketMakingPage.form.invalidAmountError,
                  )}
                  dataAttribute="adjust-market-making-amount-error"
                />
              )}

              {!isV2Pool && (
                <AmountInput
                  label={t(translations.common.amount)}
                  value={expectedTokenAmount.toString()}
                  className="max-w-none mt-6"
                  unit={<AssetRenderer asset={COMMON_SYMBOLS.BTC} />}
                  readOnly
                />
              )}
            </FormGroup>
          </div>

          <NewPoolStatistics
            value={value}
            asset={selectedAsset}
            decimalAmount={decimalAmount}
            isInitialDeposit={isInitialDeposit}
            adjustType={adjustType}
            pool={pool}
          />

          {isInitialDeposit && (
            <div className="mt-6">
              <Checkbox
                checked={hasDisclaimerBeenChecked}
                onChangeValue={setHasDisclaimerBeenChecked}
                label={t(pageTranslations.initialDepositDisclaimer)}
              />
            </div>
          )}

          <div className="mt-6 flex flex-row items-center justify-between gap-8">
            <Button
              type={ButtonType.submit}
              style={ButtonStyle.primary}
              text={t(translations.common.buttons.confirm)}
              className="w-full"
              onClick={handleSubmit}
              dataAttribute="new-loan-confirm-button"
              disabled={isSubmitDisabled}
            />
          </div>
        </>
      </DialogBody>
    </Dialog>
  );
};
