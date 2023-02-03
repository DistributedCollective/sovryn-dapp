import React, { FC, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Button,
  FormGroup,
  Icon,
  Input,
  InputSize,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  Select,
  SimpleTable,
} from '@sovryn/ui';

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';
import { tokensToOptions } from '../../../utils/tokens';
import { Row } from './Row';

type CloseCreditLineProps = {
  collateralValue: string;
  creditValue: string;
  availableBalance: string;
  onSubmit: () => void;
};

export const CloseCreditLine: FC<CloseCreditLineProps> = ({
  collateralValue,
  creditValue,
  availableBalance,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [creditToken, setCreditToken] = useState<SupportedTokens>(
    SupportedTokens.dllr,
  );

  const collateralValueRenderer = useCallback(
    (value: number) =>
      `${formatValue(value, 6)} ${SupportedTokens.rbtc.toUpperCase()}`,
    [],
  );

  const insufficientBalance = useMemo(() => {
    return Number(creditValue) - Number(availableBalance);
  }, [availableBalance, creditValue]);

  const hasError = useMemo(
    () => Number(availableBalance) < Number(creditValue),
    [creditValue, availableBalance],
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
            value={creditValue}
            className="w-full flex-grow-0 flex-shrink"
            dataAttribute="close-credit-line-credit-amount"
            readOnly
          />
          <div className="min-w-[6.313rem]">
            <Select
              value={creditToken}
              onChange={setCreditToken}
              options={tokensToOptions([
                SupportedTokens.zusd,
                SupportedTokens.dllr,
              ])}
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
          tooltip={t(translations.closeCreditLine.fields.collateral.tooltip)}
          value={collateralValueRenderer(Number(collateralValue))}
        />
      </SimpleTable>

      {hasError && (
        <Paragraph
          children={
            <span className="flex justify-center items-center mt-4 p-2 rounded bolder-error bg-error bg-opacity-20">
              <Icon icon="failed-tx" size={20} className="mr-3 w-5 min-w-5" />
              {t(translations.closeCreditLine.error, {
                amount: insufficientBalance,
                token: creditToken.toUpperCase(),
              })}
            </span>
          }
          className="text-error-light mt-4 font-medium"
          size={ParagraphSize.small}
          dataAttribute="close-credit-line-error"
        />
      )}

      <div className="mt-24 flex flex-row items-center justify-between gap-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          disabled={hasError}
          onClick={onSubmit}
          dataAttribute="close-credit-line-confirm"
        />
      </div>
    </>
  );
};
