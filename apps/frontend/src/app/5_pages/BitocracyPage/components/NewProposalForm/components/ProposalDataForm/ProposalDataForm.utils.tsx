import React from 'react';

import { ProposalCreationDetails } from '../../../../contexts/ProposalContext.types';

export const generateFormGroupLabel = (
  labelText: string,
  value: string,
  maxLength: number | string,
) => (
  <div className="flex items-center justify-between w-full">
    <div>{labelText}</div>
    <div className="text-gray-30">
      {value.length}/{maxLength}
    </div>
  </div>
);

export const formatProposalText = ({
  title,
  link,
  summary,
  text,
}: ProposalCreationDetails) => `${title}\n${link}\n${summary}\n---\n${text}`;
