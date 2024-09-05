import React, { FC } from 'react';

import { Toggle } from '@sovryn/ui';

import { LendPosition } from '../../LendPositionsList.types';

type ToggleCollateralActionProps = {
  position: LendPosition;
};

export const ToggleCollateralAction: FC<ToggleCollateralActionProps> = ({
  position,
}) => (
  <Toggle
    className="[&_*]:ml-0"
    checked={position.collateral}
    onChange={() => 'TODO: implement'}
  />
);
