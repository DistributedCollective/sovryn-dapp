import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';

import { defaultRskChainId } from '../../../../config/chains';

import { useGetTokenPrice } from './useGetTokenPrice';

export const useGetCollateralAssetPrice = (
  borrowToken: SupportedTokens,
  collateralToken: SupportedTokens,
) => {
  const [borrowPriceUsd, setBorrowPriceUsd] = useState('0');
  const [collateralPriceUsd, setCollateralPriceUsd] = useState('0');

  const [borrowAddress, setBorrowAddress] = useState('');
  const [collateralAddress, setCollateralAddress] = useState('');

  const getBorrowTokenContract = useCallback(async () => {
    const contract = await getTokenContract(borrowToken, defaultRskChainId);
    return contract;
  }, [borrowToken]);

  const getCollateralTokenContract = useCallback(async () => {
    const contract = await getTokenContract(collateralToken, defaultRskChainId);
    return contract;
  }, [collateralToken]);

  const borrowTokenAddress = useCallback(async () => {
    try {
      const contract = await getBorrowTokenContract();
      const address = contract.address;
      return setBorrowAddress(address);
    } catch (error) {
      console.error('Error fetching token address:', error);
      return null;
    }
  }, [getBorrowTokenContract]);

  const collateralTokenAddress = useCallback(async () => {
    try {
      const contract = await getCollateralTokenContract();
      const address = contract.address;
      return setCollateralAddress(address);
    } catch (error) {
      console.error('Error fetching token address:', error);
      return null;
    }
  }, [getCollateralTokenContract]);

  useEffect(() => {
    const fetchBorrowTokenAddress = async () => {
      await borrowTokenAddress();
    };
    fetchBorrowTokenAddress();
    const fetchCollateralTokenAddress = async () => {
      await collateralTokenAddress();
    };
    fetchCollateralTokenAddress();
  }, [collateralTokenAddress, borrowTokenAddress]);

  const { data: borrowTokenData, loading: borrowTokenLoading } =
    useGetTokenPrice(borrowAddress);

  const { data: collateralTokenData, loading: collateralTokenLoading } =
    useGetTokenPrice(collateralAddress);

  useEffect(() => {
    if (!collateralTokenLoading) {
      setBorrowPriceUsd(borrowTokenData?.token?.lastPriceUsd || '0');
      setCollateralPriceUsd(collateralTokenData?.token?.lastPriceUsd || '0');
    }
  }, [
    borrowTokenData,
    collateralTokenData,
    borrowTokenLoading,
    collateralTokenLoading,
  ]);

  return { borrowPriceUsd, collateralPriceUsd };
};
