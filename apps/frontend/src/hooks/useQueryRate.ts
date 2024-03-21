import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { maybeWrappedAsset } from '../utils/asset';
import { queryRate } from '../utils/calls';
import { useIsMounted } from './useIsMounted';

// only for RSK network.
export const useQueryRate = (
  sourceToken: string,
  destToken: string,
): [Decimal, Decimal, boolean] => {
  const [rate, setRate] = useState<Decimal>(Decimal.ZERO);
  const [precision, setPrecision] = useState<Decimal>(Decimal.ONE);
  const [loading, setLoading] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted()) {
      setLoading(true);
      queryRate(
        maybeWrappedAsset(sourceToken),
        maybeWrappedAsset(destToken),
      ).then(result => {
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
