import { StatusEnum } from './StatusItem.types';

export const getStatusIcon = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.success:
      return 'success-icon';
    case StatusEnum.error:
      return 'failed-tx';
    case StatusEnum.pending:
      return 'pending';
  }
};

export const getStatusClass = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.success:
      return 'text-success';
    case StatusEnum.error:
      return 'text-error';
    case StatusEnum.pending:
      return 'text-sov-white';
  }
};
