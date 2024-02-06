import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
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
  ITabItem,
  Tabs,
  TabType,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { LabelWithTabsAndMaxButton } from '../../../../2_molecules/LabelWithTabsAndMaxButton/LabelWithTabsAndMaxButton';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { TAB_ACTIVE_CLASSNAME } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { decimalic, toWei } from '../../../../../utils/math';
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
  const [assetTabIndex, setAssetTabIndex] = useState(0);
  const [value, setValue, amount] = useWeiAmountInput('');
  const { account } = useAccount();

  const token = useMemo(
    () => (assetTabIndex === 0 ? pool.assetA : pool.assetB),
    [assetTabIndex, pool.assetA, pool.assetB],
  );

  const assetTabOptions: ITabItem[] = useMemo(
    () => [
      {
        label: <AssetRenderer asset={pool.assetA} />,
        activeClassName: TAB_ACTIVE_CLASSNAME,
      },
      {
        label: <AssetRenderer asset={pool.assetB} />,
        activeClassName: TAB_ACTIVE_CLASSNAME,
      },
    ],
    [pool.assetA, pool.assetB],
  );

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
    assetTabIndex === 0 ? pool.poolTokenA : pool.poolTokenB!,
    account,
  );

  const poolWeiAmount = calculatePoolWeiAmount(
    Decimal.fromBigNumberString(amount.toString()),
    assetTabIndex === 0 ? balanceA : balanceB,
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
      return assetTabIndex === 0 ? balanceTokenA : balanceTokenB;
    }

    return maximumV1Deposit;
  }, [assetTabIndex, balanceTokenA, balanceTokenB, isV2Pool, maximumV1Deposit]);

  const maxWithdrawalAmount = useMemo(
    () => (assetTabIndex === 0 ? balanceA : balanceB),
    [assetTabIndex, balanceA, balanceB],
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
        onDepositV2(pool, token, decimalAmount);
      } else {
        onWithdrawV2(pool, token, poolWeiAmount, decimalAmount, '1');
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
    token,
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
                isInitialDeposit ? (
                  <div className="flex justify-end w-full">
                    <MaxButton
                      value={maxBalance}
                      token={token}
                      onClick={handleMaxClick}
                    />
                  </div>
                ) : (
                  <LabelWithTabsAndMaxButton
                    token={token}
                    maxAmount={maxBalance}
                    tabs={TABS}
                    onTabChange={setAdjustType}
                    onMaxAmountClicked={handleMaxClick}
                    index={adjustType}
                    setIndex={setAdjustType}
                    dataAttributePrefix="adjust-amm-pool"
                  />
                )
              }
              labelElement="div"
              className="max-w-none mt-8"
              dataAttribute="adjust-amm-pool-amount"
            >
              {pool.converterVersion === 2 && (
                <div>
                  <Tabs
                    items={assetTabOptions}
                    onChange={setAssetTabIndex}
                    index={assetTabIndex}
                    type={TabType.secondary}
                    className="mb-4"
                  />
                </div>
              )}

              <AmountInput
                value={value}
                onChangeText={setValue}
                maxAmount={maxBalance.toNumber()}
                label={t(translations.common.amount)}
                className="max-w-none"
                unit={<AssetRenderer asset={token} />}
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
                  unit={<AssetRenderer asset={SupportedTokens.rbtc} />}
                  readOnly
                />
              )}
            </FormGroup>
          </div>

          <NewPoolStatistics
            value={value}
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
