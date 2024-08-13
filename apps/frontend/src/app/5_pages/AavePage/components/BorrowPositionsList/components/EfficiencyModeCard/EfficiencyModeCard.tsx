import React, { FC } from 'react';

import { Icon } from '@sovryn/ui';

import { EModeIcon } from '../../../../../../1_atoms/Icons/Icons';

type EfficiencyModeCardProps = {};

export const EfficiencyModeCard: FC<EfficiencyModeCardProps> = () => {
  return (
    <div>
      <Icon icon={EModeIcon} />
    </div>
  );
};
