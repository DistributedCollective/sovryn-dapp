import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { ProposalActionType } from '../ProposalAction.types';

const pageTranslations = translations.proposalPage;

export const useHandleProposal = () => {
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { account, signer } = useAccount();

  const handleSubmit = useCallback(
    async (
      proposalId: number,
      contract: Contract,
      action: ProposalActionType,
    ) => {
      if (!contract || !account || !signer) {
        return;
      }

      const transactions: Transaction[] = [];

      transactions.push({
        title: t(pageTranslations.actions[action]),
        request: {
          type: TransactionType.signTransaction,
          contract,
          fnName: action,
          args: [proposalId],
          gasLimit:
            action === ProposalActionType.queue
              ? GAS_LIMIT.PROPOSAL_QUEUE
              : GAS_LIMIT.PROPOSAL_EXECUTE,
        },
      });

      setTransactions(transactions);
      setTitle(t(pageTranslations.actions[action]));
      setTransactions(transactions);
      setIsOpen(true);
    },
    [account, setIsOpen, setTransactions, signer, setTitle],
  );

  return handleSubmit;
};
