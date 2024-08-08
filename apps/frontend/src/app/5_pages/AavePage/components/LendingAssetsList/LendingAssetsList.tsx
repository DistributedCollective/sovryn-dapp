import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.aavePage.lendingAssetsList;

type LendingAssetsListProps = {
  account?: string;
};

export const LendingAssetsList: FC<LendingAssetsListProps> = ({ account }) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.title)}
        </span>
      }
      className="bg-gray-70 px-4 py-3 rounded space-y-3 lg:bg-gray-90 lg:p-6"
      labelClassName="justify-between  h-7 flex items-center"
      open={open}
      onClick={setOpen}
    >
      <div>Content</div>
    </Accordion>
  );
};
