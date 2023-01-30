import React from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';

type MobileCloseButtonProps = {
  onClick: () => void;
};

export const MobileCloseButton: React.FC<MobileCloseButtonProps> = ({
  onClick,
}) => (
  <div className="mt-9 block text-center md:hidden">
    <Button
      text={t(translations.common.buttons.close)}
      style={ButtonStyle.ghost}
      onClick={onClick}
    />
  </div>
);
