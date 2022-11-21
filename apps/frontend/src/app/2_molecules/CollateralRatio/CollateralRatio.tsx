import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Heading,
  HealthBar,
  HeadingType,
  HelperButton,
  Paragraph,
} from '@sovryn/ui';

export type CollateralRatioProps = {
  value?: number;
  minCRatio: number;
};

export const CollateralRatio: FC<CollateralRatioProps> = ({
  value,
  minCRatio,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-80">
      <div className="flex items-center justify-between mb-3">
        <Heading
          className="text-gray-10 flex items-center"
          type={HeadingType.h3}
        >
          {t('collateralRatio.title')}
          <HelperButton
            className="ml-1.5"
            content={t('collateralRatio.tooltip')}
          />
        </Heading>
        <Heading
          className="text-gray-30 flex items-center"
          type={HeadingType.h3}
        >
          {value !== undefined ? `${value}%` : 'N/A'}
        </Heading>
      </div>
      <HealthBar
        start={90}
        middleStart={110}
        middleEnd={150}
        end={250}
        value={value}
      />
      <Paragraph className="text-gray-30 flex items-center mt-2.5">
        {t('collateralRatio.description', { value: minCRatio })}
      </Paragraph>
    </div>
  );
};
