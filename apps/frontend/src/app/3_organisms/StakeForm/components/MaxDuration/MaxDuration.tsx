import React, { FC } from 'react';

import { t } from 'i18next';

import { applyDataAttr } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

type MaxDurationProps = {
  onClick?: () => void;
  dataAttribute?: string;
};

export const MaxDuration: FC<MaxDurationProps> = ({
  onClick,
  dataAttribute,
}) => (
  <button
    onClick={onClick}
    className="text-xs font-medium underline whitespace-nowrap absolute -top-8 right-0"
    {...applyDataAttr(dataAttribute)}
  >
    ({t(translations.stakePage.stakeForm.maxDuration)})
  </button>
);
