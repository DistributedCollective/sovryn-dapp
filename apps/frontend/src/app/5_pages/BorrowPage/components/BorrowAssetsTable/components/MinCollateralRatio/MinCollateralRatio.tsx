import React, { FC } from 'react';

import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../../../../constants/lending';
import { LendingPool } from '../../../../../../../utils/LendingPool';

type MinCollateralRatioProps = {
  pool: LendingPool;
};

export const MinCollateralRatio: FC<MinCollateralRatioProps> = ({ pool }) => {
  // const borrowToken = useMemo(() => pool.getAsset(), [pool]);
  // const assetContract = useGetTokenContract(borrowToken);

  // const { data } = useGetLoanParamsSetupsQuery({
  //   client: rskClient,
  // });
  // console.log({
  //   assetContract,
  // });

  // console.log(
  //   (data?.loanParamsSetups || []).find(item =>
  //     areAddressesEqual(item.loanToken.id, assetContract?.address || ''),
  //   ),
  // );

  return (
    <div>
      {MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100).toString()}%
    </div>
  );
};
