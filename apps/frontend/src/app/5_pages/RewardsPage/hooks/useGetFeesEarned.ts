import { useEffect, useState, useMemo, useCallback } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import {
  useGetProtocolContract,
  useGetTokenContract,
} from '../../../../hooks/useGetContract';
import { useMulticall } from '../../../../hooks/useMulticall';
import { EarnedFee } from '../RewardsPage.types';
import { useGetTokenCheckpoints } from './useGetTokenCheckpoints';

const DEFAULT_RBTC_DUMMY_ADDRESS = '0xeabd29be3c3187500df86a2613c6470e12f2d77d';

export const useGetFeesEarned = () => {
  const { account } = useAccount();
  const [loading, setLoading] = useState(true);
  const [RBTCDummyAddress, setRBTCDummyAddress] = useState(
    DEFAULT_RBTC_DUMMY_ADDRESS,
  );

  const feeSharing = useGetProtocolContract('feeSharing');
  const sovContract = useGetTokenContract('sov');
  const myntContract = useGetTokenContract('mynt');
  const zusdContract = useGetTokenContract('zusd');

  const contractAddresses = useMemo(
    () => ({
      [SupportedTokens.rbtc]: RBTCDummyAddress,
      [SupportedTokens.sov]: sovContract?.address!,
      [SupportedTokens.zusd]: zusdContract?.address!,
      [SupportedTokens.mynt]: myntContract?.address!,
    }),
    [
      RBTCDummyAddress,
      myntContract?.address,
      sovContract?.address,
      zusdContract?.address,
    ],
  );

  const isLoadingContracts = useMemo(
    () => !!Object.keys(contractAddresses).find(key => !contractAddresses[key]),
    [contractAddresses],
  );

  const {
    userCheckpoint: sovUserCheckpoint,
    maxWithdrawCheckpoint: sovMaxWithdrawCheckpoint,
  } = useGetTokenCheckpoints(SupportedTokens.sov);
  const {
    userCheckpoint: myntUserCheckpoint,
    maxWithdrawCheckpoint: myntMaxWithdrawCheckpoint,
  } = useGetTokenCheckpoints(SupportedTokens.mynt);
  const {
    userCheckpoint: zusdUserCheckpoint,
    maxWithdrawCheckpoint: zusdMaxWithdrawCheckpoint,
  } = useGetTokenCheckpoints(SupportedTokens.zusd);

  const getStartFrom = useCallback(
    (asset: SupportedTokens) => {
      switch (asset) {
        case SupportedTokens.sov:
          return Number(sovUserCheckpoint?.checkpointNum) || 0;
        case SupportedTokens.mynt:
          return Number(myntUserCheckpoint?.checkpointNum) || 0;
        case SupportedTokens.zusd:
          return Number(zusdUserCheckpoint?.checkpointNum) || 0;
        default:
          return 0;
      }
    },
    [sovUserCheckpoint, myntUserCheckpoint, zusdUserCheckpoint],
  );

  const getMaxCheckpoints = useCallback(
    (asset: SupportedTokens) => {
      switch (asset) {
        case SupportedTokens.sov:
          return sovMaxWithdrawCheckpoint;
        case SupportedTokens.mynt:
          return myntMaxWithdrawCheckpoint;
        case SupportedTokens.zusd:
          return zusdMaxWithdrawCheckpoint;
        default:
          return 0;
      }
    },
    [
      sovMaxWithdrawCheckpoint,
      myntMaxWithdrawCheckpoint,
      zusdMaxWithdrawCheckpoint,
    ],
  );

  const generateDefaultEarnedFees = useCallback(() => {
    return Object.entries(contractAddresses).map(
      ([token, contractAddress]): EarnedFee => ({
        token: token as SupportedTokens,
        contractAddress,
        value: '0',
        rbtcValue: 0,
        ...(token !== SupportedTokens.rbtc
          ? { startFrom: 0, maxCheckpoints: 0 }
          : {}),
      }),
    );
  }, [contractAddresses]);

  const [earnedFees, setEarnedFees] = useState(generateDefaultEarnedFees());

  const multicall = useMulticall();

  const getAvailableFees = useCallback(async () => {
    if (
      !sovMaxWithdrawCheckpoint ||
      !zusdMaxWithdrawCheckpoint ||
      !myntMaxWithdrawCheckpoint ||
      isLoadingContracts ||
      !account ||
      !feeSharing
    ) {
      return;
    }

    const earnedFees = generateDefaultEarnedFees();

    const callData = earnedFees.map(fee => {
      const isRBTC = fee.token === SupportedTokens.rbtc;
      const fnName = isRBTC
        ? 'getAccumulatedRBTCFeeBalances'
        : 'getAccumulatedFeesForCheckpointsRange';
      const startFrom = Math.max(getStartFrom(fee.token) - 1, 0);
      const args = isRBTC
        ? [account]
        : [
            account,
            fee.contractAddress,
            startFrom,
            getMaxCheckpoints(fee.token),
          ];
      return {
        contract: feeSharing,
        fnName,
        args,
        key: fee.token,
        parser: value => value[0].toString(),
      };
    });

    const result = await multicall(callData);

    setLoading(true);

    const fees = earnedFees.map((fee, i) => ({
      ...fee,
      value: result[i],
    }));

    setEarnedFees([...fees]);
    setLoading(false);
  }, [
    account,
    feeSharing,
    generateDefaultEarnedFees,
    getMaxCheckpoints,
    getStartFrom,
    isLoadingContracts,
    multicall,
    myntMaxWithdrawCheckpoint,
    sovMaxWithdrawCheckpoint,
    zusdMaxWithdrawCheckpoint,
  ]);

  useEffect(() => {
    const getRbtcDummyAddress = async () => {
      try {
        const result = await feeSharing?.RBTC_DUMMY_ADDRESS_FOR_CHECKPOINT();

        setRBTCDummyAddress(result);
      } catch (error) {
        console.error('Error getting RBTC dummy address:', error);
      }
    };

    getRbtcDummyAddress();
  }, [feeSharing]);

  useEffect(() => {
    if (account && !isLoadingContracts) {
      getAvailableFees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    sovMaxWithdrawCheckpoint,
    zusdMaxWithdrawCheckpoint,
    myntMaxWithdrawCheckpoint,
    isLoadingContracts,
  ]);

  return {
    loading,
    earnedFees,
    refetch: getAvailableFees,
  };
};
