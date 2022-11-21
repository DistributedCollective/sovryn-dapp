import React, { useCallback, useMemo, useState } from 'react';
import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { ITabItem, Tabs } from '@sovryn/ui';

import { AdjustCreditLine } from './AdjustCreditLine';

export const ZeroLocForm: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const [hasLoan, setHasLoan] = useState(false);

  const [collateralValue, setCollateralValue] = useState('0');
  const [creditValue, setCreditValue] = useState('0');

  const onCreditLineSubmitted = useCallback(() => {
    setHasLoan(true);
  }, []);

  const AdjustCreditLineComp = useMemo(
    () => (
      <AdjustCreditLine
        collateralValue={collateralValue}
        creditValue={creditValue}
        onCollateralChange={setCollateralValue}
        onCreditChange={setCreditValue}
        onSubmit={onCreditLineSubmitted}
      />
    ),
    [collateralValue, creditValue, onCreditLineSubmitted],
  );

  const tabs = useMemo(
    () =>
      [
        {
          label: t('zeroLocForm.tabs.adjust'),
          content: <>{AdjustCreditLineComp}</>,
          activeClassName: 'border-t-primary-30',
        },
        {
          label: t('zeroLocForm.tabs.close'),
          content: <div>Close</div>,
          activeClassName: 'border-t-primary-30',
        },
      ] as ITabItem[],
    [AdjustCreditLineComp, t],
  );

  return (
    <>
      <div className="flex flex-row justify-between gap-4 mb-5 bg-gray-70 p-4">
        <div>
          <p>Collateral</p>
          <p>{collateralValue}</p>
        </div>
        <div>
          <p>Credit</p>
          <p>{creditValue}</p>
        </div>
      </div>

      {!hasLoan ? (
        <div className="pt-8 px-5 pb-7 border rounded border-gray-50 bg-gray-90">
          {AdjustCreditLineComp}
        </div>
      ) : (
        <Tabs
          items={tabs}
          index={activeTab}
          onChange={setActiveTab}
          contentClassName="px-5 pt-8 pb-6"
          className="w-full"
        />
      )}
    </>
  );
};
