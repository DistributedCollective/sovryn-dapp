import React, { FC, useMemo } from 'react';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { ProposalProps } from '../../BitocracyPage.types';

const titleCharacterLimit = 50;

export const ProposalTitle: FC<ProposalProps> = ({ proposal }) => {
  const title = useMemo(() => {
    let title = proposal?.description.slice(0, titleCharacterLimit);
    if (proposal && proposal?.description.length > titleCharacterLimit) {
      title += '...';
    }

    return title;
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
