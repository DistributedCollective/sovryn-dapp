import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import {
  useGetProtocolContract,
  useGetTokenContract,
} from '../../../../../hooks/useGetContract';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { areAddressesEqual } from '../../../../../utils/helpers';
import { SIGNATURE_SYMBOL } from '../Proposals/Proposals.constants';

type ProposalTypeProps = {
  proposal: Proposal;
};

export const ProposalType: FC<ProposalTypeProps> = ({ proposal }) => {
  const sovContract = useGetTokenContract(SupportedTokens.sov);
  const adminAddress = useGetProtocolContract('governorAdmin')?.address ?? '';
  const ownerAddress = useGetProtocolContract('governorOwner')?.address ?? '';

  const type = useMemo(() => {
    let result = '';

    if (areAddressesEqual(proposal.emittedBy.id, adminAddress)) {
      result += t(translations.bitocracyPage.proposalType.admin) + ' ';
    } else if (areAddressesEqual(proposal.emittedBy.id, ownerAddress)) {
      result += t(translations.bitocracyPage.proposalType.owner) + ' ';
    } else {
      result += t(translations.bitocracyPage.proposalType.other) + ' ';
    }

    if (
      proposal.targets.length === 1 &&
      proposal.targets[0] === sovContract?.address
    ) {
      if (proposal.signatures[0] === SIGNATURE_SYMBOL) {
        result += t(translations.bitocracyPage.proposalType.nonExecutable);
      } else {
        result += t(translations.bitocracyPage.proposalType.executable);
      }
    } else if (proposal.targets.length > 1) {
      result += t(translations.bitocracyPage.proposalType.executable);
    } else {
      result += t(translations.bitocracyPage.proposalType.nonExecutable);
    }

    return result;
  }, [proposal, adminAddress, ownerAddress, sovContract]);

  return <>{type}</>;
};
