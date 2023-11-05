import { useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { SupportedTokens, getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { defaultChainId } from '../../../../config/chains';

import { fromWei, toWei } from '../../../../utils/math';

export const useGetMyntConversionAmount = (
  amount: string,
  sourceToken: SupportedTokens,
) => {
  const [convertedMyntAmount, setConvertedMyntAmount] = useState('0');

  useEffect(() => {
    const fetchConversionAmount = async () => {
      try {
        const { address, abi } = await getProtocolContract(
          'fixedRateMynt',
          defaultChainId,
        );
        const contract = new Contract(
          address,
          abi,
          getProvider(defaultChainId),
        );
        const result = await contract.convertAmount(toWei(amount));
        setConvertedMyntAmount(fromWei(result));
      } catch (error) {
        console.error('Error fetching Mynt conversion amount:', error);
      }
    };
    if (sourceToken === SupportedTokens.mynt && amount) {
      fetchConversionAmount();
    }
  }, [amount, sourceToken]);

  return { convertedMyntAmount };
};
