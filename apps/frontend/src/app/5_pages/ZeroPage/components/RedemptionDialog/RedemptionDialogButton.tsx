import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { useRedemptionDialog } from './useRedemptionDialog';

type RedemptionDialogButtonProps = {
  size?: ButtonSize;
};

export const RedemptionDialogButton: FC<RedemptionDialogButtonProps> = ({
  size,
}) => {
  const { setOpen } = useRedemptionDialog();
  return (
    <div className={classNames('flex justify-center md:justify-end mb-9')}>
      <Button
        className="flex-1 md:flex-initial max-w-[20.5rem] md:max-w-none"
        onClick={() => setOpen(true)}
        text={t(translations.zeroPage.redeem.cta)}
        dataAttribute="zero-loc-open"
        style={ButtonStyle.secondary}
        size={size}
      />
    </div>
  );
};
