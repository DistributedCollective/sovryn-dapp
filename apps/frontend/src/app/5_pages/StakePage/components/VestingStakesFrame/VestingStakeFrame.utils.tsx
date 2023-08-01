import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize, TransactionId } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  SOV,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { VestingContractType } from '../../../../../utils/graphql/rsk/generated';
import { getRskExplorerUrl } from '../../../../../utils/helpers';
import { VestingContractTableRecord } from './VestingStakesFrame.types';

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

export const vestingTypeToTitleMapping = (item: VestingContractType) => {
  switch (item) {
    case VestingContractType.Team:
      return t(translations.rewardPage.vesting.vestingTypeTitles.team);
    case VestingContractType.Rewards:
      return t(
        translations.rewardPage.vesting.vestingTypeTitles.liquidityMining,
      );
    case VestingContractType.FourYearVesting:
      return t(translations.rewardPage.vesting.vestingTypeTitles.investor);
    default:
      return item;
  }
};

export const generateRowTitle = (item: VestingContractTableRecord) => (
  <div className="flex flex-col items-start gap-1 font-medium">
    <Paragraph size={ParagraphSize.small} className="text-left text-gray-40">
      {item.type}
    </Paragraph>
    {renderBalance(item.currentBalance)}
  </div>
);
