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
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { LabelWithTabsAndMaxButton } from '../../../../2_molecules/LabelWithTabsAndMaxButton/LabelWithTabsAndMaxButton';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
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
  const [value, setValue, amount] = useWeiAmountInput('');
  const { account } = useAccount();

  const { balanceA, loadingA, balanceB, refetch } = useGetUserInfo(pool);

  const onCompleteTransaction = useCallback(() => {
    refetch();
    onClose();
  }, [onClose, refetch]);

  const { onDeposit, onWithdraw } = useHandleMarketMaking(
    onCompleteTransaction,
  );

  const decimalAmount = useMemo(
    (): Decimal => decimalic(amount.toString()),
    [amount],
  );

  const isAmountZero = useMemo(() => amount.isZero(), [amount]);
  const { tokenPoolBalance } = useGetPoolBalance(
    isAmountZero,
    adjustType,
    loadingA,
    pool,
    account,
  );

  const poolWeiAmount = calculatePoolWeiAmount(
    Decimal.fromBigNumberString(amount.toString()),
    balanceA,
    tokenPoolBalance,
  );

  const token = useMemo(() => pool.assetA, [pool.assetA]);
  const isDeposit = useMemo(
    () => adjustType === AdjustType.Deposit,
    [adjustType],
  );
  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const maxTokenToDepositAmount = useGetMaxDeposit(pool, isDeposit);

  const maxBalance = useMemo(
    () => (isDeposit ? maxTokenToDepositAmount : balanceA),
    [isDeposit, balanceA, maxTokenToDepositAmount],
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
    if (isDeposit) {
      onDeposit(pool, decimalAmount, expectedTokenAmount);
    } else {
      onWithdraw(pool, poolWeiAmount, decimalAmount, [minReturn1, minReturn2]);
    }
  }, [
    expectedTokenAmount,
    onDeposit,
    onWithdraw,
    pool,
    isDeposit,
    decimalAmount,
    poolWeiAmount,
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

              <AmountInput
                label={t(translations.common.amount)}
                value={expectedTokenAmount.toString()}
                className="max-w-none mt-6"
                unit={<AssetRenderer asset={SupportedTokens.rbtc} />}
                readOnly
              />
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
