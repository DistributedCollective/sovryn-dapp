import React, { useCallback, useEffect, MouseEvent, useRef } from 'react';

import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';

import { applyDataAttr } from '../../utils';
import { Overlay, OverlayProps } from '../Overlay/Overlay';
import styles from './Dialog.module.css';
import {
  DialogSize,
  dialogSizeMap,
  IDialogFunctionComponent,
} from './Dialog.types';

type DialogProps = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  width?: DialogSize;
  dataLayoutId?: string;
  overlayProps?: Omit<Partial<OverlayProps>, 'isOpen' | 'fixed'>;
  onClose?: () => void;
  closeOnEscape?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  disableFocusTrap?: boolean;
  buttonCloseText?: string;
};

export const Dialog: IDialogFunctionComponent<DialogProps> = ({
  isOpen,
  children,
  className,
  width = DialogSize.md,
  dataLayoutId = '',
  overlayProps,
  onClose,
  closeOnEscape = true,
  initialFocusRef,
  disableFocusTrap,
  buttonCloseText = 'Maybe Later',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => onClose?.(), [onClose]);

  const handleChildElementClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    // make sure that multiple dialogs opened showing up in correct order.
    Dialog.index++;
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        // close the dialog only if it's the topmost one
        if (
          ref.current === document.activeElement ||
          ref.current?.contains(document.activeElement)
        ) {
          handleClose();
        }
      }
    };

    if (closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen && initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [isOpen, initialFocusRef]);

  return (
    <Overlay
      zIndex={100 + Dialog.index}
      isOpen={isOpen}
      fixed
      portalTarget="body"
      portalClassName={styles.overlay}
      onBlur={handleClose}
      {...overlayProps}
    >
      <div className={styles.wrapper} {...applyDataAttr(dataLayoutId)}>
        <div className={styles.container}>
          <FocusTrap
            active={isOpen && !disableFocusTrap}
            focusTrapOptions={{
              initialFocus: initialFocusRef?.current || undefined,
              fallbackFocus: () => ref.current!,
            }}
          >
            <section
              className={classNames(
                styles.dialog,
                dialogSizeMap[width],
                className,
              )}
              role="dialog"
              ref={ref}
              onClick={handleChildElementClick}
              tabIndex={-1}
            >
              {children}
              <button onClick={handleClose} className={styles.buttonClose}>
                {buttonCloseText}
              </button>
            </section>
          </FocusTrap>
        </div>
      </div>
    </Overlay>
  );
};

Dialog.index = 0;
