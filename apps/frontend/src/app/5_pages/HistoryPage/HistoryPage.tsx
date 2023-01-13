import React, { FC, useMemo, useState } from 'react';

import { Heading, Select, SelectOption, Tabs } from '@sovryn/ui';

import { TransactionHistoryFrame } from '../../3_organisms';
import { useAccount } from '../../../hooks/useAccount';
import styles from './HistoryPage.module.css';

const ComingSoon = () => (
  <div className="px-4 py-12 rounded my-4 lg:rounded-none lg:my-0 flex flex-row justify-center bg-gray-80">
    <Heading className="inline">Coming soon...</Heading>
  </div>
);

const ACTIVE_CLASSNAME = 'border-t-primary-30';

const HistoryPage: FC = () => {
  const [index, setIndex] = useState(0);
  const { account } = useAccount();
  const locHistoryFrame = useMemo(
    () => (
      <div className="px-0 py-4 lg:p-4">
        <TransactionHistoryFrame account={account} />
      </div>
    ),
    [account],
  );
  const items = useMemo(
    () => [
      {
        label: 'Line of Credit',
        content: locHistoryFrame,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'default',
      },
      {
        label: 'Stability pool',
        content: <ComingSoon />,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'stability',
      },
      {
        label: 'Conversion',
        content: <ComingSoon />,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'conversion',
      },
      {
        label: 'Funding',
        content: <ComingSoon />,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'funding',
      },
    ],
    [locHistoryFrame],
  );

  const options: SelectOption[] = useMemo(
    () => items.map((val, i) => ({ value: String(i), label: val.label })),
    [items],
  );

  return (
    <div className="w-full text-gray-10 mt-9 lg:mt-10">
      <Heading className="pb-2 text-center text-base lg:pb-6 lg:text-2xl">
        My transaction history
      </Heading>
      <div className="w-full">
        <div className={styles.mobileSelect}>
          <Select
            options={options}
            value={String(index)}
            onChange={(value: string) => setIndex(Number(value))}
          />
        </div>
        <div className={styles.desktop}>
          <Tabs
            items={items}
            onChange={setIndex}
            index={index}
            className="w-full"
          />
        </div>
        <div className={styles.mobile}>
          {index === 0 && locHistoryFrame}
          {index > 0 && <ComingSoon />}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
