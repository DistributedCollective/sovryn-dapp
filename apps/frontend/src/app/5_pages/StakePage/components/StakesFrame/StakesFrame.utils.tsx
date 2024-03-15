import React from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { StakeItem } from './StakesFrame.types';
import { COMMON_SYMBOLS, normalizeAsset } from '../../../../../utils/asset';
import { RSK_CHAIN_ID } from '../../../../../config/chains';

export const generateRowTitle = (item: StakeItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    <AmountRenderer
      value={item.stakedAmount}
      suffix={normalizeAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="stake-amount-mobile"
    />
  </Paragraph>
);
