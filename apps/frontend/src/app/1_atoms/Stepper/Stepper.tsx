import React from 'react';

import classNames from 'classnames';

export interface StepperProps {
  steps: number;
  activeStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  className,
}) => (
  <div className={classNames('flex items-center gap-2 w-full', className)}>
    {Array.from({ length: steps }, (_, index) => (
      <div
        className={classNames('h-1 flex-1 rounded-full transition-colors', {
          'bg-primary-20': index < activeStep,
          'bg-gray-40': index >= activeStep,
        })}
        key={index}
      />
    ))}
  </div>
);
