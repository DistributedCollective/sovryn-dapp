import React, { FC, useState } from 'react';

import { getAssetData } from '@sovryn/contracts';
import { Toggle } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

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
    await handleSwitchCollateral(
      await getAssetData(position.asset, BOB_CHAIN_ID),
      !isCollateral,
      { onComplete: () => setIsCollateral(!isCollateral) },
    );
  };

  return (
    <Toggle
      className="[&_*]:ml-0"
      checked={isCollateral}
      onChange={toggleCollateral}
    />
  );
};
