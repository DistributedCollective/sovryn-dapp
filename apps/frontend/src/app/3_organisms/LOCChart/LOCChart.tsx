import React, { useEffect, FC, useState, useMemo, useCallback } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartData,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useGetRBTCPrice } from '../../../hooks/zero/useGetRBTCPrice';
import { useGetTroves } from '../../../hooks/zero/useGetTroves';
import { TroveStatus } from '../../../utils/graphql/zero/generated';
import {
  areAddressesEqual,
  calculateCollateralRatio,
} from '../../../utils/helpers';
import { decimalic, fromWei } from '../../../utils/math';
import { useGetChartOptions } from './hooks/useGetChartOptions';
import { useGetGlobalsEntity } from './hooks/useGetGlobalsEntity';
import { useGetUserOpenTrove } from './hooks/useGetUserOpenTrove';
import { ChartSortingType, TroveData } from './types';
import { calculateRedemptionBuffer, chartConfig } from './utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

/**
 * Description: This component is responsible for displaying the chart
 * * Config: Styles for chart are in chartConfig variable
 * * Data: Troves data with open status comes from the useGetTroves hook
 * * Data: User Open Trove data comes from the useGetUserOpenTrove hook
 * * Data: RBTC Price data comes from the useGetRBTCPrice hook
 * * Troves sorting: Troves are sorted by collateral ratio in ascending order
 *
 * Process of getting data:
 * 1. Getting User Open Trove data
 * 2. Setting activeBar for chart (for highlighting User Open Trove)
 * 3. Getting 20 first troves with open status if user not logged in,
 *    otherwise getting 10 above and 10 below users LOC
 * 4. Calculating collateral ratio for each trove
 * 5. Sorting all troves by collateralRatio in ascending order
 * 6. Setting data for chart
 *
 * @returns Chart component with data
 */

