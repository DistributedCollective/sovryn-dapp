import React from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

type ReceiveFlowProps = {
  onClose: () => void;
};

export const ReceiveFlow: React.FC<ReceiveFlowProps> = () => {
  return (
    <div className="flex flex-col gap-4">
      <Paragraph size={ParagraphSize.base}>
        Placeholder for ERC20 Bridge Receive Flow
      </Paragraph>
      {/* Add your receive flow implementation here */}
    </div>
  );
};
