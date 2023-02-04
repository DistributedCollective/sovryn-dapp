import { useCallback } from 'react';

import { ethers } from 'ethers';

import { getContract } from '@sovryn/contracts';

import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { getRskChainId } from '../../../../utils/chain';

export const useClaimCollateralSurplus = (onComplete: () => void) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  return useCallback(async () => {
    try {
      const { address, abi: massetManagerAbi } = await getContract(
        'borrowerOperations',
        'zero',
        getRskChainId(),
      );
      const borrowerOperations = new ethers.Contract(
        address,
        massetManagerAbi,
        signer,
      );

      setTransactions([
        {
          title: 'Claim BTC',
          contract: borrowerOperations,
          fnName: 'claimCollateral',
          args: [],
          onComplete,
        },
      ]);
      setTitle('Claim collateral surplus');
      setIsOpen(true);
    } catch (error) {
      console.log('error:', error);
    }
  }, [onComplete, setIsOpen, setTitle, setTransactions, signer]);
};
