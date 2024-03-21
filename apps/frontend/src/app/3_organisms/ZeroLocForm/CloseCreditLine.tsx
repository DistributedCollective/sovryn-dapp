import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  FormGroup,
  Input,
  InputSize,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  Select,
  SimpleTable,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { BITCOIN, BTC_RENDER_PRECISION } from '../../../constants/currencies';
import { getTokenDisplayName } from '../../../constants/tokens';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { Row } from './Row';
import { useZeroData } from './hooks/useZeroData';
import { COMMON_SYMBOLS } from '../../../utils/asset';

type CloseCreditLineProps = {
  collateralValue: Decimal;
  creditValue: Decimal;
  onSubmit: (token: string) => void;
  rbtcPrice: Decimal;
};

export const CloseCreditLine: FC<CloseCreditLineProps> = ({
  collateralValue,
  creditValue,
  onSubmit,
  rbtcPrice,
}) => {
  const { isRecoveryMode } = useZeroData(rbtcPrice);
  const [creditToken, setCreditToken] = useState<string>(COMMON_SYMBOLS.ZUSD);

  const { checkMaintenance, States } = useMaintenance();
  const closeLocked = checkMaintenance(States.ZERO_CLOSE_LOC);
  const dllrLocked = checkMaintenance(States.ZERO_DLLR);

  const { balance: availableBalance } = useAssetBalance(creditToken);

  const collateralValueRenderer = useCallback(
    (value: Decimal) => (
      <AmountRenderer
        value={value}
        suffix={BITCOIN}
        precision={BTC_RENDER_PRECISION}
      />
    ),
    [],
  );

  const handleSubmit = useCallback(
    () => onSubmit(creditToken),
    [creditToken, onSubmit],
  );

  const insufficientBalance = useMemo(() => {
    return Number(creditValue) - Number(availableBalance);
  }, [availableBalance, creditValue]);

  const hasError = useMemo(
    () => Number(availableBalance) < Number(creditValue),
    [creditValue, availableBalance],
  );

  const isInMaintenance = useMemo(
    () => closeLocked || (dllrLocked && creditToken === COMMON_SYMBOLS.DLLR),
    [closeLocked, dllrLocked, creditToken],
  );

  const submitButtonDisabled = useMemo(
    () => hasError || isInMaintenance || isRecoveryMode,
    [isInMaintenance, hasError, isRecoveryMode],
  );

  const tokenOptions = useMemo(
    () =>
      [COMMON_SYMBOLS.ZUSD, COMMON_SYMBOLS.DLLR].map(token => ({
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
    <>
      <Paragraph
        className="font-medium"
        size={ParagraphSize.base}
        children={t(translations.closeCreditLine.title)}
        dataAttribute="close-credit-line"
        style={ParagraphStyle.tall}
      />

      <FormGroup className="w-full mt-5">
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <Input
            size={InputSize.large}
            value={creditValue.toString()}
            className="w-full flex-grow-0 flex-shrink"
            dataAttribute="close-credit-line-credit-amount"
            readOnly
          />
          <div className="min-w-[6.313rem]">
            <Select
              value={creditToken}
              onChange={setCreditToken}
              options={tokenOptions}
              labelRenderer={({ value }) => (
                <AssetRenderer
                  dataAttribute="close-credit-line-credit-asset"
                  showAssetLogo
                  asset={value}
                />
              )}
              className="w-full"
              dataAttribute="close-credit-line-credit-token"
            />
          </div>
        </div>
      </FormGroup>

      <SimpleTable
        className="max-w-none mt-5"
        dataAttribute="close-credit-line-table"
      >
        <Row
          label={t(translations.closeCreditLine.fields.collateral.label)}
          value={collateralValueRenderer(collateralValue)}
        />
      </SimpleTable>

      {hasError && !isRecoveryMode && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.closeCreditLine.error, {
            amount: insufficientBalance,
            token: getTokenDisplayName(creditToken),
          })}
          dataAttribute="close-credit-line-error"
        />
      )}

      {isRecoveryMode && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.closeCreditLine.isRecoveryModeError)}
          dataAttribute="close-credit-line-recovery-error"
        />
      )}

      <div className="mt-24 flex flex-row items-center justify-between gap-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          disabled={submitButtonDisabled}
          onClick={handleSubmit}
          dataAttribute="close-credit-line-confirm"
        />
      </div>
      {isInMaintenance && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.featureDisabled)}
        />
      )}
    </>
  );
};
