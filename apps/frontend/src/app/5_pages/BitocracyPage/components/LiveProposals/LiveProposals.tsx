import React, { FC } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';

const LiveProposals: FC = () => (
  <div className="mt-12 w-full p-6 border border-gray-50 rounded bg-gray-90">
    {t(translations.bitocracyPage.liveProposals)}
  </div>
);

export default LiveProposals;
