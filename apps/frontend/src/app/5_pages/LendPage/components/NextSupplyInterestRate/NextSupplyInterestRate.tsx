import React, { FC } from 'react';

import classNames from 'classnames';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useGetNextSupplyInterestRate } from '../../hooks/useGetNextSupplyInterestRate';

type NextSupplyInterestRateProps = {
  asset: SupportedTokens;
  className?: string;
};

export const NextSupplyInterestRate: FC<NextSupplyInterestRateProps> = ({
  asset,
  className,
}) => {
  const { interestRate } = useGetNextSupplyInterestRate(asset);

  return (
    <div
      className={classNames(
        className,
        'lg:text-base text-sm pr-1 lg:font-semibold font-medium prevent-row-click',
      )}
    >
      <AmountRenderer
        value={interestRate}
        suffix={`%`}
        precision={2}
        dataAttribute="lend-next-supply-interest-rate"
      />
    </div>
  );
};
