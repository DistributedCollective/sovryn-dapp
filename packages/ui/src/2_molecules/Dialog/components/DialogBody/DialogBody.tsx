import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

type DialogBodyProps = {
  className?: string;
};

export const DialogBody: FC<PropsWithChildren<DialogBodyProps>> = ({
  children,
  className,
}) => <main className={classNames('p-6 text-xs', className)}>{children}</main>;
