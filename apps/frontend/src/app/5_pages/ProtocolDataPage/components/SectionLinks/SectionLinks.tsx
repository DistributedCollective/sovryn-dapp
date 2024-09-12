import React, { FC, useCallback } from 'react';

import { Button, ButtonStyle } from '@sovryn/ui';

type SectionLinkProps = {
  refs: React.RefObject<HTMLDivElement>[];
  labels: string[];
};

export const SectionLinks: FC<SectionLinkProps> = ({ refs, labels }) => {
  const handleRefClick = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  return (
    <div className="grid md:grid-rows-1 grid-rows-2 grid-flow-col items-center md:gap-8 gap-4 md:mb-12 mb-8 flex-wrap md:max-w-xl mx-auto">
      {refs.map((ref, index) => (
        <Button
          key={index}
          text={labels[index]}
          onClick={() => handleRefClick(ref)}
          style={ButtonStyle.ghost}
          className="text-sm font-medium"
        />
      ))}
    </div>
  );
};
