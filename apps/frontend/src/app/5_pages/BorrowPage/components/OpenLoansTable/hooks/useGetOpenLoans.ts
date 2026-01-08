import { keepPreviousData, useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import { getAssetDataByAddress } from '@sovryn/contracts';
import { noop } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { queryRate } from '../../../../../../utils/calls';
import { decimalic } from '../../../../../../utils/math';
import {
  calculateApr,
  calculateLiquidationPrice,
  convertLoanTokenToSupportedAssets,
  isSupportedPool,
} from '../OpenLoans.utils';
import { LoanItem } from '../OpenLoansTable.types';

const start = 0;
const count = 1000;
const loanType = 2;
const isLender = false;
const unsafeOnly = false;

export const useGetOpenLoans = () => {
  const { account } = useAccount();
  const blockNumber = useBlockNumber();
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);

  const {
    data: loanItemsSmartContract,
    isPending,
    error,
  } = useQuery({
    queryKey: ['userLoans', { account, blockNumber }],
    queryFn: async () => {
      if (!account || !contract) {
        return [];
      }
      const loans = await contract.getUserLoans(
        account,
        start,
        count,
        loanType,
        isLender,
        unsafeOnly,
      );

      if (!loans) {
        return [];
      }

      const rates = await mapRates(loans);

      const result = loans
        .map(item => {
          const rate = rates.find(
            rate =>
              rate.loanTokenAddress.toLowerCase() ===
                item.loanToken.toLowerCase() &&
              rate.collateralTokenAddress.toLowerCase() ===
                item.collateralToken.toLowerCase(),
          );

          if (!rate) {
            return null;
          }

          const debt = Decimal.fromBigNumberString(item.principal);
          const collateral = Decimal.fromBigNumberString(item.collateral);

          return {
            id: item.loanId,
            debt,
            debtAsset: convertLoanTokenToSupportedAssets(rate.loanToken),
            collateral,
            collateralAsset: convertLoanTokenToSupportedAssets(
              rate.collateralToken,
            ),
            collateralRatio: decimalic(collateral.mul(rate.rate))
              .div(debt)
              .mul(100)
              .toNumber(),
            liquidationPrice: calculateLiquidationPrice(
              item?.principal.toString() || '1',
              item?.collateral.toString() || '1',
            ),
            apr: calculateApr(
              Decimal.fromBigNumberString(item.interestOwedPerDay),
              debt,
            ),
            rolloverDate: Number(item.endTimestamp) || dayjs().unix(),
            interestOwedPerDay: Decimal.fromBigNumberString(
              item.interestOwedPerDay,
            ),
            startMargin: Decimal.fromBigNumberString(item.startMargin),
            currentMargin: Decimal.fromBigNumberString(item.currentMargin),
            maintenanceMargin: Decimal.fromBigNumberString(
              item.maintenanceMargin,
            ),
          };
        })
        .filter(Boolean)
        .filter(item => isSupportedPool(item.debtAsset, item.collateralAsset));

      return result as LoanItem[];
    },
    enabled: !!account && !!contract,
    placeholderData: keepPreviousData,
    throwOnError: true,
  });

  return {
    data: loanItemsSmartContract ?? [],
    loading: isPending,
    error,
  };
};

const mapRates = async (
  loans: { collateralToken: string; loanToken: string }[],
) => {
  // filter out duplicate collateralToken + loanToken pairs
  const uniquePairs = loans.reduce(
    (acc, item) =>
      acc.find(
        i =>
          i.collateralToken.toLowerCase() ===
            item.collateralToken.toLowerCase() &&
          i.loanToken.toLowerCase() === item.loanToken.toLowerCase(),
      )
        ? acc
        : [...acc, item],
    [] as { collateralToken: string; loanToken: string }[],
  );

  const tokens = await Promise.all(
    uniquePairs.map(async item => ({
      collateralTokenAddress: item.collateralToken,
      loanTokenAddress: item.loanToken,
      collateralToken: (
        await getAssetDataByAddress(item.collateralToken, RSK_CHAIN_ID).catch(
          noop,
        )
      )?.symbol,
      loanToken: (
        await getAssetDataByAddress(item.loanToken, RSK_CHAIN_ID).catch(noop)
      )?.symbol,
    })),
  ).then(
    items =>
      items.filter(item => item.collateralToken && item.loanToken) as {
        collateralToken: string;
        loanToken: string;
        collateralTokenAddress: string;
        loanTokenAddress: string;
      }[],
  );

  const rates = await Promise.all(
    tokens.map(item =>
      queryRate(item.collateralToken, item.loanToken).then(result => ({
        collateralToken: item.collateralToken,
        loanToken: item.loanToken,
        collateralTokenAddress: item.collateralTokenAddress,
        loanTokenAddress: item.loanTokenAddress,
        rate: result.rate,
        precision: result.precision,
      })),
    ),
  );

  return rates;
};
