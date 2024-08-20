import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  Icon,
  IconNames,
  Link,
  Paragraph,
  Tooltip,
  TooltipTrigger,
} from '@sovryn/ui';

import { EModeIcon } from '../../../../../../1_atoms/Icons/Icons';
import { translations } from '../../../../../../../locales/i18n';

type EfficiencyModeCardProps = {
  className?: string;
  enabled: boolean;
};

export const EfficiencyModeCard: FC<EfficiencyModeCardProps> = ({
  className,
  enabled,
}) => {
  return (
    <Tooltip
      className={classNames('flex flex-row gap-2 items-center', className)}
      tooltipClassName="p-1 bg-gray-80"
      trigger={TooltipTrigger.click}
      content={
        <div className="max-w-52 ">
          <div className="p-[10px] text-white space-y-1">
            <Paragraph className="font-medium text-sm">
              {t(translations.aavePage.eModeCard.title)}
            </Paragraph>
            <Paragraph>
              {t(translations.aavePage.eModeCard.description)}{' '}
              <Link href="#" text={t(translations.common.learnMore)} />
            </Paragraph>
          </div>
          <Button
            text={
              enabled
                ? t(translations.common.buttons.disable)
                : t(translations.common.buttons.enable)
            }
            className="w-full"
          />
        </div>
      }
    >
      <div>
        <Icon className="text-gray-30" icon={EModeIcon} size={16} />
        <span className="text-gray-30 text-sm">
          {enabled
            ? t(translations.aavePage.eModeCard.enabled)
            : t(translations.aavePage.eModeCard.disabled)}
        </span>
        <Icon icon={IconNames.SETTINGS} />
      </div>
    </Tooltip>
  );
};
