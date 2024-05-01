import React from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { COMMON_SYMBOLS, findAsset } from '../../../../../utils/asset';
import { StakeItem } from './StakesFrame.types';

export const generateRowTitle = (item: StakeItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    <AmountRenderer
      value={item.stakedAmount}
      suffix={findAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="stake-amount-mobile"
    />
  </Paragraph>
);
