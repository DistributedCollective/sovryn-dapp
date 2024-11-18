import classNames from 'classnames';

import { Breakpoint } from '../../types';
import { RowObject } from '../TableBase';
import styles from './Table.module.css';
import { TableProps } from './Table.types';
import { TableDesktop } from './components/TableDesktop/TableDesktop';
import { TableMobile } from './components/TableMobile/TableMobile';

// No React.FC, since doesn't support Generic PropTypes
export const Table = <RowType extends RowObject>(
  props: TableProps<RowType>,
) => {
  const breakpoint = props.breakpoint || Breakpoint.lg;
  return (
    <>
      <div className={classNames(styles[breakpoint], styles.desktop)}>
        <TableDesktop {...props} />
      </div>
      <div className={classNames(styles[breakpoint], styles.mobile)}>
        <TableMobile {...props} />
      </div>
    </>
  );
};
