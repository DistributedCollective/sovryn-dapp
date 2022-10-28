import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { Icon } from '../../../../1_atoms';
import { DATA_ATTRIBUTE } from '../../../../utils/constants';
import styles from './DialogHeader.module.css';

type DialogHeaderProps = {
  title: React.ReactNode;
  className?: string;
  dataLayoutId?: string;
  onClose?: () => void;
  renderTitle?: (title: React.ReactNode) => React.ReactNode;
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  title,
  dataLayoutId,
  className,
  onClose,
  renderTitle = title => <DefaultTitle>{title}</DefaultTitle>,
}) => (
  <header className={classNames(styles.container, className)}>
    {renderTitle(title)}
    {onClose && (
      <button onClick={onClose} {...{ [DATA_ATTRIBUTE]: dataLayoutId }}>
        <Icon icon="x-mark" size={12} />
        <span className="sr-only">Close</span>
      </button>
    )}
  </header>
);

const DefaultTitle: FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-gray-10 font-bold text-sm">{children}</h2>
);
