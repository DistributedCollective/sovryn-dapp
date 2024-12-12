import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Tabs } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { BobGatewayDeposit } from '../BobGatewayDeposit/BobGatewayDeposit';

export const BobGatewayForm: FC = () => {
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () => [
      {
        label: t(translations.bobGatewayPage.deposit),
        content: <BobGatewayDeposit />,
        dataAttribute: 'bob-gateway-deposit',
      },
      {
        label: t(translations.bobGatewayPage.deposit),
        content: <BobGatewayDeposit />,
        dataAttribute: 'bob-gateway-deposit',
      },
    ],
    [],
  );

  return (
    <div className="flex py-8 justify-center gap-6">
      <div className="p-0 sm:border sm:border-gray-50 sm:rounded lg:min-w-[28rem] sm:p-6 sm:bg-gray-90">
        <Tabs
          items={items}
          onChange={setIndex}
          index={index}
          className="w-full border-none"
          contentClassName="border-none"
        />
      </div>
    </div>
  );
};
