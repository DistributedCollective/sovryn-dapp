import { TroveOperation } from '../../../../../utils/graphql/zero/generated';

export const renderSign = (value: string, troveOperation?: TroveOperation) => {
  if (value === '0') {
    return '';
  }

  if (
    troveOperation === TroveOperation.LiquidateInNormalMode ||
    troveOperation === TroveOperation.LiquidateInRecoveryMode ||
    troveOperation === TroveOperation.CloseTrove
  ) {
    return '-';
  }

  return value.startsWith('-') ? '' : '+';
};
