import React from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { StakeItem } from './StakesFrame.types';

export const generateRowTitle = (item: StakeItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    <AmountRenderer
      value={item.stakedAmount}
      suffix={SupportedTokens.sov}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="stake-amount-mobile"
    />
  </Paragraph>
);
