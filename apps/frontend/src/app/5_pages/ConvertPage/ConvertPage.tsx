import React, { FC, useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  Icon,
  IconNames,
  noop,
  Paragraph,
  ParagraphSize,
  Select,
} from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';

const allowedTokens = [
  SupportedTokens.dllr,
  SupportedTokens.zusd,
  SupportedTokens.doc,
];

const tokens = SupportedTokenList.filter(item =>
  allowedTokens.includes(item.symbol),
).map(token => ({
  value: token.symbol,
  label: token.symbol.toUpperCase(),
}));

// TODO: This will be replaced by a fetched token balance
const MAX_CONVERT_VALUE = 100;

const commonTranslations = translations.common;
const pageTranslations = translations.convertPage;

const ConvertPage: FC = () => {
  const { t } = useTranslation();

  const [sourceAmount, setSourceAmount] = useState('0');
  const [sourceToken, setSourceToken] = useState<SupportedTokens>(
    SupportedTokens.dllr,
  );
  const [destinationAmount, setDestinationAmount] = useState('0');
  const [destinationToken, setDestinationToken] = useState<SupportedTokens>(
    SupportedTokens.dllr,
  );

  const onMaximumSourceAmountClick = useCallback(
    () => setSourceAmount(String(MAX_CONVERT_VALUE)),
    [],
  );

  const onSwitchClick = useCallback(() => {
    setDestinationToken(sourceToken);
    setSourceToken(destinationToken);
    setSourceAmount('0');
    setDestinationAmount('0');
  }, [destinationToken, sourceToken]);

  return (
    <div className="w-full flex flex-col items-center mt-24">
      <Heading>{t(pageTranslations.title)}</Heading>
      <Paragraph className="mt-4">{t(pageTranslations.subtitle)}</Paragraph>

      <div className="mt-12 border border-gray-50 rounded w-[28rem] p-6 bg-gray-90">
        <div className="bg-gray-80 rounded p-6">
          <div className="w-full flex flex-row justify-between items-center">
            <Paragraph size={ParagraphSize.base}>
              {t(pageTranslations.form.convertFrom)}
            </Paragraph>

            <button
              onClick={onMaximumSourceAmountClick}
              className="text-gray-20 text-xs font-medium underline whitespace-nowrap"
            >
              ({t(commonTranslations.max)} {formatValue(MAX_CONVERT_VALUE, 4)}{' '}
              {sourceToken.toUpperCase()})
            </button>
          </div>

          <div className="w-full flex flex-row justify-between items-center gap-3  mt-3.5">
            <AmountInput
              value={sourceAmount}
              onChangeText={setSourceAmount}
              maxAmount={MAX_CONVERT_VALUE}
              label={t(commonTranslations.amount)}
              tooltip={t(pageTranslations.form.sourceAmountTooltip)}
              min={0}
              decimalPrecision={1}
              className="w-full flex-grow-0 flex-shrink"
            />
            <Select
              value={sourceToken}
              onChange={setSourceToken}
              options={tokens}
            />
          </div>
        </div>

        <div className="flex justify-center rounded-full -mt-3.5">
          <button
            className="w-11 h-11 rounded-full bg-gray-90 flex justify-center items-center"
            onClick={onSwitchClick}
          >
            <Icon icon={IconNames.PENDING} className="text-gray-50" size={24} />
          </button>
        </div>

        <div className="bg-gray-80 rounded p-6 -mt-3.5">
          <Paragraph size={ParagraphSize.base}>
            {t(pageTranslations.form.convertTo)}
          </Paragraph>

          <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
            <AmountInput
              value={destinationAmount}
              onChangeText={setDestinationAmount}
              label={t(commonTranslations.amount)}
              tooltip={t(pageTranslations.form.destinationAmountTooltip)}
              readOnly
              className="w-full flex-grow-0 flex-shrink"
            />
            <Select
              value={destinationToken}
              onChange={setDestinationToken}
              options={tokens}
            />
          </div>
        </div>

        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text={t(commonTranslations.buttons.confirm)}
          className="w-full mt-8"
          onClick={noop}
        />
      </div>
    </div>
  );
};

export default ConvertPage;
