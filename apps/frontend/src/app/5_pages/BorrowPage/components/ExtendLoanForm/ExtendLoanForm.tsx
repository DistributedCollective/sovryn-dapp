import React, { FC, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  DynamicValue,
  ErrorBadge,
  ErrorLevel,
  HealthBar,
  Paragraph,
  RadioButton,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { DatePicker } from '../../../../2_molecules/DatePicker/DatePicker';
import { LoanItem } from '../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { useGetMinCollateralRatio } from '../../../../5_pages/BorrowPage/hooks/useGetMinCollateralRatio';
import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../constants/lending';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useIsDappLocked } from '../../../../../hooks/maintenances/useIsDappLocked';
import { useQueryRate } from '../../../../../hooks/useQueryRate';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import {
  getCollateralRatioThresholds,
  normalizeToken,
  renderValue,
} from '../../BorrowPage.utils';
import { useGetMaintenanceStates } from '../../hooks/useGetMaintenanceStates';
import { CurrentLoanData } from '../CurrentLoanData/CurrentLoanData';
import { useExtendLoan } from './hooks/useExtendLoan';

const pageTranslations = translations.fixedInterestPage.extendLoanDialog;

type ExtendLoanFormProps = {
  loan: LoanItem;
};

export const ExtendLoanForm: FC<ExtendLoanFormProps> = ({ loan }) => {
  const dappLocked = useIsDappLocked();

  const minRollOverDate = useMemo(
    () =>
      dayjs(loan.rolloverDate * 1000)
        .add(1, 'day')
        .unix(),
    [loan.rolloverDate],
  );

  const [nextRolloverDate, setNextRolloverDate] = useState(minRollOverDate);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const debtToken = useMemo(
    () => normalizeToken(loan.debtAsset.toLowerCase()),
    [loan.debtAsset],
  );
  const collateralToken = useMemo(
    () => normalizeToken(loan.collateralAsset.toLowerCase()),
    [loan.collateralAsset],
  );

  const [collateralAssetPrice] = useQueryRate(collateralToken, debtToken);

  const [useCollateral, setUseCollateral] = useState(true);

  const { depositAmount, handleSubmit } = useExtendLoan(
    loan,
    debtToken,
    nextRolloverDate,
    useCollateral,
  );

  const collateralRatioThresholds = useMemo(
    () => getCollateralRatioThresholds(collateralToken),
    [collateralToken],
  );

  const collateralChange = useMemo(() => {
    if (useCollateral) {
      return decimalic(depositAmount).div(collateralAssetPrice || 1);
    }
    return decimalic(0);
  }, [collateralAssetPrice, depositAmount, useCollateral]);

  const newCollateralAmount = useMemo(
    () =>
      decimalic(loan.collateral.toString()).sub(collateralChange.toString()),
    [collateralChange, loan.collateral],
  );

  const newTotalDebt = useMemo(
    () =>
      decimalic(loan.debt.toString()).add(useCollateral ? 0 : depositAmount),
    [depositAmount, loan.debt, useCollateral],
  );

  const minimumCollateralRatio = useMemo(
    () =>
      collateralToken === COMMON_SYMBOLS.SOV
        ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV
        : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
    [collateralToken],
  );

  const collateralRatio = useMemo(() => {
    if (!nextRolloverDate) {
      return Decimal.from(loan.collateralRatio);
    }

    if (newTotalDebt.isZero()) {
      return Decimal.ZERO;
    }

    return newCollateralAmount
      .mul(collateralAssetPrice)
      .div(newTotalDebt)
      .mul(100);
  }, [
    collateralAssetPrice,
    loan.collateralRatio,
    newCollateralAmount,
    newTotalDebt,
    nextRolloverDate,
  ]);

  const isValidCollateralRatio = useMemo(() => {
    return (
      Number(collateralAssetPrice) === 0 ||
      collateralRatio.gte(minimumCollateralRatio.mul(100))
    );
  }, [collateralAssetPrice, collateralRatio, minimumCollateralRatio]);

  const collateralRatioError = useMemo(() => {
    if (collateralRatio.lt(minimumCollateralRatio.mul(100))) {
      return t(pageTranslations.labels.collateralRatioError, {
        min: minimumCollateralRatio.mul(100),
      });
    }
    return '';
  }, [collateralRatio, minimumCollateralRatio]);

  const maintenanceMargin = useGetMinCollateralRatio(debtToken);

  const liquidationPrice = useMemo(() => {
    return maintenanceMargin
      .mul(newTotalDebt.toString())
      .div(newCollateralAmount || 1);
  }, [maintenanceMargin, newCollateralAmount, newTotalDebt]);

  const renderNewRolloverDate = useMemo(
    () =>
      nextRolloverDate
        ? dateFormat(Number(nextRolloverDate))
        : t(translations.common.na),
    [nextRolloverDate],
  );

  const { isExtendLocked } = useGetMaintenanceStates(debtToken);

  const submitButtonDisabled = useMemo(
    () =>
      (!isValidCollateralRatio && useCollateral) ||
      !nextRolloverDate ||
      dappLocked ||
      isExtendLocked,
    [
      isValidCollateralRatio,
      useCollateral,
      nextRolloverDate,
      dappLocked,
      isExtendLocked,
    ],
  );

  return (
    <>
      <CurrentLoanData
        debt={loan.debt}
        debtToken={debtToken}
        collateral={loan.collateral}
        collateralToken={collateralToken}
        collateralRatio={loan.collateralRatio}
      />

      <div className="mt-6">
        <SimpleTable className="mb-3">
          <SimpleTableRow
            label={t(pageTranslations.labels.currentRolloverDate)}
            value={dateFormat(loan.rolloverDate)}
          />
        </SimpleTable>

        <DatePicker
          date={nextRolloverDate}
          onChange={setNextRolloverDate}
          className="min-w-full mb-6"
          minDate={minRollOverDate}
          setIsCalendarVisible={setIsCalendarVisible}
          isCalendarVisible={isCalendarVisible}
          label={t(pageTranslations.labels.nextRolloverDate)}
        />

        <div className="flex md:flex-row flex-col mb-3">
          <Paragraph className="font-medium text-xs mb-3 text-gray-30 md:mr-8">
            {t(pageTranslations.labels.payPrepaidInterest)}
          </Paragraph>

          <div className="flex items-center">
            <RadioButton
              label={t(pageTranslations.labels.collateral)}
              id="useCollateral"
              className="mr-6"
              checked={useCollateral}
              onChange={e => setUseCollateral(e.target.checked)}
            />
            <RadioButton
              label={t(pageTranslations.labels.wallet)}
              id="useWallet"
              checked={!useCollateral}
              onChange={e => setUseCollateral(!e.target.checked)}
            />
          </div>
        </div>

        {useCollateral && (
          <>
            <div className="flex items-center mb-8 gap-3">
              <AmountInput
                value={collateralChange.toString()}
                label={t(translations.common.amount)}
                className="w-full flex-grow-0 flex-shrink"
                placeholder="0"
                readOnly
              />
              <div className="bg-gray-60 p-2.5 min-w-[5.5rem] rounded">
                <AssetRenderer asset={collateralToken} showAssetLogo />
              </div>
            </div>

            <SimpleTable>
              <SimpleTableRow
                label={t(pageTranslations.labels.newRolloverDate)}
                value={renderNewRolloverDate}
                valueClassName="text-primary-10"
              />
              <SimpleTableRow
                label={t(pageTranslations.labels.newCollateralBalance)}
                value={
                  <DynamicValue
                    initialValue="0"
                    value={newCollateralAmount.toString()}
                    renderer={() =>
                      renderValue(
                        newCollateralAmount.toString(),
                        collateralToken,
                      )
                    }
                  />
                }
              />
            </SimpleTable>

            <div className="flex flex-row justify-between items-center mt-6 mb-3">
              <div className="flex flex-row justify-start items-center gap-2">
                <span>
                  {t(translations.adjustCreditLine.labels.collateralRatio)}
                </span>
              </div>
              <div className="text-primary-10">
                <DynamicValue
                  initialValue="0"
                  value={collateralRatio.toString()}
                  renderer={value => renderValue(value, '%', 0)}
                />
              </div>
            </div>

            <HealthBar
              start={collateralRatioThresholds.START}
              middleStart={collateralRatioThresholds.MIDDLE_START}
              middleEnd={collateralRatioThresholds.MIDDLE_END}
              end={collateralRatioThresholds.END}
              value={collateralRatio.toNumber()}
            />
            {!isValidCollateralRatio && (
              <ErrorBadge
                level={ErrorLevel.Critical}
                message={collateralRatioError}
                dataAttribute="adjust-loan-collateral-ratio-error"
              />
            )}
          </>
        )}
        {!useCollateral && (
          <>
            <div className="flex items-center mb-8 gap-3">
              <AmountInput
                value={depositAmount}
                label={t(translations.common.amount)}
                className="w-full flex-grow-0 flex-shrink"
                placeholder="0"
                readOnly
              />
              <div className="bg-gray-60 p-2.5 min-w-[5.5rem] rounded">
                <AssetRenderer asset={debtToken} showAssetLogo />
              </div>
            </div>
            <SimpleTable>
              <SimpleTableRow
                label={t(pageTranslations.labels.prepaidInterestAmount)}
                value={
                  <AmountRenderer
                    value={depositAmount}
                    suffix={getTokenDisplayName(debtToken)}
                  />
                }
                valueClassName="text-primary-10"
              />
              <SimpleTableRow
                label={t(pageTranslations.labels.newRolloverDate)}
                value={renderNewRolloverDate}
                valueClassName="text-primary-10"
              />
            </SimpleTable>
          </>
        )}

        <div className="mt-6">
          <SimpleTable>
            <SimpleTableRow
              label={t(pageTranslations.labels.liquidationPrice)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={liquidationPrice.toString()}
                  renderer={value => renderValue(value, debtToken)}
                />
              }
            />
            <SimpleTableRow
              label={t(pageTranslations.labels.collateralPrice, {
                token: getTokenDisplayName(collateralToken),
              })}
              value={
                <DynamicValue
                  initialValue="0"
                  value={collateralAssetPrice.toString()}
                  renderer={value => renderValue(value, debtToken)}
                />
              }
            />
          </SimpleTable>
        </div>
      </div>

      <Button
        type={ButtonType.submit}
        style={ButtonStyle.primary}
        text={t(translations.common.buttons.confirm)}
        className="w-full mt-8"
        onClick={handleSubmit}
        disabled={submitButtonDisabled}
        dataAttribute="adjust-loan-confirm-button"
      />
      {(dappLocked || isExtendLocked) && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.featureDisabled)}
        />
      )}
    </>
  );
};
