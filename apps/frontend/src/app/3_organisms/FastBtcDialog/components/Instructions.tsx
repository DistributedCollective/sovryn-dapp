import React from 'react';

import { Heading, HeadingType } from '@sovryn/ui';

export const Instructions: React.FC = () => {
  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium leading-[1.375rem]">
        Instructions:
      </Heading>

      <ul className="list-disc list-inside text-xs leading-5 font-medium text-gray-30 mt-4 mb-12">
        <li className="mb-4">Only transfer BTC from the bitcoin network</li>
        <li className="mb-4">Do not send less than the minimum amount</li>
        <li className="mb-4">Do not send more than the maximum amount</li>
        <li className="mb-4">Allow up to 1.5 hrs to process</li>
        <li>
          If your transaction takes longer than 1.5 hrs please create a support
          ticket
        </li>
      </ul>
    </>
  );
};
