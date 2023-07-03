import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { Redemption } from '../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const generateRowTitle = (item: Redemption) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${t(translations.conversionsHistory.redeem)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);

export const renderRedemptionFee = (redemption: Redemption) => (
  <>
    {redemption.fee.length ? (
      <AmountRenderer
        value={redemption.fee}
        suffix={BITCOIN}
        precision={BTC_RENDER_PRECISION}
        dataAttribute="redemption-history-fee"
      />
    ) : (
      '-'
    )}
  </>
);
