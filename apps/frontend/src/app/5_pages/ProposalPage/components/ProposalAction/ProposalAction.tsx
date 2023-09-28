import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonStyle } from '@sovryn/ui';

import { defaultChainId } from '../../../../../config/chains';

import { useAccount } from '../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useLoadContract } from '../../../../../hooks/useLoadContract';
import { translations } from '../../../../../locales/i18n';
import {
  ProposalProps,
  ProposalState,
} from '../../../BitocracyPage/BitocracyPage.types';
import { useProposalStatus } from '../../../BitocracyPage/hooks/useProposalStatus';
import { ProposalActionType } from './ProposalAction.types';
import { useHandleProposal } from './hooks/useHandleProposal';

type ProposalActionProps = ProposalProps & {
  contractName: string | undefined;
  className?: string;
};

const pageTranslations = translations.proposalPage;

export const ProposalAction: FC<ProposalActionProps> = ({
  proposal,
  contractName,
  className,
}) => {
  const { account } = useAccount();
  const contract = useLoadContract(
    `governor${contractName}`,
    'protocol',
    defaultChainId,
  );

  const { balance, loading } = useAssetBalance(SupportedTokens.rbtc);
  const status = useProposalStatus(proposal);

  const isDisabled = useMemo(
    () => !account || balance.isZero() || !contract || loading,
    [account, balance, loading, contract],
  );

  const isActionVisible = useMemo(
    () =>
      contract &&
      (status === ProposalState.Succeeded || status === ProposalState.Queued),
    [status, contract],
  );

  const action = useMemo(() => {
    switch (status) {
      case ProposalState.Succeeded:
        return ProposalActionType.queue;
      case ProposalState.Queued:
        return ProposalActionType.execute;
      default:
        return ProposalActionType.queue;
    }
  }, [status]);

  const actionButtonText = useMemo(
    () =>
      action === ProposalActionType.queue
        ? t(pageTranslations.actions.queue)
        : t(pageTranslations.actions.execute),
    [action],
  );

  const handleProposal = useHandleProposal();

  const handleSubmit = useCallback(() => {
    if (proposal && contract) {
      handleProposal(proposal.proposalId, contract, action);
    }
  }, [handleProposal, proposal, contract, action]);

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
