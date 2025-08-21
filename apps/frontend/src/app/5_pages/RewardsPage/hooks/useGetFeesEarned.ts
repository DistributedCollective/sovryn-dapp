import { useEffect, useState, useCallback } from 'react';

import { BigNumber } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { getLoanTokenContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useIsMounted } from '../../../../hooks/useIsMounted';
import { useMulticall } from '../../../../hooks/useMulticall';
import { COMMON_SYMBOLS, findAsset } from '../../../../utils/asset';
import { EarnedFee } from '../RewardsPage.types';

const MAX_CHECKPOINTS = 50;
const FEE_TOKEN_ASSETS = [
  COMMON_SYMBOLS.WBTC,
  COMMON_SYMBOLS.BTC,
  COMMON_SYMBOLS.SOV,
  COMMON_SYMBOLS.ZUSD,
  'MYNT',
];

const FEE_LOAN_ASSETS = [COMMON_SYMBOLS.BTC];

let btcDummyAddress: string;

const getRbtcDummyAddress = async () => {
  if (!btcDummyAddress) {
    const { contract } = await getProtocolContract('feeSharing', RSK_CHAIN_ID);
    btcDummyAddress = await contract(
      getProvider(RSK_CHAIN_ID),
    ).RBTC_DUMMY_ADDRESS_FOR_CHECKPOINT();
  }
  return btcDummyAddress;
};

export const useGetFeesEarned = () => {
  const isMounted = useIsMounted();
  const { account } = useAccount();
  const multicall = useMulticall();

  const [loading, setLoading] = useState(true);
  const [earnedFees, setEarnedFees] = useState<EarnedFee[]>([]);

  const getAvailableFees = useCallback(async () => {
    if (!isMounted()) {
      return;
    }
    if (!account || !multicall) {
      setEarnedFees([]);
      setLoading(false);
      return;
    }
    // set defaults
    const defaultTokenData = await Promise.all([
      ...FEE_LOAN_ASSETS.map(async asset => ({
        token: asset,
        contractAddress: (
          await getLoanTokenContract(asset, RSK_CHAIN_ID)
        ).address,
        value: '0',
        rbtcValue: 0,
        startFrom: 0,
        maxCheckpoints: 0,
        iToken: true,
      })),
      ...FEE_TOKEN_ASSETS.map(async asset => ({
        token: asset,
        contractAddress:
          asset.toUpperCase() === COMMON_SYMBOLS.BTC
            ? await getRbtcDummyAddress()
            : findAsset(asset, RSK_CHAIN_ID).address,
        value: '0',
        rbtcValue: 0,
        ...(asset.toUpperCase() !== COMMON_SYMBOLS.BTC
          ? { startFrom: 0, maxCheckpoints: 0 }
          : {}),
        iToken: false,
      })),
    ]);

    setEarnedFees(defaultTokenData);

    if (!account) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { contract } = await getProtocolContract('feeSharing', RSK_CHAIN_ID);

    const feeSharingContract = contract(getProvider(RSK_CHAIN_ID));

    const checkpoints = await multicall(
      defaultTokenData.flatMap(({ contractAddress }) => [
        {
          contract: feeSharingContract,
          fnName: 'totalTokenCheckpoints',
          args: [contractAddress],
          key: `${contractAddress}/totalTokenCheckpoints`,
          parser: (value: string) => Number(value),
        },
        {
          contract: feeSharingContract,
          fnName: 'processedCheckpoints',
          args: [account, contractAddress],
          key: `${contractAddress}/processedCheckpoints`,
          parser: (value: string) => Number(value),
        },
      ]),
    );

    const amounts = await multicall(
      defaultTokenData.map(({ contractAddress }) => ({
        contract: feeSharingContract,
        fnName: 'getAllUserFeesPerMaxCheckpoints',
        args: [
          account,
          contractAddress,
          Math.max(checkpoints[`${contractAddress}/processedCheckpoints`], 0),
          MAX_CHECKPOINTS,
        ],
        key: contractAddress,
        parser: ({ fees }: { fees: string[] }) =>
          fees.reduce((prev, cur) => prev.add(cur), BigNumber.from(0)),
      })),
    );

    const results = defaultTokenData.map((tokenData, index) => ({
      token: tokenData.token,
      contractAddress: tokenData.contractAddress,
      value: amounts[tokenData.contractAddress].toString(),
      rbtcValue: 0,
      startFrom:
        checkpoints[`${tokenData.contractAddress}/processedCheckpoints`],
      maxCheckpoints:
        checkpoints[`${tokenData.contractAddress}/totalTokenCheckpoints`],
    }));

    if (isMounted()) {
      setEarnedFees(results);
      setLoading(false);
    }
  }, [account, isMounted, multicall]);

  useEffect(() => {
    getAvailableFees().catch(console.error);
  }, [getAvailableFees]);

  return {
    loading,
    earnedFees,
    refetch: getAvailableFees,
  };
};
