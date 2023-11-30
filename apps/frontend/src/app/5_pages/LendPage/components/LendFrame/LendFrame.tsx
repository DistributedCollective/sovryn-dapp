import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Paragraph, Table } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { LendingPoolDictionary } from '../../../../../utils/LendingPoolDictionary';
import { COLUMNS_CONFIG } from './LendFrame.constants';
import { generateRowSubTitle, generateRowTitle } from './LendFrame.utils';
import { LendFrameDetails } from './components/LendFrameDetails/LendFrameDetails';

export const LendFrame: FC = () => {
  const lendPools = useMemo(() => LendingPoolDictionary.list(), []);
  const [expandedIndex, setExpandedIndex] = useState<number>();

  const onRowClick = useCallback(
    (pool: LendingPool) => {
      const index = lendPools.indexOf(pool);
      setExpandedIndex(expandedIndex === index ? undefined : index);
    },
    [expandedIndex, lendPools],
  );
  return (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <Paragraph className="text-base font-medium">
          {t(translations.lendPage.table.lend)}
        </Paragraph>
      </div>

      <div className="lg:bg-gray-80 lg:p-4 rounded">
        <Table
          columns={COLUMNS_CONFIG}
          rows={lendPools}
          rowTitle={generateRowTitle}
          onRowClick={onRowClick}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="lend-frame-table"
          expandedContent={pool => <LendFrameDetails pool={pool} />}
          expandedIndex={expandedIndex}
          expandedClassNames="border border-gray-70 border-t-0"
          preventExpandOnClickClass="prevent-row-click"
          subtitleRenderer={generateRowSubTitle}
        />
      </div>
    </div>
  );
};
