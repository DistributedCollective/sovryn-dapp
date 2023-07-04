import { VestingContractTableRecord } from './Vesting.types';
import { renderBalance, renderContractAddress } from './Vestings.utils';

export const columnsConfig = [
  {
    id: 'type',
    title: 'Type',
  },
  {
    id: 'currentBalance',
    title: 'Current balance',
    cellRenderer: (item: VestingContractTableRecord) =>
      renderBalance(item.currentBalance),
  },
  {
    id: 'availableBalance',
    title: 'Available balance',
    cellRenderer: (item: VestingContractTableRecord) =>
      renderBalance(item.availableBalance),
  },
  {
    id: 'address',
    title: 'Address',
    cellRenderer: renderContractAddress,
  },
];
