import React from 'react';

import { Paragraph, ParagraphSize, TransactionId } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  SOV,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { getRskExplorerUrl } from '../../../../../utils/helpers';
import { VestingContractTableRecord } from './Vesting.types';

const rskExplorerUrl = getRskExplorerUrl();

export const renderBalance = (balance: string | undefined) => {
  if (!balance || balance === '') {
    return '-';
  }

  return (
    <AmountRenderer
      value={balance}
      suffix={SOV}
      precision={TOKEN_RENDER_PRECISION}
      dataAttribute="vesting-rewards-current-balance"
    />
  );
};

export const renderContractAddress = (item: VestingContractTableRecord) => (
  <TransactionId
    href={`${rskExplorerUrl}/address/${item.address}`}
    value={item.address}
    dataAttribute="vesting-rewards-address"
  />
);

export const generateRowTitle = (item: VestingContractTableRecord) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {item.type}
    {' - '}
    {renderBalance(item.currentBalance)}
  </Paragraph>
);
