import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { useGetActiveLoansQuery } from '../../../../../../utils/graphql/rsk/generated';
import {
  calculateApr,
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
    loanItemsSmartContract.map(item => {
      const subgraphData = data.loans.find(
        loan => loan.id.toLowerCase() === item.id.toLowerCase(),
      );

      return {
        id: item.id,
        debt: item?.debt.toNumber() || 0,
        debtAsset: subgraphData?.loanToken.symbol || '',
        collateral: item?.collateral.toNumber() || 0,
        collateralAsset: subgraphData?.collateralToken.symbol || '',
        collateralRatio: calculateCollateralRatio(
          item?.debt.toString() || '1',
          subgraphData?.loanToken.lastPriceBtc || '1',
          item?.collateral.toString() || '1',
          subgraphData?.collateralToken.lastPriceBtc || '1',
        ),
        liquidationPrice: calculateLiquidationPrice(
          item?.debt.toString() || '1',
          item?.collateral.toString() || '1',
        ),
        apr: calculateApr(item.interestOwedPerDay, item.debt),
        rolloverDate: subgraphData?.nextRollover || dayjs().unix(),
        interestOwedPerDay: item?.interestOwedPerDay.toNumber() || 0,
      };
    }) || [];

  return {
    data: result.filter(item =>
      isSupportedPool(item.debtAsset, item.collateralAsset),
    ),
    loading,
  };
};
