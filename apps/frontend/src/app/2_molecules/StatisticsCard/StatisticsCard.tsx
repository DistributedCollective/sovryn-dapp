import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import {
  AmountRenderer,
  AmountRendererProps,
} from '../AmountRenderer/AmountRenderer';

type StatisticsCardProps = Partial<AmountRendererProps> & {
  label: string;
  helperContent?: string;
  amountRendererClassName?: string;
};

export const StatisticsCard: FC<StatisticsCardProps> = ({
  label,
  value,
  helperContent,
  amountRendererClassName,
  className,
  ...props
}) => {
  return (
    <div className={classNames('space-y-3', className)}>
      <div className="flex space-x-2 items-center text-gray-30">
        <span className="text-xs  font-medium">{label}</span>
        {helperContent && <HelperButton content={helperContent} />}
      </div>

      <div className="text-2xl text-white">
        {value ? (
          <AmountRenderer
            value={value}
            {...props}
            className={amountRendererClassName}
          />
        ) : (
          <span className={amountRendererClassName}>
            {t(translations.aavePage.topPanel['n/a'])}
          </span>
        )}
      </div>
    </div>
  );
};
