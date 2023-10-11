import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { noop } from '@sovryn/ui';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { Proposal } from '../../../../utils/graphql/rsk/generated';
import { VoteType } from '../ProposalPage.types';

const pageTranslations = translations.proposalPage;

export const useVote = (proposal: Proposal, onComplete = noop) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const governorAdmin = useGetProtocolContract('governorAdmin');

  const submit = useCallback(
    async (voteType: VoteType) => {
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
          title: t(
            voteType === VoteType.Support
              ? pageTranslations.support
              : pageTranslations.reject,
          ),
          request: {
            type: TransactionType.signTransaction,
            contract,
            fnName: 'castVote',
            args: [proposal.proposalId, voteType === VoteType.Support],
            gasLimit: GAS_LIMIT.PROPOSAL_VOTE,
          },
          onComplete: onComplete,
        },
      ]);
      setTitle(
        t(
          voteType === VoteType.Support
            ? pageTranslations.support
            : pageTranslations.reject,
        ),
      );
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

  return { submit };
};
