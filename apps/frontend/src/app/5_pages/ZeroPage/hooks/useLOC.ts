import { useCallback } from 'react';

import { ethers } from 'ethers';

import { getContract } from '@sovryn/contracts';

import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { getRskChainId } from '../../../../utils/chain';

export const useLOC = () => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const closeLOC = useCallback(async () => {
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
          title: 'Close LOC',
          contract: borrowerOperations,
          fnName: 'closeTrove',
          args: [],
        },
      ]);
      setTitle('Close Line of credit');
      setIsOpen(true);
    } catch (error) {
      console.log('error:', error);
    }
  }, [setIsOpen, setTitle, setTransactions, signer]);

  return {
    closeLOC,
  };
};
