import React, { FC } from 'react';

import { t } from 'i18next';

import { applyDataAttr } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

type MaxDurationProps = {
  onClick?: () => void;
  dataAttribute?: string;
  className?: string;
};

export const MaxDuration: FC<MaxDurationProps> = ({
  onClick,
  dataAttribute,
  className,
}) => (
  <button
    onClick={onClick}
    className={className}
    {...applyDataAttr(dataAttribute)}
  >
    ({t(translations.fixedInterestPage.newLoanDialog.labels.maxDuration)})
  </button>
);
