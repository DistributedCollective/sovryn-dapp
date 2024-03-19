import React, { FC, useMemo } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { parseProposalInfo } from '../../../ProposalPage/ProposalPage.utils';
import { ProposalProps } from '../../BitocracyPage.types';

const titleCharacterLimit = 50;

export const ProposalTitle: FC<ProposalProps> = ({ proposal }) => {
  const proposalInfo = useMemo(() => parseProposalInfo(proposal), [proposal]);

  const title = useMemo(() => {
    return proposal?.description.length <= titleCharacterLimit
      ? proposal?.description
      : `${proposal?.description.slice(0, titleCharacterLimit)}...`;
  }, [proposal]);

  return (
    <Tooltip
      trigger={TooltipTrigger.hover}
      className="sm:text-base cursor-pointer"
      tooltipClassName="break-words"
      content={
        <>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {proposalInfo.title}
          </ReactMarkdown>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="max-h-64 overflow-auto"
            components={{
              a: props => (
                <a href={props.href} target="_blank" rel="noreferrer">
                  {props.children}
                </a>
              ),
            }}
          >
            {proposalInfo.description}
          </ReactMarkdown>
        </>
      }
      children={
        <div>
          <p className="max-w-[20rem] m-0">{title}</p>
        </div>
      }
    />
  );
};
