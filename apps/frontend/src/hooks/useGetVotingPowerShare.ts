import { Decimal } from '@sovryn/utils';

import { useGetPersonalStakingStatistics } from '../app/5_pages/StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { useGetStakingStatistics } from '../app/5_pages/StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';
import { decimalic } from '../utils/math';

export const useGetVotingPowerShare = (): Decimal => {
  const { votingPower } = useGetPersonalStakingStatistics();
  const { totalVotingPower } = useGetStakingStatistics();

  if (!votingPower || !totalVotingPower) {
    return Decimal.ZERO;
  }

  const votingPowerDecimal = decimalic(votingPower.toString());
  const totalVotingPowerDecimal = decimalic(totalVotingPower.toString());

  const votingPowerShare = votingPowerDecimal
    .div(totalVotingPowerDecimal)
    .mul(100);

  return votingPowerShare;
};
