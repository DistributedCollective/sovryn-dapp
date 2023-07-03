import React from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { VestingContract } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const generateRowTitle = (item: VestingContract) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    <AmountRenderer
      value={item.currentBalance}
      suffix={SupportedTokens.sov}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix={false}
      dataAttribute="vesting-stake-amount-mobile"
    />
    {' - '}
    {dateFormat(item.createdAtTimestamp)}
  </Paragraph>
);
