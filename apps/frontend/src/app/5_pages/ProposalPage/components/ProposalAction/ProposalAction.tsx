import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../locales/i18n';
import {
  ProposalProps,
  ProposalState,
} from '../../../BitocracyPage/BitocracyPage.types';
import { useProposalStatus } from '../../../BitocracyPage/hooks/useProposalStatus';
import { ProposalActionType } from './ProposalAction.types';
import { useHandleProposal } from './hooks/useHandleProposal';

type ProposalActionProps = ProposalProps & {
  className?: string;
};

const pageTranslations = translations.proposalPage;

export const ProposalAction: FC<ProposalActionProps> = ({
  proposal,
  className,
}) => {
  const { account } = useAccount();

  const { balance, loading } = useAssetBalance(SupportedTokens.rbtc);
  const status = useProposalStatus(proposal);

  const isDisabled = useMemo(
    () => !account || balance.isZero() || loading,
    [account, balance, loading],
  );

  const action = useMemo(() => {
    if (status === ProposalState.Succeeded) {
      return ProposalActionType.queue;
    }
    if (status === ProposalState.Queued && (proposal?.eta || 0) < Date.now()) {
      return ProposalActionType.execute;
    }
    return ProposalActionType.none;
  }, [proposal?.eta, status]);

  const actionButtonText = useMemo(() => {
    switch (action) {
      case ProposalActionType.queue:
        return t(pageTranslations.actions.queue);
      case ProposalActionType.execute:
        return t(pageTranslations.actions.execute);
      default:
        return '';
    }
  }, [action]);

  const isActionVisible = useMemo(
    () => action !== ProposalActionType.none,
    [action],
  );

  const handleProposal = useHandleProposal();

  const handleSubmit = useCallback(() => {
    if (proposal?.emittedBy?.id) {
      handleProposal(proposal.proposalId, proposal.emittedBy.id, action);
    }
  }, [handleProposal, proposal, action]);

  return isActionVisible ? (
    <Button
      text={actionButtonText}
      style={ButtonStyle.ghost}
      onClick={handleSubmit}
      className={className}
      disabled={isDisabled}
    />
  ) : null;
};
