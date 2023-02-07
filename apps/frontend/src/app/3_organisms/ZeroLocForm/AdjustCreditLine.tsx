import { _getContracts } from '@sovryn-zero/lib-ethers/dist/src/EthersLiquityConnection';

import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useState,
  FC,
  useEffect,
} from 'react';

import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  DynamicValue,
  FormGroup,
  HealthBar,
  HelperButton,
  Select,
  SimpleTable,
} from '@sovryn/ui';

import { ErrorData, ErrorLevel } from '../../1_atoms/ErrorBadge/ErrorBadge';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { ErrorList } from '../../2_molecules/ErrorList/ErrorList';
import { BORROW_ASSETS } from '../../5_pages/ZeroPage/constants';
import { getZeroProvider } from '../../5_pages/ZeroPage/utils/zero-provider';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useCall } from '../../../hooks/useCall';
import { useGasPrice } from '../../../hooks/useGasPrice';
import { useMaxAssetBalance } from '../../../hooks/useMaxAssetBalance';
import { translations } from '../../../locales/i18n';
import { getRskChainId } from '../../../utils/chain';
import {
  Bitcoin,
  CR_THRESHOLDS,
  GAS_LIMIT_ADJUST_TROVE,
  GAS_LIMIT_OPEN_TROVE,
} from '../../../utils/constants';
import { composeGas } from '../../../utils/helpers';
import { formatValue, fromWei, toWei } from '../../../utils/math';
import { CurrentTroveData } from './CurrentTroveData';
import { Label } from './Label';
import { Row } from './Row';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
  MIN_DEBT_SIZE,
} from './constants';
import {
  AdjustCreditLineProps,
  AmountType,
  CreditLineSubmitValue,
  CreditLineType,
} from './types';
import { normalizeAmountByType } from './utils';

