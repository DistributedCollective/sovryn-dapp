import { useCallback, useEffect, useState } from 'react';

import { getProvider } from '@sovryn/ethers-provider';

import { useGetTokenContract } from '../../../../../../../../hooks/useGetContract';
import { COMMON_SYMBOLS } from '../../../../../../../../utils/asset';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetTokenDetails = (asset: string, address: string) => {
  const contract = useGetTokenContract(asset);

  const [assetBalance, setAssetBalance] = useState('0');
  const assetAddress = contract?.address;

  const getTreasuryTokenContract = useCallback(async () => {
    if (!contract || !address) {
      return;
    }

    try {
      if (asset === COMMON_SYMBOLS.BTC) {
        const balance = await getProvider().getBalance(address);
        const assetBalance = fromWei(balance);
        setAssetBalance(assetBalance);
      } else {
        const balance = await contract.balanceOf(address);
        const assetBalance = fromWei(balance);
        setAssetBalance(assetBalance);
      }
    } catch (error) {
      console.error('Error while fetching asset balance:', error);
      setAssetBalance('0');
    }
  }, [address, asset, contract]);

  useEffect(() => {
    getTreasuryTokenContract();
  }, [getTreasuryTokenContract]);

  return { assetBalance, assetAddress };
};
