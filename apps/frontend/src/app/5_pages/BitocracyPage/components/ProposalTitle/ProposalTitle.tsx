import React, { FC } from 'react';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { ProposalProps } from '../../BitocracyPage.types';

export const ProposalTitle: FC<ProposalProps> = ({ proposal }) => (
  <Tooltip
    trigger={TooltipTrigger.click}
    className="sm:text-base cursor-pointer"
    tooltipClassName="break-words"
    content={<>{proposal.description}</>}
    children={
      <div>
        <p className="truncate max-w-[20rem] m-0">{proposal.description}</p>
      </div>
    }
  />
);
