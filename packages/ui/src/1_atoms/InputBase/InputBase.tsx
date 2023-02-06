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

import { noop, applyDataAttr } from '../../utils';
import { getNumberSeperator } from '../../utils/helpers';

export type InputBaseProps = Omit<
  HTMLProps<HTMLInputElement>,
  'ref' | 'size'
> & {
  debounce?: number;
  dataAttribute?: string;
  onChangeText?: (value: string) => void;
  /** @deprecated Use onChangeText if possible */
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

// Important: Do not export out of UI package, should be only used by other components!
export const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
  (
    {
      value,
      type,
      debounce = 500,
      dataAttribute,
      onChange,
      onChangeText,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [renderedValue, setRenderedValue] = useState<
      string | string[] | number | undefined
    >(value as string);

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
        if (type === 'number') {
          if (event.target.value === '') {
            setRenderedValue('');
            debouncedOnChangeHandler(event);
            return;
          }

          // count how much commas and dots are in the value
          const commas = (event.target.value.match(/,|\./g) || []).length;
          // if there are more than one comma or dot, use last valid value
          if (commas > 1) {
            event.target.value = renderedValue as string;
            event.currentTarget.value = event.target.value;
            setRenderedValue(event.target.value);
            return;
          }

          const renderSeperator = getNumberSeperator(props.lang);

          if (
            event.target.value.endsWith('.') ||
            event.target.value.endsWith(',')
          ) {
            setRenderedValue(
              `${event.target.value.slice(0, -1)}${renderSeperator}`,
            );
            return;
          }

          if (commas === 1) {
            const [integer, fraction] = event.target.value.split(/,|\./);
            if (fraction.length) {
              event.target.value = `${integer}${renderSeperator}${fraction}`;
              event.currentTarget.value = event.target.value;
            }
          }

          // if value is not a number, use last valid value
          if (isNaN(Number(event.target.value))) {
            event.target.value = renderedValue as string;
            event.currentTarget.value = event.target.value;
            setRenderedValue(event.target.value);
            return;
          }
        }
        event.persist();
        setRenderedValue(event.currentTarget?.value);
        debouncedOnChangeHandler(event);
      },
      [debouncedOnChangeHandler, props.lang, renderedValue, type],
    );

    const handleOnBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        // fix number value if user leaves input with comma or dot at the end (123. => 123)
        if (
          type === 'number' &&
          (event.target.value.endsWith('.') ||
            event.target.value.endsWith(',') ||
            event.target.value.endsWith('0'))
        ) {
          event.target.value = parseFloat(event.target.value).toString();
          event.currentTarget.value = event.target.value;
          setRenderedValue(event.currentTarget?.value);
          debouncedOnChangeHandler(event);
        }
        onBlur?.(event);
      },
      [debouncedOnChangeHandler, onBlur, type],
    );

    // updating value if it was changed by parent component
    useEffect(() => {
      setRenderedValue(value as string);
    }, [value]);

    return (
      <input
        {...props}
        type={type === 'number' ? 'text' : type}
        ref={ref}
        value={renderedValue}
        onChange={shouldAllowChanges ? handleChange : noop}
        onBlur={shouldAllowChanges ? handleOnBlur : noop}
        {...applyDataAttr(dataAttribute)}
      />
    );
  },
);
