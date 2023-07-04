import { VestingContractTableRecord } from './Vesting.types';
import {
  UnlockedBalance,
  renderBalance,
  renderContractAddress,
} from './Vestings.utils';

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
    cellRenderer: UnlockedBalance,
  },
  {
    id: 'address',
    title: 'Address',
    cellRenderer: renderContractAddress,
  },
];
