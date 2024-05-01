import { useEffect, useState } from 'react';

import { CrocTokenView } from '@sovryn/sdex/dist/tokens';

import { useIsMounted } from '../../../../../../hooks/useIsMounted';

export const useGetTokenDecimals = (
  baseToken: CrocTokenView | undefined,
  quoteToken: CrocTokenView | undefined,
) => {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [baseTokenDecimals, setBaseTokenDecimals] = useState(0);
  const [quoteTokenDecimals, setQuoteTokenDecimals] = useState(0);

  useEffect(() => {
    const getTokenDecimals = async () => {
      if (!baseToken || !quoteToken || !isMounted()) {
        return;
      }

      setLoading(true);

      const [baseDecimals, quoteDecimals] = await Promise.all([
        baseToken.decimals,
        quoteToken.decimals,
      ]);

      setBaseTokenDecimals(baseDecimals);
      setQuoteTokenDecimals(quoteDecimals);

      setLoading(false);
    };

    getTokenDecimals();
  }, [baseToken, isMounted, quoteToken]);

  return { loading, baseTokenDecimals, quoteTokenDecimals };
};
