import { IconNames } from '../../1_atoms';
import styles from './StatusItem.module.css';
import { StatusType } from './StatusItem.types';

export const getStatusIcon = (status: StatusType) => {
  switch (status) {
    case StatusType.success:
      return IconNames.SUCCESS_ICON;
    case StatusType.error:
      return IconNames.FAILED_TX;
    case StatusType.pending:
      return IconNames.PENDING;
  }
};

export const getStatusClass = (status: StatusType) => {
  switch (status) {
    case StatusType.success:
      return styles.success;
    case StatusType.error:
      return styles.error;
    case StatusType.pending:
      return styles.pending;
  }
};
