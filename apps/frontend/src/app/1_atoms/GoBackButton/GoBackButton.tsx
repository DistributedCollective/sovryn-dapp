import React from 'react';

import { Icon, IconNames } from '@sovryn/ui';

type GoBackButtonProps = {
  onClick: () => void;
};

export const GoBackButton: React.FC<GoBackButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="mb-12 md:mb-0">
    <Icon icon={IconNames.ARROW_LEFT} className="w-3 h-3" />
  </button>
);
