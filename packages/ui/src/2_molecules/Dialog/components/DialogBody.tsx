import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './DialogBody.module.css';

type DialogBodyProps = {
  className?: string;
};

export const DialogBody: FC<PropsWithChildren<DialogBodyProps>> = ({
  children,
  className,
}) => {
  return (
    <main className={classNames(styles.container, className)}>{children}</main>
  );
};
