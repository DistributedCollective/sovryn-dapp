import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../../../locales/i18n';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';
import { usePositionStatus } from '../../hooks/usePositionStatus';

type AmbientPositionStatusProps = {
  pool: AmbientLiquidityPool;
  position?: AmbientPosition;
  className?: string;
};
export const AmbientPositionStatus: FC<AmbientPositionStatusProps> = ({
  pool,
  position,
  className,
}) => {
  const isOutOfRange = usePositionStatus(pool, position);

  const statusLabel = useMemo(
    () =>
      isOutOfRange
        ? t(translations.ambientMarketMaking.positionsTable.status.outOfRange)
        : t(translations.ambientMarketMaking.positionsTable.status.inRange),
    [isOutOfRange],
  );

  const statusClassName = useMemo(
    () => (isOutOfRange ? 'bg-warning-75' : 'bg-success'),
    [isOutOfRange],
  );

  if (isOutOfRange === null) {
    return <>{t(translations.bobMarketMakingPage.loading)}</>;
  }

  return (
    <div className={className}>
      <div className="flex items-center">
        <div
          className={`rounded-full w-2.5 h-2.5 ${statusClassName} mr-1`}
        ></div>
        {statusLabel}
      </div>
    </div>
  );
};
