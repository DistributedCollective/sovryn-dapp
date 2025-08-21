import { FC, useEffect } from 'react';

import { Decimal } from '@sovryn/utils';

import { useGetStakingBalanceOf } from '../../../../../../../../../StakePage/hooks/useGetStakingBalanceOf';

type VestingTypeValueProps = {
  vestingContract: string;
  onBalanceChange: (balanceToAdd: Decimal) => void;
  block: number;
};

export const VestingTypeValue: FC<VestingTypeValueProps> = ({
  vestingContract,
  onBalanceChange,
  block,
}) => {
  const { balance } = useGetStakingBalanceOf(vestingContract);
  useEffect(() => {
    onBalanceChange(Decimal.from(balance.toString()));
  }, [balance, onBalanceChange, block]);

  return null;
};
