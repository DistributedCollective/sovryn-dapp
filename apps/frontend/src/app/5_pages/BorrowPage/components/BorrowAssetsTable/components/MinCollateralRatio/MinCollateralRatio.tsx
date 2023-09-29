import React, { FC, useMemo } from 'react';

import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../../../../constants/lending';
import { useGetTokenContract } from '../../../../../../../hooks/useGetContract';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { rskClient } from '../../../../../../../utils/clients';
import { useGetLoanParamsSetupsQuery } from '../../../../../../../utils/graphql/rsk/generated';

type MinCollateralRatioProps = {
  pool: LendingPool;
};

export const MinCollateralRatio: FC<MinCollateralRatioProps> = ({ pool }) => {
  const borrowToken = useMemo(() => pool.getAsset(), [pool]);
  const assetContract = useGetTokenContract(borrowToken);

  const { data } = useGetLoanParamsSetupsQuery({
    client: rskClient,
    variables: {
      loanToken: assetContract?.address.toLowerCase(),
    },
  });

  const maintenanceMargin = useMemo(() => {
    const minMargins: {
      [key: string]: {
        timestamp: number;
        maintenanceMargin: number;
      };
    } = {};

    data?.loanParamsSetups.forEach(param => {
      if (
        (minMargins[param.collateralToken.id]?.timestamp || 0) < param.timestamp
      ) {
        minMargins[param.collateralToken.id] = {
          timestamp: param.timestamp,
          maintenanceMargin: Number(param.maintenanceMargin),
        };
      }
    });

    console.log(minMargins);
    let minMargin = Infinity;
    Object.values(minMargins).forEach(param => {
      if (param.maintenanceMargin < minMargin) {
        minMargin = param.maintenanceMargin + 100;
      }
    });

    if (minMargin === Infinity) {
      minMargin =
        MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100).toNumber();
    }

    return minMargin;
  }, [data?.loanParamsSetups]);

  return <div>{maintenanceMargin}%</div>;
};
