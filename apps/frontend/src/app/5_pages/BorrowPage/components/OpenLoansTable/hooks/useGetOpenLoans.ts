import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { useGetActiveLoansQuery } from '../../../../../../utils/graphql/rsk/generated';
import {
  calculateCollateralRatio,
  calculateLiquidationPrice,
  isSupportedPool,
} from '../OpenLoans.utils';
import { LoanItem, LoanItemSmartContract } from '../OpenLoansTable.types';

const start = 0;
const count = 1000;
const loanType = 2;
const isLender = false;
const unsafeOnly = false;

export const useGetOpenLoans = () => {
  const { account } = useAccount();
  const { value: blockNumber } = useBlockNumber();
  const [processedBlock, setProcessedBlock] = useState<number | undefined>();
  const contract = useLoadContract('protocol', 'protocol', defaultChainId);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [loanItemsSmartContract, setLoanItemsSmartContract] = useState<
    LoanItemSmartContract[]
  >([]);

  const {
    data,
    loading: loadingSubgraph,
    refetch,
  } = useGetActiveLoansQuery({
    variables: { user: account },
  });

  const loading = useMemo(
    () => loadingLoans || loadingSubgraph,
    [loadingLoans, loadingSubgraph],
  );

  const getUserLoans = useCallback(async () => {
    if (!account || !contract) {
      setLoadingLoans(false);
      return;
    }

    try {
      setLoadingLoans(true);
      const loans = await contract.getUserLoans(
        account,
        start,
        count,
        loanType,
        isLender,
        unsafeOnly,
      );

      if (loans) {
        setLoanItemsSmartContract(
          loans.map(item => ({
            id: item.loanId,
            debt: Decimal.fromBigNumberString(item.principal),
            collateral: Decimal.fromBigNumberString(item.collateral),
            interestOwedPerDay: Decimal.fromBigNumberString(
              item.interestOwedPerDay,
            ),
          })),
        );
      }
    } catch (error) {
      console.error(`Error while fetching loans: ${error}`);
    } finally {
      setLoadingLoans(false);
    }
  }, [account, contract]);

  useEffect(() => {
    if (blockNumber !== processedBlock) {
      refetch();
      getUserLoans();
      setProcessedBlock(blockNumber);
    }
  }, [blockNumber, getUserLoans, processedBlock, refetch]);

  if (!data?.loans || !contract || !loanItemsSmartContract) {
    return { data: [], loading };
  }

  const result: LoanItem[] =
    data?.loans
      .filter(item =>
        isSupportedPool(item.loanToken.symbol, item.collateralToken.symbol),
      )
      .map(item => {
        const loanSmartContract = loanItemsSmartContract.find(
          loan => loan.id.toLowerCase() === item.id.toLowerCase(),
        );

        return {
          id: item.id,
          debt: loanSmartContract?.debt.toNumber() || 0,
          debtAsset: item.loanToken.symbol || '',
          collateral: loanSmartContract?.collateral.toNumber() || 0,
          collateralAsset: item.collateralToken.symbol || '',
          collateralRatio: calculateCollateralRatio(
            loanSmartContract?.debt.toString() || '',
            item.loanToken.lastPriceBtc,
            loanSmartContract?.collateral.toString() || '',
            item.collateralToken.lastPriceBtc,
          ),
          liquidationPrice: calculateLiquidationPrice(
            loanSmartContract?.debt.toString() || '1',
            loanSmartContract?.collateral.toString() || '1',
          ),
          apr: item?.borrow?.[0].interestRate || '',
          rolloverDate: item.nextRollover || dayjs().unix(),
          interestOwedPerDay:
            loanSmartContract?.interestOwedPerDay.toNumber() || 0,
        };
      }) || [];

  return { data: result, loading };
};
