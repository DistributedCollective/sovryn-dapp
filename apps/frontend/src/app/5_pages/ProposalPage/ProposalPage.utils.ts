import { BLOCK_TIME_IN_SECONDS } from '../BitocracyPage/BitocracyPage.constants';

// export function dateByBlocks(
//   startTime: number,
//   startBlock: number,
//   endBlock: number,
// ) {
//   return printDate(
//     (Number(startTime) + getSecondsBetweenBlocks(startBlock, endBlock)) * 1000,
//   );
// }

export function getSecondsBetweenBlocks(
  startBlock: number,
  endBlock: number,
): number {
  return (Number(endBlock) - Number(startBlock)) * BLOCK_TIME_IN_SECONDS;
}
