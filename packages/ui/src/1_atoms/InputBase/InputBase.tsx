import React, {
  useState,
  HTMLProps,
  useCallback,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';

import debounceCallback from 'lodash.debounce';

import { noop, applyDataAttr } from '../../utils';
import {
  prepareValueForEvent,
  prepareValueToRender,
  parseBetterFloat,
  removeTrailingZeroes,
  getIOSInputEventHandlers,
  isIOS,
} from './utils';

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
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(
      null,
    ) as React.MutableRefObject<HTMLInputElement>;

    useImperativeHandle(ref, () => inputRef.current);

    const [cursor, setCursor] = useState<[number, number]>([0, 0]);
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

          const e =
            type === 'number'
              ? prepareValueForEvent(
                  event,
                  parseBetterFloat(event.target.value),
                )
              : event;

          onChangeText?.(e.currentTarget.value);
          onChange?.(e);
        }, debounce),
      [debounce, onChange, onChangeText, type],
    );

    const updateRenderedValue = useCallback((value: string) => {
      setCursor([
        inputRef.current.selectionStart || 0,
        inputRef.current.selectionEnd || 0,
      ]);
      setRenderedValue(value);
    }, []);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();

        const change = prepareValueToRender(
          event.target.value,
          renderedValue as string,
          type ?? 'text',
          props.lang ?? navigator.language,
        );

        updateRenderedValue(change);
        debouncedOnChangeHandler(event);
      },
      [
        debouncedOnChangeHandler,
        props.lang,
        renderedValue,
        type,
        updateRenderedValue,
      ],
    );

    const resetIOSStylesOnBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.currentTarget === null) {
          event.currentTarget = event.target;
        }

        if (isIOS()) {
          event.currentTarget.style.fontSize = 'inherit';
        }
      },
      [],
    );

    const handleOnBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.currentTarget === null) {
          event.currentTarget = event.target;
        }

        resetIOSStylesOnBlur(event);

        // fix number value if user leaves input with comma or dot at the end (123. => 123)
        if (type === 'number') {
          const e = prepareValueForEvent(
            event,
            removeTrailingZeroes(parseBetterFloat(event.target.value)),
          );

          updateRenderedValue(
            prepareValueToRender(
              e.target.value,
              '',
              'number',
              props.lang ?? navigator.language,
              false,
            ),
          );

          onChangeText?.(e.target.value);
          onChange?.(e);
          onBlur?.({
            ...event,
            target: e.target,
            currentTarget: e.currentTarget,
          });
          return;
        }
        onBlur?.(event);
      },
      [
        onBlur,
        onChange,
        onChangeText,
        props.lang,
        resetIOSStylesOnBlur,
        type,
        updateRenderedValue,
      ],
    );

    useEffect(() => {
      if (parseFloat(value as string) !== parseFloat(renderedValue as string)) {
        setRenderedValue(
          prepareValueToRender(
            value as string,
            '',
            type ?? 'text',
            props.lang ?? navigator.language,
          ),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.lang, type, value]);

    // set cursor position after value was changed
    useEffect(() => {
      if (inputRef.current && inputRef.current === document.activeElement) {
        inputRef.current.setSelectionRange(cursor[0], cursor[1]);
      }
    }, [renderedValue, cursor]);

    const isNumeric = useMemo(() => type === 'number', [type]);

    return (
      <input
        {...props}
        {...getIOSInputEventHandlers()}
        type={isNumeric ? 'text' : type}
        inputMode={isNumeric ? 'decimal' : undefined}
        pattern={isNumeric ? '[0-9]*' : undefined}
        ref={inputRef}
        value={renderedValue}
        onChange={shouldAllowChanges ? handleChange : noop}
        onBlur={shouldAllowChanges ? handleOnBlur : resetIOSStylesOnBlur}
        {...applyDataAttr(dataAttribute)}
      />
    );
  },
);
