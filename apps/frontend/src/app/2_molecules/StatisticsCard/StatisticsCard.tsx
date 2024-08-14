import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { ReactElement } from 'react-markdown/lib/react-markdown';

import { HelperButton, Icon } from '@sovryn/ui';

import { LinkIcon } from '../../1_atoms/Icons/Icons';
import { translations } from '../../../locales/i18n';

type StatisticsCardProps = {
  label: string;
  value?: ReactElement;
  link?: string;
  help?: string;
  className?: string;
  valueClassName?: string;
};

export const StatisticsCard: FC<StatisticsCardProps> = ({
  link,
  label,
  value,
  help,
  className,
}) => {
  return (
    <div className={classNames('space-y-3', className)}>
      <div className="flex space-x-2 items-center text-gray-30">
        <span className="text-xs  font-medium">{label}</span>
        {help && <HelperButton content={help} />}
      </div>

      <div className="text-white flex items-center">
        {value ? (
          <>
            {value}
            {link && (
              <a href={link} className="ml-3" target="_blank" rel="noreferrer">
                <Icon icon={LinkIcon} className="h-4 w-4 text-gray-30" />
              </a>
            )}
          </>
        ) : (
          <span>{t(translations.common.na)}</span>
        )}
      </div>
    </div>
  );
};
