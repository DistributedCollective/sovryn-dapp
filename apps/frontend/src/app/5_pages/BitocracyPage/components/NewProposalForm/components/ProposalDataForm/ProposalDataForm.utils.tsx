import React from 'react';

export const generateFormGroupLabel = (
  labelText: string,
  value: string,
  maxLength: number | string,
) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div>{labelText}</div>
      <div className="text-gray-30">
        {value.length}/{maxLength}
      </div>
    </div>
  );
};

export const formatProposalText = (
  title: string,
  discussionUrl: string,
  summary: string,
  proposalText: string,
) => {
  const formattedTitle = `"${title}"`;
  const formattedDiscussionUrl = `"${discussionUrl}"`;
  const formattedSummary = `"${summary}"`;
  const formattedProposalText = `"${proposalText}"`;
  const proposalFormatText = `${formattedTitle}\n${formattedDiscussionUrl}\n${formattedSummary}\n---\n${formattedProposalText}`;
  return proposalFormatText;
};
