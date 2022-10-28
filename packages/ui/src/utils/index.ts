import { DATA_ATTRIBUTE } from './constants';

export const noop = () => {};

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ... ${end}`;
};

export const applyDataAttr = (id: string | undefined) =>
  id
    ? {
        [DATA_ATTRIBUTE]: id,
      }
    : {};
