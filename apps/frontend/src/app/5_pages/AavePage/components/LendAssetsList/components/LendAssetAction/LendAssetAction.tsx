import React, { FC } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

type LendAssetActionProps = {
  disabled: boolean;
  onLendClick: () => void;
  asset: string;
};

export const LendAssetAction: FC<LendAssetActionProps> = ({
  asset,
  disabled,
  onLendClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        disabled={disabled}
        className="flex-grow lg:flex-grow-0 lg:w-min"
        text={t(translations.aavePage.common.lend)}
        onClick={onLendClick}
      />

      <Button
        className="flex-grow lg:flex-grow-0 lg:w-min"
        text={t(translations.aavePage.common.details)}
        style={ButtonStyle.secondary}
        onClick={() => navigate(`/aave/reserve-overview?asset=${asset}`)}
      />
    </div>
  );
};
