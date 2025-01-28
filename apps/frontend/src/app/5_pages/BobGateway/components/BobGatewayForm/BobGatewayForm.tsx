import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Heading,
  prettyTx,
  SimpleTable,
  SimpleTableRow,
  Tabs,
  TabType,
} from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { strategies } from '../../BobGateway.utils';
import { BobGatewayDeposit } from '../BobGatewayDeposit/BobGatewayDeposit';
import { BobGatewayWithdraw } from '../BobGatewayWithdraw/BobGatewayWithdraw';

export const BobGatewayForm: FC = () => {
  const [index, setIndex] = useState(0);
  const [strategyAddress, setStrategyAddress] = useState<string>(
    strategies[0].strategyAddress,
  );

  const strategy = strategies.find(t => t.strategyAddress === strategyAddress);

  const items = useMemo(
    () => [
      {
        label: t(translations.bobGatewayPage.deposit),
        content: (
          <BobGatewayDeposit
            strategyAddress={strategyAddress}
            setStrategyAddress={setStrategyAddress}
          />
        ),
        dataAttribute: 'bob-gateway-deposit',
      },
      {
        label: t(translations.bobGatewayPage.withdraw),
        content: <BobGatewayWithdraw strategyAddress={strategyAddress} />,
        dataAttribute: 'bob-gateway-withdraw',
      },
    ],
    [strategyAddress],
  );

  return (
    <div className="flex items-start py-8 justify-center gap-6">
      <div className="p-0 sm:border sm:border-gray-50 sm:rounded lg:min-w-[28rem] sm:p-6 sm:bg-gray-90">
        <Tabs
          items={items}
          onChange={setIndex}
          index={index}
          type={TabType.slider}
          className="w-full"
          labelsClassName="border border-gray-50"
        />
      </div>
      <SimpleTable className="flex-1 lg:max-w-[25rem]">
        <Heading className="text-lg font-medium mb-3">Strategy details</Heading>
        <SimpleTableRow label="Name" value={strategy?.name} />
        <SimpleTableRow label="Category" value={strategy?.category} />
        <SimpleTableRow label="Incentives" value={strategy?.incentives} />
        <SimpleTableRow
          label="Token"
          value={prettyTx(strategy?.strategyAddress || '', 4, 4)}
        />
        <SimpleTableRow label="About" value={strategy?.about} />
      </SimpleTable>
    </div>
  );
};
