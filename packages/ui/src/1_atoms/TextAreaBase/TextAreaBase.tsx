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
import { getIOSInputEventHandlers, isIOS } from '../InputBase/utils';

export type TextAreaBaseProps = Omit<
  HTMLProps<HTMLTextAreaElement>,
  'ref' | 'size'
> & {
  debounce?: number;
  dataAttribute?: string;
  onChangeText?: (value: string) => void;
  /** @deprecated Use onChangeText if possible */
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
};

// Important: Do not export out of UI package, should be only used by other components!
export const TextAreaBase = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaBaseProps
>(
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
      onFocus,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLTextAreaElement>(
      null,
    ) as React.MutableRefObject<HTMLTextAreaElement>;

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
        debounceCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
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

    const updateRenderedValue = useCallback((value: string) => {
      setCursor([
        inputRef.current.selectionStart || 0,
        inputRef.current.selectionEnd || 0,
      ]);
      setRenderedValue(value);
    }, []);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.persist();
        updateRenderedValue(event.target.value);
        debouncedOnChangeHandler(event);
      },
      [debouncedOnChangeHandler, updateRenderedValue],
    );

    const resetIOSStylesOnBlur = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget === null) {
          event.currentTarget = event.target;
        }

        if (isIOS()) {
          event.currentTarget.style.fontSize = 'inherit';
        }
      },
      [],
    );

    const handleOnFocus = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget === null) {
          event.currentTarget = event.target;
        }

        if (isIOS()) {
          event.currentTarget.style.fontSize = '1rem';
        }

        onFocus?.(event);
      },
      [onFocus],
    );

    const handleOnBlur = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget === null) {
          event.currentTarget = event.target;
        }

        resetIOSStylesOnBlur(event);
        onBlur?.(event);
      },
      [onBlur, resetIOSStylesOnBlur],
    );

    // set cursor position after value was changed
    useEffect(() => {
      if (inputRef.current && inputRef.current === document.activeElement) {
        inputRef.current.setSelectionRange(cursor[0], cursor[1]);
      }
    }, [renderedValue, cursor]);

    return (
      <textarea
        {...props}
        {...getIOSInputEventHandlers()}
        ref={inputRef}
        value={renderedValue}
        onChange={shouldAllowChanges ? handleChange : noop}
        onBlur={shouldAllowChanges ? handleOnBlur : resetIOSStylesOnBlur}
        onFocus={handleOnFocus}
        title=""
        {...applyDataAttr(dataAttribute)}
      />
    );
  },
);
