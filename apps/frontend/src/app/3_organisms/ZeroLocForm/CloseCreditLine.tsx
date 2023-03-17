import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
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

import { LedgerPermitLocked } from '../../1_atoms/LedgerPermitLocked/LedgerPermitLocked';
import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { useAccount } from '../../../hooks/useAccount';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { Bitcoin, LEDGER } from '../../../utils/constants';
import { Row } from './Row';
import { BTC_RENDER_PRECISION } from './constants';
import { BigNumber } from 'ethers';

type CloseCreditLineProps = {
  collateralValue: BigNumber;
  creditValue: BigNumber;
  onSubmit: (token: SupportedTokens) => void;
};

export const CloseCreditLine: FC<CloseCreditLineProps> = ({
  collateralValue,
  creditValue,
  onSubmit,
}) => {
  const [creditToken, setCreditToken] = useState<SupportedTokens>(
    SupportedTokens.dllr,
  );

  const { checkMaintenance, States } = useMaintenance();
  const closeLocked = checkMaintenance(States.ZERO_CLOSE_LOC);
  const dllrLocked = checkMaintenance(States.ZERO_DLLR);

  const { balance: availableBalance } = useAssetBalance(creditToken);

  const collateralValueRenderer = useCallback(
    (value: BigNumber) => (
      <AmountRenderer
        value={value}
        suffix={Bitcoin}
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
    () => closeLocked || (dllrLocked && creditToken === SupportedTokens.dllr),
    [closeLocked, dllrLocked, creditToken],
  );

  const submitButtonDisabled = useMemo(
    () => hasError || isInMaintenance,
    [isInMaintenance, hasError],
  );

  const tokenOptions = useMemo(
    () =>
      [SupportedTokens.zusd, SupportedTokens.dllr].map(token => ({
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

  const { type } = useAccount();

  const ledgerAndDllr = useMemo(
    () => type === LEDGER && creditToken === SupportedTokens.dllr,
    [creditToken, type],
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
                  asset={SupportedTokens[value]}
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

      {hasError && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.closeCreditLine.error, {
            amount: insufficientBalance,
            token: creditToken.toUpperCase(),
          })}
          dataAttribute="close-credit-line-error"
        />
      )}

      {ledgerAndDllr && !hasError && <LedgerPermitLocked />}

      <div className="mt-24 flex flex-row items-center justify-between gap-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          disabled={submitButtonDisabled || ledgerAndDllr}
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
