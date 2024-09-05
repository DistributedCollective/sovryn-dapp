import React, { FC, useState } from 'react';

import { Toggle } from '@sovryn/ui';

import { useAaveSupply } from '../../../../../../../hooks/aave/useAaveSupply';
import { LendPosition } from '../../LendPositionsList.types';

type ToggleCollateralActionProps = {
  position: LendPosition;
};

export const ToggleCollateralAction: FC<ToggleCollateralActionProps> = ({
  position,
}) => {
  const { handleSwitchCollateral } = useAaveSupply();
  const [isCollateral, setIsCollateral] = useState(position.collateral);

  const toggleCollateral = async () => {
    await handleSwitchCollateral(position.asset, !isCollateral, {
      onComplete: () => setIsCollateral(!isCollateral),
    });
  };

  return (
    <Toggle
      className="[&_*]:ml-0"
      checked={isCollateral}
      onChange={toggleCollateral}
    />
  );
};
