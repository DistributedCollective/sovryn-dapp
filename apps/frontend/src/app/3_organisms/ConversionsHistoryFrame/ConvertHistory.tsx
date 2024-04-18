import React, { FC, useMemo, useState } from 'react';

import { Select } from '@sovryn/ui';

import { CONVERT_HISTORY_OPTIONS } from './ConvertHistory.constants';
import { ConvertHistoryType } from './ConvertHistory.types';
import { AmmConversionsHistoryFrame } from './components/AmmConversionsHistoryFrame/AmmConversionsHistoryFrame';
import { BobConversionsHistoryFrame } from './components/BobConversionHistoryFrame/BobConversionsHistoryFrame';
import { MyntConversionsHistoryFrame } from './components/MyntConversionsHistoryFrame/MyntConversionsHistoryFrame';
import { ZeroConversionsHistoryFrame } from './components/ZeroConversionsHistoryFrame/ZeroConversionsHistoryFrame';

export const ConvertHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    ConvertHistoryType.AMM,
  );

  const SelectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`convert-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={setSelectedHistoryType}
        options={CONVERT_HISTORY_OPTIONS}
        className="min-w-36 w-full lg:w-auto"
      />
    ),
    [selectedHistoryType],
  );

  const renderHistoryFrame = useMemo(() => {
    switch (selectedHistoryType) {
      case ConvertHistoryType.AMM:
        return (
          <AmmConversionsHistoryFrame>
            {SelectComponent}
          </AmmConversionsHistoryFrame>
        );
      case ConvertHistoryType.BOB:
        return (
          <BobConversionsHistoryFrame>
            {SelectComponent}
          </BobConversionsHistoryFrame>
        );
      case ConvertHistoryType.MYNT:
        return (
          <MyntConversionsHistoryFrame>
            {SelectComponent}
          </MyntConversionsHistoryFrame>
        );
      case ConvertHistoryType.ZERO:
        return (
          <ZeroConversionsHistoryFrame>
            {SelectComponent}
          </ZeroConversionsHistoryFrame>
        );
      default:
        return null;
    }
  }, [selectedHistoryType, SelectComponent]);

  return <>{renderHistoryFrame}</>;
};
