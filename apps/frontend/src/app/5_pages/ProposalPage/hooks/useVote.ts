import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { noop } from '@sovryn/ui';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { Proposal } from '../../../../utils/graphql/rsk/generated';

const pageTranslations = translations.proposalPage;

export const useVote = (proposal: Proposal, onComplete = noop) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const governorAdmin = useGetProtocolContract('governorAdmin');

  const handleSubmit = useCallback(
    async (support: boolean) => {
      if (!signer && !governorAdmin) {
        return;
      }

      const contract = new Contract(
        proposal.emittedBy.id,
        governorAdmin?.interface!,
        signer,
      );

      setTransactions([
        {
          title: t(pageTranslations.support),
          request: {
            type: TransactionType.signTransaction,
            contract,
            fnName: 'castVote',
            args: [proposal.proposalId, support],
          },
          onComplete: onComplete,
        },
      ]);
      setTitle(t(pageTranslations.support));
      setIsOpen(true);
    },
    [
      governorAdmin,
      onComplete,
      proposal.emittedBy.id,
      proposal.proposalId,
      setIsOpen,
      setTitle,
      setTransactions,
      signer,
    ],
  );

  return { handleSubmit };
};