export const LOCChart: FC = () => {
  const { account } = useAccount();
  const { isMobile } = useIsMobile();
  const [data, setData] = useState<TroveData[]>([]);
  const [dataToShow, setDataToShow] = useState<TroveData[]>([]);
  const { price } = useGetRBTCPrice();
  const [activeBar, setActiveBar] = useState(false);
  const [userCollateralRatio, setUserCollateralRatio] = useState(0);
  const [redemptionBuffer, setRedemptionBuffer] = useState(0);
  const [startAxisXCount, setStartAxisXCount] = useState(0);
  const { value: block } = useBlockNumber();

  const trovesCountToShow = useMemo(
    () => (isMobile ? chartConfig.minValue : chartConfig.maxValue),
    [isMobile],
  );

  const {
    data: userOpenTrove,
    loading: loadingUserOpenTrove,
    refetch: refetchUserTrove,
  } = useGetUserOpenTrove(account);

  const { data: globalsEntity } = useGetGlobalsEntity();

  const hasUserOpenTrove = useMemo(
    () => userOpenTrove?.trove?.status === TroveStatus.Open,
    [userOpenTrove],
  );

  const options = useGetChartOptions(
    activeBar,
    redemptionBuffer,
    startAxisXCount,
  );

  const isUserTrove = useCallback(
    (trove: TroveData) => areAddressesEqual(trove.id, account),
    [account],
  );

  const datasets: ChartData<'bar', TroveData[]> = useMemo(() => {
    return {
      datasets: [
        {
          data: dataToShow,
          parsing: {
            xAxisKey: ChartSortingType.id,
            yAxisKey: ChartSortingType.collateralRatio,
          },
          backgroundColor: bar => {
            if (bar.raw) {
              const { id } = bar.raw as TroveData;
              return areAddressesEqual(id, account)
                ? chartConfig.activeColor
                : chartConfig.defaultColor;
            } else {
              return chartConfig.defaultColor;
            }
          },
        },
      ],
    };
  }, [dataToShow, account]);

  const {
    data: troves,
    loading: loadingTroves,
    refetch: refetchTroves,
  } = useGetTroves();

  useEffect(() => {
    refetchTroves();
    refetchUserTrove();
  }, [refetchTroves, refetchUserTrove, block]);

  useEffect(() => {
    if (troves && !loadingTroves && globalsEntity) {
      // load and parse data and then show it immediately if wallet not connected
      // logic for connected wallets is in another useEffect
      const updatedTroves = troves.troves?.map(trove => {
        const totalDebt = globalsEntity?.globals[0].rawTotalRedistributedDebt;
        const snapshotOfTotalDebt = trove.rawSnapshotOfTotalRedistributedDebt;
        const totalCollateral =
          globalsEntity?.globals[0].rawTotalRedistributedCollateral;
        const snapshotOfTotalCollateral =
          trove.rawSnapshotOfTotalRedistributedCollateral;
        const stake = trove.rawStake;

        const debtAmount =
          (Number(fromWei(totalDebt)) - Number(fromWei(snapshotOfTotalDebt))) *
            Number(fromWei(stake)) +
          Number(trove.debt);

        const collateralAmount =
          (Number(fromWei(totalCollateral)) -
            Number(fromWei(snapshotOfTotalCollateral))) *
            Number(fromWei(stake)) +
          Number(trove.collateral);

        return {
          id: trove.id,
          collateral: collateralAmount,
          debt: debtAmount,
          collateralRatioSortKey_legacy:
            trove.collateralRatioSortKey_legacy ?? '',
          collateralRatio: calculateCollateralRatio(
            decimalic(collateralAmount.toString()),
            decimalic(debtAmount.toString()),
            decimalic(price),
          ),
        };
      });

      setData(updatedTroves);

      if (!hasUserOpenTrove) {
        setDataToShow(updatedTroves.slice(0, trovesCountToShow - 1));
      }
    }
  }, [
    troves,
    loadingTroves,
    globalsEntity,
    price,
    account,
    loadingUserOpenTrove,
    trovesCountToShow,
    hasUserOpenTrove,
  ]);

  useEffect(() => {
    if (!loadingUserOpenTrove && hasUserOpenTrove && data && troves) {
      // parses data and shows bars around users trove
      // initial data parsing and displaying data for unconnected state in another useEffect
      const index = data.findIndex(isUserTrove);
      if (index === -1) {
        return;
      }

      const centerIndex = (trovesCountToShow - 1) / 2;
      const shiftTroves = index >= centerIndex ? index - centerIndex : index;

      if (userCollateralRatio > 0) {
        const redemptionBuffer = data
          .slice(0, index)
          ?.reduce(
            (acc, curr) =>
              acc +
              calculateRedemptionBuffer(
                Number(curr.debt),
                Number(curr.collateral),
                Number(userCollateralRatio),
                price,
              ),
            0,
          );
        setRedemptionBuffer(redemptionBuffer || 0);
      }

      if (index < centerIndex) {
        // if the user trove is in the first N elements, show all N
        setDataToShow(data.slice(0, trovesCountToShow));
        setStartAxisXCount(0);
      } else {
        // setting the start point for the chart axis X to first bar
        setStartAxisXCount(shiftTroves);

        // slice the full trove array to get N bars, where N = trovesCountToShow
        // (N-1)/2 to the left and (N-1)/2 to the right of the bar of user's trove
        const slicedData = data.slice(
          shiftTroves,
          shiftTroves + trovesCountToShow,
        );
        setDataToShow(slicedData);
      }

      setUserCollateralRatio(decimalic(data[index].collateralRatio).toNumber());
      setActiveBar(true);
    }
  }, [
    hasUserOpenTrove,
    loadingUserOpenTrove,
    data,
    troves,
    account,
    userCollateralRatio,
    activeBar,
    trovesCountToShow,
    isUserTrove,
    price,
  ]);

  useEffect(() => {
    //reset values when the user is not in the troves list or not connected
    if (!hasUserOpenTrove || !account) {
      setRedemptionBuffer(0);
      setStartAxisXCount(0);
      setActiveBar(false);
    }
  }, [hasUserOpenTrove, account]);

  return <Bar className="max-w-full" options={options} data={datasets} />;
};
