import React, { FC } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { pageTranslations } from '../../ProtocolDataPage.constants';

export const LendAndBorrow: FC = () => (
  <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-9">
    <Paragraph
      className="md:text-2xl text-base font-medium"
      children={t(pageTranslations.sections.lendAndBorrow)}
    />
    <div className="min-h-72 mt-5">
      <p>TODO: Add the actual content here</p>
    </div>
  </div>
);
