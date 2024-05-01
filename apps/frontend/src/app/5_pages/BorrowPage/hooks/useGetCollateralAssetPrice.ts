import { useCallback, useEffect, useState } from 'react';

import { getAssetData } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetTokenPrice } from './useGetTokenPrice';

export const useGetCollateralAssetPrice = (
  borrowToken: string,
  collateralToken: string,
) => {
  const { signer } = useAccount();
  const [borrowPriceUsd, setBorrowPriceUsd] = useState('0');
  const [collateralPriceUsd, setCollateralPriceUsd] = useState('0');

  const [borrowAddress, setBorrowAddress] = useState('');
  const [collateralAddress, setCollateralAddress] = useState('');

  const getBorrowTokenContract = useCallback(async () => {
    const { contract } = await getAssetData(borrowToken, RSK_CHAIN_ID);
    return contract(signer);
  }, [borrowToken, signer]);

  const getCollateralTokenContract = useCallback(async () => {
    const { contract } = await getAssetData(collateralToken, RSK_CHAIN_ID);
    return contract(signer);
  }, [collateralToken, signer]);

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
