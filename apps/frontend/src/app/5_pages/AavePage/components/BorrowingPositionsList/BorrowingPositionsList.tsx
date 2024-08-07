import React, { FC } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.aavePage.borrowingPositionsList;

type BorrowingPositionsListProps = {
  account?: string;
};

export const BorrowingPositionsList: FC<BorrowingPositionsListProps> = ({
  account,
}) => {
  return (
    <div className="bg-gray-70 px-4 py-3 rounded space-y-3">
      <div className="h-7 flex items-center">
        <Paragraph className="text-base font-medium">
          {t(pageTranslations.title)}
        </Paragraph>
      </div>

      {account ? (
        <></>
      ) : (
        <Paragraph className="text-xs text-center text-gray-30 italic font-medium leading-5">
          {t(pageTranslations.connectWallet)}
        </Paragraph>
      )}
    </div>
  );
};
