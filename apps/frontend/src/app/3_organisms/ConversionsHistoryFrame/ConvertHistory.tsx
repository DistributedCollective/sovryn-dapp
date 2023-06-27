import React, { FC, useMemo, useState } from 'react';

import { Select } from '@sovryn/ui';

import { ConvertHistoryType } from './ConvertHistory.types';
import { convertHistoryOptions } from './ConvertHistory.utils';
import { AmmConversionsHistoryFrame } from './components/AmmConversionsHistoryFrame/AmmConversionsHistoryFrame';
import { MyntConversionsHistoryFrame } from './components/MyntConversionsHistoryFrame/MyntConversionsHistoryFrame';
import { ZeroConversionsHistoryFrame } from './components/ZeroConversionsHistoryFrame/ZeroConversionsHistoryFrame';

export const ConvertHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    ConvertHistoryType.AMM,
  );

  const selectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`convert-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={(value: ConvertHistoryType) => setSelectedHistoryType(value)}
        options={convertHistoryOptions}
        className="min-w-36"
      />
    ),
    [selectedHistoryType],
  );

  const renderHistoryFrame = useMemo(() => {
    switch (selectedHistoryType) {
      case ConvertHistoryType.AMM:
        return (
          <AmmConversionsHistoryFrame>
            {selectComponent}
          </AmmConversionsHistoryFrame>
        );
      case ConvertHistoryType.MYNT:
        return (
          <MyntConversionsHistoryFrame>
            {selectComponent}
          </MyntConversionsHistoryFrame>
        );
      case ConvertHistoryType.ZERO:
        return (
          <ZeroConversionsHistoryFrame>
            {selectComponent}
          </ZeroConversionsHistoryFrame>
        );
      default:
        return null;
    }
  }, [selectedHistoryType, selectComponent]);

  return <>{renderHistoryFrame}</>;
};
