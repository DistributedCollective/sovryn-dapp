import React, { FC } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../../../locales/i18n';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';
import { usePositionStatus } from '../../hooks/usePositionStatus';

type AmbientPositionStatusProps = {
  pool: AmbientLiquidityPool;
  position?: AmbientPosition;
  className?: string;
  isInRange?: boolean;
};
export const AmbientPositionStatus: FC<AmbientPositionStatusProps> = ({
  pool,
  position,
  className,
  isInRange = false,
}) => {
  const isOutOfRange = usePositionStatus(pool, position, isInRange);

  return (
    <div className={className}>
      <div className="flex items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-30 font-semibold">
            {!isOutOfRange ? (
              <div className="flex items-center">
                <div className="rounded-full w-2.5 h-2.5 bg-success mr-1"></div>
                {t(
                  translations.ambientMarketMaking.positionsTable.status
                    .inRange,
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <div className="rounded-full w-2.5 h-2.5 bg-warning-75 mr-1"></div>
                {t(
                  translations.ambientMarketMaking.positionsTable.status
                    .outOfRange,
                )}
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
