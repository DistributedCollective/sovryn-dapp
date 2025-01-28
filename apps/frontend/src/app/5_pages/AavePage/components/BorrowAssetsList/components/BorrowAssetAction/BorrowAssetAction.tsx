import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aavePage;

type BorrowAssetActionProps = {
  onBorrowClick: () => void;
  asset: string;
  disabled: boolean;
};

export const BorrowAssetAction: FC<BorrowAssetActionProps> = ({
  onBorrowClick,
  asset,
  disabled,
}) => {
  const navigate = useNavigate();

  const onDetailsClick = useCallback(
    () => navigate(`/aave/reserve-overview?asset=${asset}`),
    [navigate, asset],
  );

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        disabled={disabled}
        className="flex-grow lg:flex-grow-0 lg:w-min"
        text={t(pageTranslations.common.borrow)}
        onClick={onBorrowClick}
      />

      <Button
        className="flex-grow lg:flex-grow-0 lg:w-min"
        text={t(pageTranslations.common.details)}
        style={ButtonStyle.secondary}
        onClick={onDetailsClick}
      />
    </div>
  );
};
