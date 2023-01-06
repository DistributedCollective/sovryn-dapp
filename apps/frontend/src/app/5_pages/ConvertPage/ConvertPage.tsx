import React, { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
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

const ConvertPage: FC = () => (
  <div className="w-full flex flex-col items-center mt-24">
    <Heading>Convert</Heading>
    <Paragraph className="mt-4">Convert between assets</Paragraph>

    <div className="mt-12 border border-gray-50 rounded w-[23.625rem] p-6 bg-gray-90">
      <div className="bg-gray-80 rounded p-6">
        <div className="w-full flex flex-row justify-between items-center">
          <Paragraph size={ParagraphSize.base}>Convert from</Paragraph>

          <button
            onClick={noop}
            className="text-gray-20 text-xs font-medium underline whitespace-nowrap"
          >
            (max {formatValue(100, 4)} DLLR)
          </button>
        </div>

        <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
          <AmountInput
            value={0}
            onChange={noop}
            maxAmount={100}
            label="Amount"
            tooltip="Important info"
            className="w-full flex-grow-0 flex-shrink"
          />
          <Select value={tokens[0].value} onChange={noop} options={tokens} />
        </div>
      </div>

      <div className="bg-gray-80 rounded p-6 mt-5">
        <Paragraph size={ParagraphSize.base}>Convert to</Paragraph>

        <div className="w-full flex flex-row justify-between items-center gap-3 mt-3.5">
          <AmountInput
            value={0}
            onChange={noop}
            maxAmount={100}
            label="Amount"
            tooltip="Important info"
            className="w-full flex-grow-0 flex-shrink"
          />
          <Select value={tokens[1].value} onChange={noop} options={tokens} />
        </div>
      </div>

      <Button
        type={ButtonType.reset}
        style={ButtonStyle.primary}
        text={t(translations.common.buttons.confirm)}
        className="w-full mt-8"
        onClick={noop}
      />
    </div>
  </div>
);

export default ConvertPage;
