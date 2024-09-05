import { Decimal } from '@sovryn/utils';

export function formatUsdAmount(value: Decimal): {
  value: string;
  suffix: string;
} {
  if (value.gte(1e6)) {
    return { value: value.div(1e6).toString(1), suffix: 'M' };
  } else if (value.gte(1e3)) {
    return { value: value.div(1e3).toString(1), suffix: 'K' };
  } else {
    return { value: value.toString(), suffix: '' };
  }
}
