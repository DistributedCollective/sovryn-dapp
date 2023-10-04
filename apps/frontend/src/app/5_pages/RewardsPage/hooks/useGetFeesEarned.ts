import { useEffect, useState, useCallback } from 'react';

import { BigNumber } from 'ethers';

import { SupportedTokens, getProtocolContract } from '@sovryn/contracts';
import { getTokenContract } from '@sovryn/contracts';
import { getLoanTokenContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { defaultChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useIsMounted } from '../../../../hooks/useIsMounted';
import { useMulticall } from '../../../../hooks/useMulticall';
import { EarnedFee } from '../RewardsPage.types';

const MAX_CHECKPOINTS = 50;
const FEE_TOKEN_ASSETS = [
  SupportedTokens.rbtc,
  SupportedTokens.wrbtc,
  SupportedTokens.sov,
  SupportedTokens.zusd,
  SupportedTokens.mynt,
];

const FEE_LOAN_ASSETS = [SupportedTokens.rbtc];

let btcDummyAddress: string;

const getRbtcDummyAddress = async () => {
  if (!btcDummyAddress) {
    const { contract } = await getProtocolContract(
      'feeSharing',
      defaultChainId,
    );
    btcDummyAddress = await contract(
      getProvider(defaultChainId),
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
      ...FEE_TOKEN_ASSETS.map(async asset => ({
        token: asset,
        contractAddress:
          asset === SupportedTokens.rbtc
            ? await getRbtcDummyAddress()
            : (
                await getTokenContract(asset, defaultChainId)
              ).address,
        value: '0',
        rbtcValue: 0,
        ...(asset !== SupportedTokens.rbtc
          ? { startFrom: 0, maxCheckpoints: 0 }
          : {}),
        iToken: false,
      })),
      ...FEE_LOAN_ASSETS.map(async asset => ({
        token: asset,
        contractAddress: (
          await getLoanTokenContract(asset, defaultChainId)
        ).address,
        value: '0',
        rbtcValue: 0,
        startFrom: 0,
        maxCheckpoints: 0,
        iToken: true,
      })),
    ]);

    setEarnedFees(defaultTokenData);

    if (!account) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { contract } = await getProtocolContract(
      'feeSharing',
      defaultChainId,
    );

    const feeSharingContract = contract(getProvider(defaultChainId));

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
