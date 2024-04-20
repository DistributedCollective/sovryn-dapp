import React from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

type MobileCloseButtonProps = {
  onClick: () => void;
  dataAttribute?: string;
};

export const MobileCloseButton: React.FC<MobileCloseButtonProps> = ({
  onClick,
  dataAttribute,
}) => (
  <div className="mt-9 block text-center md:hidden">
    <Button
      text={t(translations.common.buttons.close)}
      style={ButtonStyle.ghost}
      onClick={onClick}
      dataAttribute={dataAttribute}
    />
  </div>
);