export const AdjustCreditLine: FC<AdjustCreditLineProps> = ({
  type,
  existingCollateral,
  existingDebt,
  onSubmit,
  rbtcPrice,
  fees,
}) => {
  const hasTrove = useMemo(
    () => existingCollateral !== '0' && existingDebt !== '0',
    [existingCollateral, existingDebt],
  );

  const [tcr, getTcr] = useCall<number>(async () => {
    const { ethers } = await getZeroProvider();
    const price = toWei(
      rbtcPrice
        ? rbtcPrice.toString()
        : await ethers.getPrice().then(value => value.toString()),
    );
    return await _getContracts(ethers.connection)
      .troveManager.getTCR(price)
      .then(fromWei)
      .then(Number);
  }, [rbtcPrice]);

  const isRecoveryMode = useMemo(() => tcr <= CRITICAL_COLLATERAL_RATIO, [tcr]);

  useEffect(() => {
    getTcr().catch(console.error);
  }, [getTcr]);

  const [debtType, setDebtType] = useState(AmountType.Add);
  const [collateralType, setCollateralType] = useState(AmountType.Add);

  const [fieldsTouched, setFieldsTouched] = useState(false);
  const [collateralAmount, setCollateralAmount] = useState('0');
  const [debtAmount, setDebtAmount] = useState('0');
  const [debtToken, setDebtToken] = useState<SupportedTokens>(BORROW_ASSETS[0]);

  const { value: creditWeiBalance } = useAssetBalance(debtToken);

  const { value: maxCollateralWeiAmount } = useMaxAssetBalance(
    SupportedTokens.rbtc,
    getRskChainId(),
    collateralType === AmountType.Add ? GAS_LIMIT_OPEN_TROVE : 0,
  );

  const isIncreasingDebt = useMemo(
    () => debtType === AmountType.Add,
    [debtType],
  );

  const isIncreasingCollateral = useMemo(
    () => collateralType === AmountType.Add,
    [collateralType],
  );

  const newDebt = useMemo(
    () =>
      Number(existingDebt) +
      normalizeAmountByType(Number(debtAmount), debtType),
    [debtAmount, existingDebt, debtType],
  );
  const newCollateral = useMemo(
    () =>
      Number(existingCollateral) +
      normalizeAmountByType(Number(collateralAmount), collateralType),
    [collateralAmount, collateralType, existingCollateral],
  );

  const rbtcGasPrice = useGasPrice();

  const maxRbtcWeiBalance = useMemo(
    () =>
      BigNumber.from(maxCollateralWeiAmount)
        .sub(
          composeGas(
            rbtcGasPrice || '0',
            hasTrove ? GAS_LIMIT_ADJUST_TROVE : GAS_LIMIT_OPEN_TROVE,
          ),
        )
        .toString(),
    [hasTrove, maxCollateralWeiAmount, rbtcGasPrice],
  );

  const minCollateralAmount = useMemo(() => {
    if (!isIncreasingCollateral) {
      return 0;
    }

    return (
      (MIN_DEBT_SIZE / Number(rbtcPrice || '0')) *
      (isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO)
    );
  }, [isIncreasingCollateral, isRecoveryMode, rbtcPrice]);

  const maxCollateralAmount = useMemo(
    () =>
      Number(
        isIncreasingCollateral
          ? fromWei(maxRbtcWeiBalance)
          : existingCollateral,
      ),
    [existingCollateral, isIncreasingCollateral, maxRbtcWeiBalance],
  );

  const maxCreditAmount = useMemo(() => {
    if (isIncreasingDebt) {
      return (
        ((Number(existingCollateral) + Number(fromWei(maxRbtcWeiBalance))) *
          Number(rbtcPrice || '0')) /
          (isRecoveryMode
            ? CRITICAL_COLLATERAL_RATIO
            : MINIMUM_COLLATERAL_RATIO) -
        Number(existingDebt)
      );
    }
    return Math.min(Number(fromWei(creditWeiBalance)), Number(existingDebt));
  }, [
    isIncreasingDebt,
    creditWeiBalance,
    existingDebt,
    existingCollateral,
    maxRbtcWeiBalance,
    rbtcPrice,
    isRecoveryMode,
  ]);

  const handleMaxCollateralAmountClick = useCallback(() => {
    setCollateralAmount(String(maxCollateralAmount));

    setFieldsTouched(true);
  }, [maxCollateralAmount]);

  const handleMaxCreditAmountClick = useCallback(() => {
    setDebtAmount(String(maxCreditAmount));
    setFieldsTouched(true);
  }, [maxCreditAmount]);

  const handleCollateralAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCollateralAmount(event.currentTarget.value);
      setFieldsTouched(true);
    },
    [],
  );

  const handleCreditAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDebtAmount(event.currentTarget.value);
      setFieldsTouched(true);
    },
    [],
  );

  const handleFormSubmit = useCallback(() => {
    let value: Partial<CreditLineSubmitValue> = {
      token: debtToken,
    };

    value[isIncreasingCollateral ? 'depositCollateral' : 'withdrawCollateral'] =
      collateralAmount;
    value[isIncreasingDebt ? 'borrow' : 'repay'] = debtAmount;

    onSubmit(value as CreditLineSubmitValue);
  }, [
    collateralAmount,
    debtAmount,
    debtToken,
    isIncreasingCollateral,
    isIncreasingDebt,
    onSubmit,
  ]);

  const initialRatio = useMemo(() => {
    if ([existingCollateral, existingDebt, rbtcPrice].some(v => !v)) {
      return 0;
    }
    return (
      ((Number(existingCollateral) * Number(rbtcPrice)) /
        Number(existingDebt)) *
        100 || 0
    );
  }, [existingCollateral, existingDebt, rbtcPrice]);

  const ratio = useMemo(() => {
    if ([newCollateral, newDebt, rbtcPrice].some(v => !v)) {
      return 0;
    }
    return (
      ((Number(newCollateral) * Number(rbtcPrice)) / Number(newDebt)) * 100 || 0
    );
  }, [newCollateral, newDebt, rbtcPrice]);

  const { t } = useTranslation();

  const debtTabs = useMemo(
    () => [
      {
        value: AmountType.Add,
        label: t(translations.adjustCreditLine.actions.borrow),
      },
      {
        value: AmountType.Remove,
        label: t(translations.adjustCreditLine.actions.repay),
        disabled: type === CreditLineType.Open,
      },
    ],
    [t, type],
  );

  const collateralTabs = useMemo(
    () => [
      {
        value: AmountType.Add,
        label: t(
          hasTrove
            ? translations.adjustCreditLine.actions.addCollateral
            : translations.adjustCreditLine.actions.collateral,
        ),
      },
      {
        value: AmountType.Remove,
        label: t(translations.adjustCreditLine.actions.withdrawCollateral),
        disabled: type === CreditLineType.Open,
      },
    ],
    [hasTrove, t, type],
  );

  const newDebtRenderer = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>
          {formatValue(value, 3)} {debtToken.toUpperCase()}
        </>
      ),
    [debtToken, t],
  );

  const newCollateralRenderer = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>
          {formatValue(value, 3)} {Bitcoin}
        </>
      ),
    [t],
  );

  const liquidationPriceRenderer = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>{formatValue(value, 3)} USD</>
      ),
    [t],
  );

  const collateralRatioRenderer = useCallback(
    (value: number) =>
      value === 0 ? t(translations.common.na) : <>{formatValue(value, 3)}%</>,
    [t],
  );

  const initialLiquidationPrice = useMemo(
    () =>
      MINIMUM_COLLATERAL_RATIO *
        (Number(existingDebt) / Number(existingCollateral)) || 0,
    [existingDebt, existingCollateral],
  );
  const initialLiquidationPriceRecoveryMode = useMemo(
    () =>
      CRITICAL_COLLATERAL_RATIO *
        (Number(existingDebt) / Number(existingCollateral)) || 0,
    [existingCollateral, existingDebt],
  );

  const liquidationPrice = useMemo(
    () => MINIMUM_COLLATERAL_RATIO * (newDebt / newCollateral) || 0,
    [newDebt, newCollateral],
  );
  const liquidationPriceRecoveryMode = useMemo(
    () => CRITICAL_COLLATERAL_RATIO * (newDebt / newCollateral) || 0,
    [newDebt, newCollateral],
  );

  const errors = useMemo(() => {
    if (!fieldsTouched) {
      return [];
    }
    const list: ErrorData[] = [];

    const userRatio = ratio / 100;
    const tcrPlus10 = tcr * 1.1;

    const tcrPercent = formatValue(tcr * 100, 2);
    const tcrPlus10Percent = formatValue(tcrPlus10 * 100, 2);
    const ccrPercent = formatValue(CRITICAL_COLLATERAL_RATIO * 100, 2);
    const mcrPercent = formatValue(MINIMUM_COLLATERAL_RATIO * 100, 2);

    // System is in recovery mode:
    if (tcr && tcr <= CRITICAL_COLLATERAL_RATIO) {
      // Warning: If the system is in recovery mode and the values the user is typing
      //  are causing the collateral ratio to be less than 10% above the TCR.
      if (userRatio < tcrPlus10) {
        list.push({
          level: ErrorLevel.Warning,
          message: t(translations.zeroPage.loc.errors.ratioWarningInRecovery, {
            value: tcrPlus10Percent,
          }),
          weight: 4,
        });
      }

      // Critical: If the system is in recovery mode and the values the user is typing
      //  are causing the collateral ratio to be below the TCR.
      if (userRatio < tcr) {
        list.push({
          level: ErrorLevel.Critical,
          message: t(translations.zeroPage.loc.errors.ratioErrorInRecovery, {
            value: tcrPercent,
          }),
          weight: 2,
        });
      }
    }
    // System is in normal mode:
    else {
      // Warning: If the system is in normal mode and the values the user is typing
      //  are causing the collateral ratio to be above the MCR and below the CCR (i.e., between 110% and 150%)
      if (
        userRatio > MINIMUM_COLLATERAL_RATIO &&
        userRatio < CRITICAL_COLLATERAL_RATIO
      ) {
        list.push({
          level: ErrorLevel.Warning,
          message: t(translations.zeroPage.loc.errors.ratioWarning, {
            value: ccrPercent,
          }),
          weight: 3,
        });
      }

      // Critical: If the system is in normal mode and the values the user is typing are causing the
      //  collateral ratio to be below the MCR (i.e., below 110%)
      if (userRatio < MINIMUM_COLLATERAL_RATIO) {
        list.push({
          level: ErrorLevel.Critical,
          message: t(translations.zeroPage.loc.errors.ratioError, {
            value: mcrPercent,
          }),
          weight: 1,
        });
      }
    }

    return list;
  }, [fieldsTouched, ratio, tcr, t]);

  const submitButtonDisabled = useMemo(() => {
    const hasCriticalError = errors.some(
      error => error.level === ErrorLevel.Critical,
    );
    const collateral = Number(collateralAmount);
    const debt = Number(debtAmount);
    const isFormValid =
      Number(existingDebt) > 0
        ? collateral > 0 || debt > 0
        : collateral > 0 && debt > 0;
    return hasCriticalError || !isFormValid;
  }, [collateralAmount, debtAmount, errors, existingDebt]);

  const debtError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (newDebt < MIN_DEBT_SIZE) {
      return t(translations.zeroPage.loc.errors.debtTooLow, {
        value: `${formatValue(MIN_DEBT_SIZE)} ${debtToken.toUpperCase()}`,
      });
    }

    if (
      toWei(debtAmount).gt(toWei(maxCreditAmount)) &&
      debtType === AmountType.Remove
    ) {
      const diff = Number(
        fromWei(toWei(debtAmount).sub(toWei(maxCreditAmount))),
      );
      return t(translations.zeroPage.loc.errors.repayBalanceTooLow, {
        value: formatValue(diff, 4),
        currency: debtToken.toUpperCase(),
      });
    }

    if (
      toWei(debtAmount).gt(toWei(maxCreditAmount)) &&
      debtType === AmountType.Add
    ) {
      const diff = Number(
        fromWei(toWei(debtAmount).sub(toWei(maxCreditAmount))),
      );
      return t(translations.zeroPage.loc.errors.creditBalanceTooLow, {
        value: formatValue(diff, 4),
        currency: debtToken.toUpperCase(),
      });
    }

    return undefined;
  }, [
    debtAmount,
    debtToken,
    debtType,
    fieldsTouched,
    maxCreditAmount,
    newDebt,
    t,
  ]);

  const collateralError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (toWei(newCollateral).lt(toWei(minCollateralAmount))) {
      return t(translations.zeroPage.loc.errors.collateralTooLow, {
        value: `${formatValue(
          minCollateralAmount,
          4,
        )} ${SupportedTokens.rbtc.toUpperCase()}`,
      });
    }

    if (
      toWei(collateralAmount).gt(maxCollateralWeiAmount) &&
      collateralType === AmountType.Add
    ) {
      const diff = Number(
        fromWei(toWei(collateralAmount || 0).sub(maxCollateralWeiAmount)),
      );
      return t(translations.zeroPage.loc.errors.balanceTooLow, {
        value: `${formatValue(diff, 4)} ${Bitcoin}`,
      });
    }

    if (
      toWei(collateralAmount).gt(maxCollateralWeiAmount) &&
      collateralType === AmountType.Remove
    ) {
      const diff = Number(
        fromWei(toWei(collateralAmount).sub(maxCollateralWeiAmount)),
      );
      return t(translations.zeroPage.loc.errors.withdrawBalanceTooLow, {
        value: `${formatValue(diff, 4)} ${SupportedTokens.rbtc.toUpperCase()}`,
      });
    }

    return undefined;
  }, [
    collateralAmount,
    collateralType,
    fieldsTouched,
    maxCollateralWeiAmount,
    minCollateralAmount,
    newCollateral,
    t,
  ]);

  const tokenOptions = useMemo(
    () =>
      BORROW_ASSETS.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [],
  );

  return (
    <div className="w-full">
      {hasTrove && (
        <CurrentTroveData
          debt={existingDebt}
          collateral={existingCollateral}
          rbtcPrice={rbtcPrice || '0'}
        />
      )}

      <FormGroup
        label={
          <Label
            symbol={debtToken}
            maxAmount={maxCreditAmount}
            tabs={debtTabs}
            activeTab={debtType}
            onTabChange={setDebtType}
            onMaxAmountClicked={handleMaxCreditAmountClick}
            hasTrove={hasTrove}
          />
        }
        className="w-full"
        dataAttribute="adjust-credit-line-credit-amount"
        errorLabel={debtError}
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={debtAmount}
            onChange={handleCreditAmountChange}
            maxAmount={maxCreditAmount}
            label={t(translations.adjustCreditLine.fields.debt.amount)}
            tooltip={t(translations.adjustCreditLine.fields.debt.tooltip)}
            className="w-full flex-grow-0 flex-shrink"
            invalid={!!debtError}
          />
          <Select
            value={debtToken}
            onChange={setDebtToken}
            options={tokenOptions}
            className="flex-grow flex-shrink-0"
            labelRenderer={({ value }) => (
              <AssetRenderer
                dataAttribute="adjust-credit-line-credit-asset"
                showAssetLogo
                asset={SupportedTokens[value]}
              />
            )}
          />
        </div>
      </FormGroup>
      <FormGroup
        label={
          <Label
            symbol={Bitcoin}
            maxAmount={maxCollateralAmount}
            tabs={collateralTabs}
            activeTab={collateralType}
            onTabChange={setCollateralType}
            onMaxAmountClicked={handleMaxCollateralAmountClick}
            hasTrove={hasTrove}
          />
        }
        className="max-w-none mt-8"
        dataAttribute="adjust-credit-line-collateral-amount"
        errorLabel={collateralError}
      >
        <AmountInput
          value={collateralAmount}
          onChange={handleCollateralAmountChange}
          maxAmount={maxCollateralAmount}
          label={t(translations.adjustCreditLine.fields.collateral.amount)}
          tooltip={t(translations.adjustCreditLine.fields.collateral.tooltip)}
          className="max-w-none"
          unit={Bitcoin}
          invalid={!!collateralError}
        />
      </FormGroup>
      {hasTrove && (
        <div className="mt-6">
          <SimpleTable>
            <Row
              label={t(translations.adjustCreditLine.labels.newDebt)}
              tooltip={t(translations.adjustCreditLine.labels.newDebtTooltip)}
              value={
                <DynamicValue
                  initialValue={Number(existingDebt)}
                  value={newDebt}
                  renderer={newDebtRenderer}
                />
              }
            />
            <Row
              label={t(translations.adjustCreditLine.labels.newCollateral)}
              tooltip={t(
                translations.adjustCreditLine.labels.newCollateralTooltip,
              )}
              value={
                <DynamicValue
                  initialValue={Number(existingCollateral)}
                  value={newCollateral}
                  renderer={newCollateralRenderer}
                />
              }
            />
          </SimpleTable>
        </div>
      )}

      <div className="flex flex-row justify-between items-center mt-6 mb-3">
        <div className="flex flex-row justify-start items-center gap-2">
          <span>{t(translations.adjustCreditLine.labels.collateralRatio)}</span>
          <HelperButton
            content={t(
              translations.adjustCreditLine.labels.collateralRatioTooltip,
            )}
          />
        </div>
        <div className="text-primary-10">
          <DynamicValue
            initialValue={initialRatio}
            value={ratio}
            renderer={collateralRatioRenderer}
          />
        </div>
      </div>
      <HealthBar
        start={CR_THRESHOLDS.start}
        middleStart={CR_THRESHOLDS.middleStart}
        middleEnd={CR_THRESHOLDS.middleEnd}
        end={CR_THRESHOLDS.end}
        value={ratio}
      />

      <ErrorList errors={errors} showSingleError />

      <div className="mt-6">
        <SimpleTable>
          <Row
            label={t(translations.adjustCreditLine.labels.liquidationPrice)}
            tooltip={t(
              translations.adjustCreditLine.labels.liquidationPriceTooltip,
            )}
            value={
              <DynamicValue
                initialValue={initialLiquidationPrice}
                value={liquidationPrice}
                renderer={liquidationPriceRenderer}
              />
            }
          />
          <Row
            label={t(
              translations.adjustCreditLine.labels.recoveryLiquidationPrice,
            )}
            tooltip={t(
              translations.adjustCreditLine.labels
                .recoveryLiquidationPriceTooltip,
            )}
            value={
              <DynamicValue
                initialValue={initialLiquidationPriceRecoveryMode}
                value={liquidationPriceRecoveryMode}
                renderer={liquidationPriceRenderer}
              />
            }
            valueClassName="text-primary-10"
          />
          <Row
            label={t(translations.adjustCreditLine.labels.rbtcPrice)}
            tooltip={t(translations.adjustCreditLine.labels.rbtcPriceTooltip)}
            value={<>{formatValue(Number(rbtcPrice), 3)} USD</>}
          />
          <Row
            label={t(translations.adjustCreditLine.labels.originationFee)}
            tooltip={t(
              translations.adjustCreditLine.labels.originationFeeTooltip,
            )}
            value={
              <>{formatValue(Number(fees?.borrowingRate().mul(100)), 1)}%</>
            }
          />
        </SimpleTable>
      </div>
      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={handleFormSubmit}
          dataAttribute="adjust-credit-line-confirm-button"
          disabled={submitButtonDisabled}
        />
      </div>
    </div>
  );
};
