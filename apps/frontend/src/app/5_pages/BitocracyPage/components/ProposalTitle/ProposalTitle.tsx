import React, { FC, useMemo } from 'react';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { ProposalProps } from '../../BitocracyPage.types';

const titleCharacterLimit = 50;

export const ProposalTitle: FC<ProposalProps> = ({ proposal }) => {
  const title = useMemo(() => {
    if (proposal?.description.length <= titleCharacterLimit) {
      return proposal?.description;
    }

    return `${proposal?.description.slice(0, titleCharacterLimit)}...`;
  }, [proposal]);

  return (
    <Tooltip
      trigger={TooltipTrigger.click}
      className="sm:text-base cursor-pointer"
      tooltipClassName="break-words"
      content={<>{proposal.description}</>}
      children={
        <div>
          <p className="max-w-[20rem] m-0">{title}</p>
        </div>
      }
    />
  );
};
