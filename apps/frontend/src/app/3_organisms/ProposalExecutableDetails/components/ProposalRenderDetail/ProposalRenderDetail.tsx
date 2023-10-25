import React, { FC, ReactNode } from 'react';

type ProposalRenderDetailProps = {
  label: string;
  content: ReactNode;
  className?: string;
};

export const ProposalRenderDetail: FC<ProposalRenderDetailProps> = ({
  label,
  content,
  className,
}) => (
  <div className={`grid grid-cols-2 w-full gap-3 mt-3 ${className}`}>
    <div className="text-xs">{label}</div>
    <div className="text-xs text-right">{content}</div>
  </div>
);
