import React, { FC } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '@sovryn/ui';

import {
  AmountRenderer,
  AmountRendererProps,
} from '../AmountRenderer/AmountRenderer';

type AmountTransitionProps = {
  className?: string;
  to: AmountRendererProps;
  from: AmountRendererProps;
};

export const AmountTransition: FC<AmountTransitionProps> = ({
  from,
  to,
  className,
}) => {
  return (
    <div className={classNames('flex items-center gap-1', className)}>
      <AmountRenderer {...from} />
      <Icon icon={IconNames.ARROW_RIGHT} className="h-2 flex-shrink-0" />
      <AmountRenderer {...to} />
    </div>
  );
};
