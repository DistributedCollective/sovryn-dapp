export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
};
