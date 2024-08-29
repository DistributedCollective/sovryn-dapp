import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

type BorrowPositionActionProps = {
  onRepayClick: () => void;
};

export const BorrowPositionAction: FC<BorrowPositionActionProps> = ({
  onRepayClick,
}) => (
  <div className="flex items-center justify-center lg:justify-end space-x-2">
    <Button
      style={ButtonStyle.secondary}
      className="flex-grow"
      text={t(translations.aavePage.borrowPositionsList.repay)}
      onClick={onRepayClick}
    />
  </div>
);
