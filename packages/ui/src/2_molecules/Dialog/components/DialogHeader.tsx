import { FC, PropsWithChildren } from 'react';

import { Icon } from '../../../1_atoms';
import styles from './DialogHeader.module.css';

type DialogHeaderProps = {
  title: React.ReactNode;
  dataActionId?: string;
  onClose?: () => void;
  renderTitle?: (title: React.ReactNode) => React.ReactNode;
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  title,
  dataActionId,
  onClose,
  renderTitle = title => <DefaultTitle>{title}</DefaultTitle>,
}) => {
  return (
    <header className={styles.container}>
      {renderTitle(title)}
      {onClose && (
        <button onClick={onClose} data-action-id={dataActionId}>
          <Icon icon="x-mark" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </header>
  );
};

export const DefaultTitle: FC<PropsWithChildren> = ({ children }) => (
  <h2 className={styles.title}>{children}</h2>
);
