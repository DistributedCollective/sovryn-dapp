import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { Icon } from '../../../../1_atoms';

type DialogHeaderProps = {
  title: React.ReactNode;
  className?: string;
  dataActionId?: string;
  onClose?: () => void;
  renderTitle?: (title: React.ReactNode) => React.ReactNode;
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  title,
  dataActionId,
  className,
  onClose,
  renderTitle = title => <DefaultTitle>{title}</DefaultTitle>,
}) => (
  <header
    className={classNames(
      'px-6 py-3.5 relative bg-gray-11 flex flex-row justify-between items-center space-x-4 sm:rounded-t',
      className,
    )}
  >
    {renderTitle(title)}
    {onClose && (
      <button onClick={onClose} data-action-id={dataActionId}>
        <Icon icon="x-mark" size={12} />
        <span className="sr-only">Close</span>
      </button>
    )}
  </header>
);

const DefaultTitle: FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-gray-10 font-bold text-sm">{children}</h2>
);
