import { useCallback, useEffect, useState } from 'react';

export const useAsync = <T>(asyncFunction: () => Promise<T>) => {
  const [value, setValue] = useState<T>();
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    () =>
      asyncFunction()
        .then(setValue)
        .catch(() => setValue(undefined)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    execute();
  }, [execute]);
  return value;
};
