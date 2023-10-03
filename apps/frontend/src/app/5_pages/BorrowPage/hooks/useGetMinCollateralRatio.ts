import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../constants/lending';
import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { rskClient } from '../../../../utils/clients';
import { useGetLoanParamsSetupsQuery } from '../../../../utils/graphql/rsk/generated';
import { decimalic } from '../../../../utils/math';

export const useGetMinCollateralRatio = (token: SupportedTokens): Decimal => {
  const loanToken = useGetTokenContract(token)?.address;

  const { data } = useGetLoanParamsSetupsQuery({
    client: rskClient,
    variables: {
      loanToken: loanToken?.toLowerCase(),
    },
  });

  return useMemo(() => {
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

    return decimalic(minMargin).div(100);
  }, [data?.loanParamsSetups]);
};
