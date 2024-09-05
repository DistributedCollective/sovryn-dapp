export function getPriceFromId(binId: number, binStep: number): number {
  return (1 + binStep / 10_000) ** (binId - 8388608);
}

export function getIdFromPrice(price: number, binStep: number): number {
  return Math.trunc(Math.log(price) / Math.log(1 + binStep / 10_000)) + 8388608;
}
