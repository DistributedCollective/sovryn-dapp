import React, { FC, useCallback, useState } from 'react';

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

  const toggleCollateral = useCallback(
    () =>
      handleSwitchCollateral(position.asset, !isCollateral, {
        onComplete: () => setIsCollateral(!isCollateral),
      }),
    [handleSwitchCollateral, setIsCollateral, isCollateral, position.asset],
  );

  return (
    <Toggle
      className="[&_*]:ml-0"
      checked={isCollateral}
      onChange={toggleCollateral}
      disabled={
        position.canToggleCollateral === false ||
        position.canBeCollateral === false
      }
    />
  );
};
