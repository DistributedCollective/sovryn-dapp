import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { useGetProtocolContract } from '../../../../../hooks/useGetContract';
import { translations } from '../../../../../locales/i18n';
import { areAddressesEqual } from '../../../../../utils/helpers';
import { ProposalProps } from '../../BitocracyPage.types';
import { useIsExecutableProposal } from '../../hooks/useIsExecutableProposal';

const baseTranslations = translations.bitocracyPage.proposalType;

export const ProposalType: FC<ProposalProps> = ({ proposal }) => {
  const adminAddress = useGetProtocolContract('governorAdmin')?.address ?? '';
  const ownerAddress = useGetProtocolContract('governorOwner')?.address ?? '';
  const isExecutableProposal = useIsExecutableProposal(proposal);

  const type = useMemo(() => {
    let result = '';

    if (areAddressesEqual(proposal.emittedBy.id, adminAddress)) {
      result += t(baseTranslations.admin) + ' ';
    } else if (areAddressesEqual(proposal.emittedBy.id, ownerAddress)) {
      result += t(baseTranslations.owner) + ' ';
    } else {
      result += t(baseTranslations.other) + ' ';
    }

    if (isExecutableProposal) {
      result += t(baseTranslations.executable);
    } else {
      result += t(baseTranslations.nonExecutable);
    }

    return result;
  }, [proposal.emittedBy.id, adminAddress, ownerAddress, isExecutableProposal]);

  return <>{type}</>;
};
