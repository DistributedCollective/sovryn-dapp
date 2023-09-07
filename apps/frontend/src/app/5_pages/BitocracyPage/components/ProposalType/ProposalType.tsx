import React from 'react';
import { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { useGetTokenContract } from '../../../../../hooks/useGetContract';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { areAddressesEqual, isMainnet } from '../../../../../utils/helpers';
import {
  GovernorContractAdminAddress,
  GovernorContractOwnerAddress,
} from '../../BitocracyPage.constants';
import { SIGNATURE_SYMBOL } from '../PastProposals/PastProposals.constants';

type ProposalTypeProps = {
  proposal: Proposal;
};

export const ProposalType: FC<ProposalTypeProps> = ({ proposal }) => {
  const sovContract = useGetTokenContract(SupportedTokens.sov);

  const adminAddress = isMainnet()
    ? GovernorContractAdminAddress.mainnet
    : GovernorContractAdminAddress.testnet;
  const ownerAddress = isMainnet()
    ? GovernorContractOwnerAddress.mainnet
    : GovernorContractOwnerAddress.testnet;

  let type = '';

  if (areAddressesEqual(proposal.emittedBy.id, adminAddress)) {
    type += t(translations.bitocracyPage.proposalType.admin) + ' ';
  } else if (areAddressesEqual(proposal.emittedBy.id, ownerAddress)) {
    type += t(translations.bitocracyPage.proposalType.owner) + ' ';
  } else {
    type += t(translations.bitocracyPage.proposalType.other) + ' ';
  }

  if (
    proposal.targets.length === 1 &&
    proposal.targets[0] === sovContract?.address
  ) {
    if (proposal.signatures[0] === SIGNATURE_SYMBOL) {
      type += t(translations.bitocracyPage.proposalType.nonExecutable);
    } else {
      type += t(translations.bitocracyPage.proposalType.executable);
    }
  } else if (proposal.targets.length > 1) {
    type += t(translations.bitocracyPage.proposalType.executable);
  } else {
    type += t(translations.bitocracyPage.proposalType.nonExecutable);
  }

  return <>{type}</>;
};
