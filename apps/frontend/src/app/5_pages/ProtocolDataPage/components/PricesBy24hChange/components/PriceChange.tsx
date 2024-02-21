import React from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetValue } from '../../../../../2_molecules/AssetValue/AssetValue';

type PriceChangeProps = {
  value: number;
};

export const PriceChange: React.FC<PriceChangeProps> = ({ value }) => {
  return (
    <div
      className={classNames('inline-flex items-center', {
        'text-negative': value < 0,
        'text-positive': value > 0,
      })}
    >
      <AssetValue value={Decimal.from(value)} showNegativeSign={value < 0} />%
      <Icon
        className={classNames('ml-1', {
          'rotate-90': value < 0,
        })}
        size={10}
        icon={IconNames.TOP_RIGHT_ARROW}
        viewBox="0 0 9 8"
      />
    </div>
  );
};
