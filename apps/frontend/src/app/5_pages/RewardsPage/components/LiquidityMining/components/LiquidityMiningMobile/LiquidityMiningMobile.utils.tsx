import React, { ReactNode } from 'react';

import { t } from 'i18next';

import { Paragraph, SimpleTableRow } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../../../utils/asset';

const pageTranslations = translations.rewardPage.liquidityMining;

export const renderParagraph = (children: ReactNode) => (
  <Paragraph
    className="text-center italic text-base mt-2 block md:hidden"
    children={children}
  />
);

export const renderAmount = (value: Decimal | string, label: string) => (
  <SimpleTableRow
    label={t(pageTranslations.types[label])}
    value={
      <AmountRenderer
        value={value}
        suffix={findAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
        precision={TOKEN_RENDER_PRECISION}
      />
    }
    valueClassName="text-sov-white"
    className="mb-1"
  />
);

export const renderPool = (pool: string) => (
  <SimpleTableRow
    label={t(pageTranslations.pool)}
    value={pool}
    valueClassName="text-sov-white"
    className="mb-1"
  />
);
