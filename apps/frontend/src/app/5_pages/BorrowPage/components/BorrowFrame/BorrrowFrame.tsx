import React, { FC, useMemo } from 'react';

import { useAccount } from '../../../../../hooks/useAccount';
import { BorrowAssetsTable } from '../BorrowAssetsTable/BorrowAssetsTable';
import { OpenLoansTable } from '../OpenLoansTable/OpenLoansTable';
import { useGetOpenLoans } from '../OpenLoansTable/hooks/useGetOpenLoans';

export const BorrowFrame: FC = () => {
  const { account } = useAccount();
  const { data: loans, loading } = useGetOpenLoans();

  const hasOpenLoans = useMemo(
    () => loans?.length > 0 && account,
    [loans, account],
  );

  return (
    <>
      {hasOpenLoans && <OpenLoansTable loans={loans} loading={loading} />}
      <BorrowAssetsTable />
    </>
  );
};
