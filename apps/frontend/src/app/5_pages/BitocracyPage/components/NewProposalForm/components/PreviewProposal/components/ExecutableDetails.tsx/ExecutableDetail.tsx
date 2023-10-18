import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading } from '@sovryn/ui';

import { ProposalExecutableDetail } from '../../../../../../../../3_organisms/ProposalExecutableDetails/ProposalExecutableDetails';
import { translations } from '../../../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';

type ExecutableDetailsProps = {
  parameters: ProposalCreationParameter[];
};

const pageTranslations = translations.proposalPage.executableDetails;

export const ExecutableDetails: FC<ExecutableDetailsProps> = ({
  parameters,
}) => (
  <div className="bg-gray-90 p-6 rounded">
    <Heading className="text-sm font-medium">
      {t(pageTranslations.title)}
    </Heading>
    <div className="py-1 mt-2 flex flex-col flex-wrap gap-8">
      {parameters.map((parameter, i) => (
        <ProposalExecutableDetail
          key={parameter.signature + i}
          parameter={parameter}
          index={i}
        />
      ))}
    </div>
  </div>
);
