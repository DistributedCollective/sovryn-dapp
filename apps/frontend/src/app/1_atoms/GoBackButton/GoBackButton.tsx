import React from 'react';

import { Icon, IconNames } from '@sovryn/ui';

type GoBackButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const GoBackButton: React.FC<GoBackButtonProps> = ({
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="mb-12 md:mb-0 disabled:opacity-60"
  >
    <Icon icon={IconNames.ARROW_LEFT} className="w-3 h-3" />
  </button>
);
