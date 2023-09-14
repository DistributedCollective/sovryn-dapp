import { useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { queryReturn } from '../utils/calls';
import { useIsMounted } from './useIsMounted';

export const useQueryReturn = (
  sourceToken: SupportedTokens,
  destToken: SupportedTokens,
  sourceAmount: Decimal,
): [Decimal, boolean] => {
  const [rate, setRate] = useState<Decimal>(Decimal.ZERO);
  const [loading, setLoading] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted()) {
      setLoading(true);
      queryReturn(sourceToken, destToken, sourceAmount).then(rate => {
        if (isMounted()) {
          setRate(rate);
          setLoading(false);
        }
      });
    }
  }, [destToken, isMounted, sourceAmount, sourceToken]);

  return [rate, loading];
};
