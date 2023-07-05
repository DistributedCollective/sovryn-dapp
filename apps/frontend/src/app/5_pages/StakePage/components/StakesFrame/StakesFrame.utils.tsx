import React from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { StakingType } from './StakesFrame.types';

export const generateRowTitle = (item: StakingType) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    <AmountRenderer
      value={item.amount}
      suffix={SupportedTokens.sov}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix={false}
      dataAttribute="stake-amount-mobile"
    />
  </Paragraph>
);
