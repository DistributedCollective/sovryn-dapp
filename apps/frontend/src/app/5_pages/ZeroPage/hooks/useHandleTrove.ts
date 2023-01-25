import { Decimalish, TroveAdjustmentParams } from '@sovryn-zero/lib-base';

import { useCallback } from 'react';

import { Contract } from 'ethers';
import { useTranslation } from 'react-i18next';

import { getContract } from '@sovryn/contracts';

import { CreditLineSubmitValue } from '../../../3_organisms/ZeroLocForm/types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import {
  GAS_LIMIT_ADJUST_TROVE,
  GAS_LIMIT_OPEN_TROVE,
} from '../../../../utils/constants';
import { adjustTrove, openTrove } from '../utils/trove-manager';

export const useHandleTrove = (hasLoc: boolean, onComplete: () => void) => {
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen } = useTransactionContext();
  const { t } = useTranslation();

  const handleTroveSubmit = useCallback(
    async (value: CreditLineSubmitValue) => {
      if (signer) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          getRskChainId(),
        );

        const contract = new Contract(address, abi, signer);

        if (hasLoc) {
          const params: Partial<TroveAdjustmentParams<Decimalish>> = {};

          if (value.borrow) {
            params.borrowZUSD = value.borrow;
          }

          if (value.repay) {
            params.repayZUSD = value.repay;
          }

          if (value.depositCollateral) {
            params.depositCollateral = value.depositCollateral;
          }

          if (value.withdrawCollateral) {
            params.withdrawCollateral = value.withdrawCollateral;
          }

          const adjustedTrove = await adjustTrove(account, params);
          setTransactions([
            {
              title: t(translations.zeroPage.tx.adjustTrove),
              contract,
              fnName: 'adjustTrove',
              config: {
                value: adjustedTrove.value,
                gasLimit: GAS_LIMIT_ADJUST_TROVE,
              },
              args: adjustedTrove.args,
              onComplete,
            },
          ]);
          setIsOpen(true);
        } else {
          const openedTrove = await openTrove({
            borrowZUSD: value.borrow || '0',
            depositCollateral: value.depositCollateral || '0',
          });
          setTransactions([
            {
              title: t(translations.zeroPage.tx.openTrove),
              contract,
              fnName: 'openTrove',
              config: {
                value: openedTrove.value,
                gasLimit: GAS_LIMIT_OPEN_TROVE,
              },
              args: openedTrove.args,
              onComplete,
            },
          ]);
          setIsOpen(true);
        }
      }
    },
    [account, hasLoc, onComplete, setIsOpen, setTransactions, signer, t],
  );

  const handleTroveClose = useCallback(async () => {
    if (signer) {
      const { address, abi } = await getContract(
        'borrowerOperations',
        'zero',
        getRskChainId(),
      );

      const contract = new Contract(address, abi, signer);

      setTransactions([
        {
          title: t(translations.zeroPage.tx.closeTrove),
          contract,
          fnName: 'closeTrove',
          args: [],
          onComplete,
        },
      ]);
      setIsOpen(true);
    }
  }, [onComplete, setIsOpen, setTransactions, signer, t]);

  return { handleTroveSubmit, handleTroveClose };
};
