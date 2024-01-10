import React, { FC } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import stepFirstIcon from '../../../../../../../assets/images/GetStarted/1.svg';
import stepSecondIcon from '../../../../../../../assets/images/GetStarted/2.svg';
import stepThirdIcon from '../../../../../../../assets/images/GetStarted/3.svg';
import { translations } from '../../../../../../../locales/i18n';
import { Step } from './GetStartedSteps.types';

const pageTranslations = translations.landingPage.getStarted.steps;

const stepsData: Step[] = [
  {
    title: t(pageTranslations.first.title),
    description: t(pageTranslations.first.description),
    icon: stepFirstIcon,
  },
  {
    title: t(pageTranslations.second.title),
    description: t(pageTranslations.second.description),
    icon: stepSecondIcon,
  },
  {
    title: t(pageTranslations.third.title),
    description: t(pageTranslations.third.description),
    icon: stepThirdIcon,
  },
];

export const GetStartedSteps: FC = () => (
  <div className="sm:my-16 my-6 ml-3">
    {stepsData.map((step, index) => (
      <div key={index} className="flex items-start mb-8">
        <div className="p-2 rounded bg-gray-70 mr-9 w-12 h-12 flex items-center justify-center min-w-12">
          <img src={step.icon} alt={step.title} />
        </div>
        <div>
          <Paragraph className="font-medium text-base mb-2.5">
            {step.title}
          </Paragraph>
          <Paragraph className="text-gray-30 text-xs font-medium">
            {step.description}
          </Paragraph>
        </div>
      </div>
    ))}
  </div>
);
