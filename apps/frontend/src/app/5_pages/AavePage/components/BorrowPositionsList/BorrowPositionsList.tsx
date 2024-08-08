import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.aavePage.borrowPositionsList;

type BorrowPositionsListProps = {
  account?: string;
};

export const BorrowPositionsList: FC<BorrowPositionsListProps> = ({
  account,
}) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.title)}
        </span>
      }
      className="bg-gray-70 px-4 py-3 rounded space-y-3 lg:bg-gray-90 lg:p-6 lg:border lg:border-gray-60"
      labelClassName="justify-between  h-7 flex items-center"
      open={open}
      onClick={setOpen}
    >
      {account ? (
        <></>
      ) : (
        <div className="flex items-center justify-center lg:h-12">
          <Paragraph className="text-xs text-center text-gray-30 italic font-medium leading-5 lg:text-white">
            {t(pageTranslations.connectWallet)}
          </Paragraph>
        </div>
      )}
    </Accordion>
  );
};
