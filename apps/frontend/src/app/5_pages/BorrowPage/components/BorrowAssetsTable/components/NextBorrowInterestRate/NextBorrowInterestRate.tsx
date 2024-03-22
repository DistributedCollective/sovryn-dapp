import React, { FC } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useGetBorrowingAPR } from '../../../../hooks/useGetBorrowingAPR';

type NextBorrowInterestRateProps = {
  asset: string;
  amount?: Decimal;
};

export const NextBorrowInterestRate: FC<NextBorrowInterestRateProps> = ({
  asset,
  amount = Decimal.ZERO,
}) => {
  const { borrowApr } = useGetBorrowingAPR(asset, amount);

  return (
    <div className="lg:text-base text-sm pr-1 lg:font-semibold font-medium prevent-row-click">
      <AmountRenderer
        value={Decimal.fromBigNumberString(borrowApr.toString()).toString()}
        suffix={`%`}
        precision={2}
        dataAttribute="borrow-next-borrow-interest-rate"
      />
    </div>
  );
};
