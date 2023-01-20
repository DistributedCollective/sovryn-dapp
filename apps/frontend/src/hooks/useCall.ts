import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type State<T> = {
  value: T | null;
  loading: boolean;
  error: Error | null;
};

type Result<T> = [T, () => Promise<T | null>, boolean, Error | null];

export const useCall = <T>(
  callback: () => Promise<T>,
  deps?: DependencyList,
): Result<T> => {
  const callbackRef = useRef(callback);
  const [state, setState] = useState<State<T>>({
    value: null as T,
    loading: false,
    error: null,
  });

  useEffect(() => {
    callbackRef.current = callback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  const handleCall = useCallback(async () => {
    setState(state => ({ ...state, loading: true, error: null }));
    try {
      const result = await callbackRef.current();
      setState({ loading: false, value: result, error: null });
      return result;
    } catch (error) {
      setState(state => ({ ...state, loading: false, error }));
      return null;
    }
  }, []);

  return [state.value as T, handleCall, state.loading, state.error];
};
