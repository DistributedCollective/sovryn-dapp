import { useEffect, useState } from 'react';

import { CrocTokenView } from '@sovryn/sdex/dist/tokens';

export const useGetTokenDecimals = (
  baseToken: CrocTokenView | undefined,
  quoteToken: CrocTokenView | undefined,
) => {
  const [loading, setLoading] = useState(false);
  const [baseTokenDecimals, setBaseTokenDecimals] = useState(0);
  const [quoteTokenDecimals, setQuoteTokenDecimals] = useState(0);

  useEffect(() => {
    const getTokenDecimals = async () => {
      if (!baseToken || !quoteToken) return;

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
  }, [baseToken, quoteToken]);

  return { loading, baseTokenDecimals, quoteTokenDecimals };
};
