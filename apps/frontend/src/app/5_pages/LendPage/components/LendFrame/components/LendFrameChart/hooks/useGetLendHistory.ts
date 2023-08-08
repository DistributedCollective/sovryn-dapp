import { useCallback, useEffect, useMemo, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { getGraphWrapperUrl } from '../../../../../../../../utils/helpers';

export const useGetLendHistory = (asset: SupportedTokens) => {
  const [lendHistory, setLendHistory] = useState([]);
  const currentDate = useMemo(() => new Date(), []);
  const graphWrapperUrl = getGraphWrapperUrl();
  const lendContract = useLoadContract(asset, 'loanTokens');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const getLendHistory = useCallback(async () => {
    const response = await fetch(
      `${graphWrapperUrl}/lendingApy/${
        lendContract?.address
      }?stmp=${currentDate.getTime()}`,
    );
    if (response.ok) {
      const history = await response.json();

      //last 7 days of data in 4hr chunks
      const historySorted = history
        .slice(-42)
        .sort((data1, data2) =>
          new Date(data1.timestamp) > new Date(data2.timestamp) ? 1 : -1,
        );
      setLendHistory(historySorted);
      setIsDataFetched(true);
    }
  }, [lendContract, graphWrapperUrl, currentDate]);

  useEffect(() => {
    if (lendContract && !isDataFetched) {
      getLendHistory();
    }
  }, [getLendHistory, isDataFetched, lendContract]);

  return { lendHistory };
};
