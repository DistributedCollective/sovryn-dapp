import React, { FC, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
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
import { LoanItem } from '../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { COLLATERAL_RATIO_THRESHOLDS } from '../../../../../constants/general';
import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../../constants/lending';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useGetRBTCPrice } from '../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import { DEFAULT_LOAN_DURATION } from '../../../BorrowLoanForm/components/NewLoanForm/NewLoanForm.constants';
import { useGetCollateralAssetPrice } from '../AdjustLoanForm/hooks/useGetCollateralAssetPrice';
import { normalizeToken, renderValue } from './ExtendLoanForm.utils';
import { CurrentLoanData } from './components/CurrentLoanData/CurrentLoanData';
import { RollOverDatePicker } from './components/RollOverDatePicker/RollOverDatePicker';
import { useExtendLoan } from './hooks/useExtendLoan';

const pageTranslations = translations.fixedInterestPage.extendLoanDialog;

type ExtendLoanFormProps = {
  loan: LoanItem;
  onSuccess: () => void;
};

export const ExtendLoanForm: FC<ExtendLoanFormProps> = ({ loan }) => {
  const [nextRolloverDate, setNextRolloverDate] = useState(
    dayjs().add(DEFAULT_LOAN_DURATION, 'day').unix(),
  );
  const [amount] = useState('');

  const [collateralAssetPrice, setCollateralAssetPrice] = useState('0');

  const debtToken = useMemo(
    () => normalizeToken(loan.debtAsset.toLowerCase()),
    [loan.debtAsset],
  );
  const collateralToken = useMemo(
    () => normalizeToken(loan.collateralAsset.toLowerCase()),
    [loan.collateralAsset],
  );
  const { price: rbtcPrice } = useGetRBTCPrice();

  const [useCollateral, setUseCollateral] = useState(true);

  const { depositAmount, handleSubmit } = useExtendLoan(
    loan,
    nextRolloverDate,
    useCollateral,
  );

  const { borrowPriceUsd, collateralPriceUsd } = useGetCollateralAssetPrice(
    debtToken,
    collateralToken,
  );

  const newCollateralAmount = useMemo(() => {
    return decimalic(loan.collateral.toString()).sub(depositAmount);
  }, [loan.collateral, depositAmount]);

  const collateralRatio = useMemo(() => {
    if (!nextRolloverDate) {
      return Decimal.from(loan.collateralRatio);
    }

    const debt = Decimal.from(loan.debt);
    const collateralUsdPrice =
      collateralToken === SupportedTokens.rbtc ? rbtcPrice : collateralPriceUsd;
    const totalDebtUsd = debt.mul(
      debtToken === SupportedTokens.rbtc ? rbtcPrice : borrowPriceUsd,
    );

    return newCollateralAmount
      .mul(collateralUsdPrice)
      .div(totalDebtUsd)
      .mul(100);
  }, [
    borrowPriceUsd,
    collateralPriceUsd,
    collateralToken,
    debtToken,
    loan.collateralRatio,
    loan.debt,
    newCollateralAmount,
    nextRolloverDate,
    rbtcPrice,
  ]);

  const isValidCollateralRatio = useMemo(() => {
    return collateralRatio.gte(
      MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100),
    );
  }, [collateralRatio]);

  const newTotalDebt = useMemo(() => {
    return decimalic(loan.debt.toString());
  }, [loan.debt]);

  const collateralRatioError = useMemo(() => {
    if (
      collateralRatio.lt(
        MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100),
      )
    ) {
      return t(pageTranslations.labels.collateralRatioError, {
        min: MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100),
      });
    }
    return '';
  }, [collateralRatio]);

  const liquidationPrice = useMemo(() => {
    return MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(
      newTotalDebt.toString(),
    ).div(newCollateralAmount);
  }, [newCollateralAmount, newTotalDebt]);

  useEffect(() => {
    if (collateralToken === SupportedTokens.rbtc) {
      const price = decimalic(rbtcPrice).div(borrowPriceUsd);
      setCollateralAssetPrice(price.toString());
    } else {
      const price = decimalic(collateralPriceUsd).div(rbtcPrice);
      setCollateralAssetPrice(price.toString());
    }
  }, [collateralToken, borrowPriceUsd, rbtcPrice, collateralPriceUsd]);

  const renderNewRolloverDate = useMemo(
    () =>
      nextRolloverDate
        ? dateFormat(Number(nextRolloverDate))
        : t(translations.common.na),
    [nextRolloverDate],
  );
  const submitButtonDisabled = useMemo(
    () => !isValidCollateralRatio || !nextRolloverDate,
    [isValidCollateralRatio, nextRolloverDate],
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

        <RollOverDatePicker
          date={nextRolloverDate}
          onChange={setNextRolloverDate}
          className="min-w-full mb-6"
          minDate={loan.rolloverDate}
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
                value={depositAmount}
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
              start={COLLATERAL_RATIO_THRESHOLDS.START}
              middleStart={COLLATERAL_RATIO_THRESHOLDS.MIDDLE_START}
              middleEnd={COLLATERAL_RATIO_THRESHOLDS.MIDDLE_END}
              end={COLLATERAL_RATIO_THRESHOLDS.END}
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
                value={amount}
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
                    value={0.001}
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
                  renderer={value => renderValue(value, collateralToken)}
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
                  value={collateralAssetPrice}
                  renderer={value => renderValue(value, debtToken)}
                />
              }
            />
          </SimpleTable>
        </div>
      </div>

      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.submit}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={handleSubmit}
          disabled={submitButtonDisabled}
          dataAttribute="adjust-loan-confirm-button"
        />
      </div>
    </>
  );
};
