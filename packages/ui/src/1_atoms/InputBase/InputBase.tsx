import React, {
  useState,
  HTMLProps,
  useCallback,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
  useMemo,
} from 'react';

import debounceCallback from 'lodash.debounce';

import { noop } from '../../utils.ts';

export type InputBaseProps = Omit<HTMLProps<HTMLInputElement>, 'ref'> & {
  debounce?: number;
  dataActionId?: string;
  onChangeText?: (value: string) => void;
  /** @deprecated Use onChangeText if possible */
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

// Important: Do not export out of UI package, should be only used by other components!
export const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
  (
    { value, debounce = 500, dataActionId, onChange, onChangeText, ...props },
    ref,
  ) => {
    const [renderedValue, setRenderedValue] = useState<
      string | string[] | number | undefined
    >(value);

    const shouldAllowChanges = useMemo(
      () => !props.readOnly && !props.disabled,
      [props.disabled, props.readOnly],
    );

    const debouncedOnChangeHandler = useMemo(
      () =>
        debounceCallback((event: ChangeEvent<HTMLInputElement>) => {
          // some inputs may depend on currentTarget, but it may be nullified when debouncing completes
          // assigning event.target for backwards compatibility.
          if (event.currentTarget === null) {
            event.currentTarget = event.target;
          }
          onChangeText?.(event.currentTarget.value);
          onChange?.(event);
        }, debounce),
      [debounce, onChange, onChangeText],
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setRenderedValue(event.currentTarget?.value);
        debouncedOnChangeHandler(event);
      },
      [debouncedOnChangeHandler],
    );

    // updating value if it was changed by parent component
    useEffect(() => {
      if (shouldAllowChanges) {
        setRenderedValue(value);
      }
    }, [shouldAllowChanges, value]);

    return (
      <input
        {...props}
        ref={ref}
        value={renderedValue}
        onChange={shouldAllowChanges ? handleChange : noop}
        data-action-id={dataActionId}
      />
    );
  },
);
