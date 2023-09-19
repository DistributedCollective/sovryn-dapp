import { useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { queryRate } from '../utils/calls';
import { useIsMounted } from './useIsMounted';

export const useQueryRate = (
  sourceToken: SupportedTokens,
  destToken: SupportedTokens,
): [Decimal, Decimal, boolean] => {
  const [rate, setRate] = useState<Decimal>(Decimal.ZERO);
  const [precision, setPrecision] = useState<Decimal>(Decimal.ONE);
  const [loading, setLoading] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted()) {
      setLoading(true);
      queryRate(sourceToken, destToken).then(result => {
        if (isMounted()) {
          setRate(result.rate);
          setPrecision(result.precision);
          setLoading(false);
        }
      });
    }
  }, [destToken, isMounted, sourceToken]);

  return [rate, precision, loading];
};
