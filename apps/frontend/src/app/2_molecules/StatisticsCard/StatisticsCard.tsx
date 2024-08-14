import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { HelperButton, Icon } from '@sovryn/ui';

import { LinkIcon } from '../../1_atoms/Icons/Icons';
import { translations } from '../../../locales/i18n';
import {
  AmountRenderer,
  AmountRendererProps,
} from '../AmountRenderer/AmountRenderer';

type StatisticsCardProps = Partial<AmountRendererProps> & {
  label: string;
  link?: string;
  helperContent?: string;
  amountRendererClassName?: string;
};

export const StatisticsCard: FC<StatisticsCardProps> = ({
  link,
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

      <div className="text-2xl text-white flex items-center">
        {value ? (
          <>
            <AmountRenderer
              value={value}
              {...props}
              className={amountRendererClassName}
            />
            {link && (
              <a href={link} className="ml-3" target="_blank" rel="noreferrer">
                <Icon icon={LinkIcon} className="h-4 w-4 text-gray-30" />
              </a>
            )}
          </>
        ) : (
          <span className={amountRendererClassName}>
            {t(translations.common.na)}
          </span>
        )}
      </div>
    </div>
  );
};
