import React, { FC, useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Button,
  FormGroup,
  Input,
  InputSize,
  Paragraph,
  ParagraphSize,
  Select,
  SimpleTable,
} from '@sovryn/ui';

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';
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
  const [error, setError] = useState(false);
  const availableTokens = [SupportedTokens.dllr, SupportedTokens.zusd];
  const tokens = availableTokens.map(token => ({
    value: token,
    label: token.toUpperCase(),
  }));

  const [creditToken, setCreditToken] = useState<SupportedTokens>(
    SupportedTokens.dllr,
  );

  const collateralValueRenderer = useCallback(
    (value: number) =>
      `${formatValue(value, 6)} ${SupportedTokens.rbtc.toUpperCase()}`,
    [],
  );

  const insufficientBalance = useMemo(() => {
    return Number(availableBalance) - Number(creditValue);
  }, [availableBalance, creditValue]);

  useEffect(() => {
    Number(availableBalance) < Number(creditValue)
      ? setError(true)
      : setError(false);
  }, [creditValue, availableBalance]);

  return (
    <>
      <Paragraph
        className="font-medium"
        size={ParagraphSize.base}
        children={t(translations.closeCreditLine.selectToken)}
      />

      <FormGroup className="w-full mt-5">
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <Input
            size={InputSize.large}
            value={creditValue}
            className="w-full flex-grow-0 flex-shrink"
            readOnly
          />
          <div className="min-w-24">
            <Select
              value={creditToken}
              onChange={setCreditToken}
              options={tokens}
              labelRenderer={({ value }) => (
                <AssetRenderer showAssetLogo asset={SupportedTokens[value]} />
              )}
            />
          </div>
        </div>
      </FormGroup>

      <SimpleTable className="max-w-none mt-5">
        <Row
          label={t(translations.closeCreditLine.fields.collateral.label)}
          tooltip={t(translations.closeCreditLine.fields.collateral.tooltip)}
          value={collateralValueRenderer(Number(collateralValue))}
        />
      </SimpleTable>

      {error && (
        <Paragraph
          children={t(translations.closeCreditLine.error, {
            amount: insufficientBalance,
            token: creditToken.toUpperCase(),
          })}
          className="text-error-light mt-4"
          size={ParagraphSize.small}
        />
      )}

      <div className="mt-24 flex flex-row items-center justify-between gap-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          disabled={error}
          onClick={onSubmit}
        />
      </div>
    </>
  );
};
