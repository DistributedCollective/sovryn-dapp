import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { Icon } from '../../../../1_atoms';
import { applyDataAttr } from '../../../../utils';
import styles from './DialogHeader.module.css';

type DialogHeaderProps = {
  title: React.ReactNode;
  className?: string;
  dataAttribute?: string;
  onClose?: () => void;
  renderTitle?: (title: React.ReactNode) => React.ReactNode;
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  title,
  dataAttribute,
  className,
  onClose,
  renderTitle = title => <DefaultTitle>{title}</DefaultTitle>,
}) => (
  <header className={classNames(styles.container, className)}>
    {renderTitle(title)}
    {onClose && (
      <button onClick={onClose} {...applyDataAttr(dataAttribute)}>
        <Icon icon="x-mark" size={12} />
        <span className="sr-only">Close</span>
      </button>
    )}
  </header>
);

const DefaultTitle: FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-gray-10 font-bold text-sm">{children}</h2>
);
