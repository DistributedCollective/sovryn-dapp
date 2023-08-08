import { StakeItem } from '../../5_pages/StakePage/components/StakesFrame/StakesFrame.types';

export type StakeFormProps = {
  onSuccess: () => void;
  hasStakedValue?: boolean;
  votingPower?: string;
  stake?: StakeItem;
};

export type AdjustStakeFormProps = {
  stake: StakeItem;
  onSuccess: () => void;
};

export type FilteredDate = {
  key: number;
  label: string;
  date: Date;
};
