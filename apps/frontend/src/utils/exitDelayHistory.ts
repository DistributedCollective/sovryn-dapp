/**
 * Which of an account's delayed withdrawals this browser has seen, by queue
 * and id. The queue lists only withdrawals still waiting, so once one is
 * released it drops out of every read; these ids and queue addresses are what
 * let the page read a released withdrawal back from the chain as history.
 * Kept in the browser, for this chain and account.
 */

export type RememberedExit = { queueAddress: string; id: string };

const storageKey = (chainId: string, account: string) =>
  `perimeter/history/${chainId}/${account.toLowerCase()}`;

const sameExit = (a: RememberedExit, b: RememberedExit) =>
  a.queueAddress.toLowerCase() === b.queueAddress.toLowerCase() &&
  a.id === b.id;

export const rememberedExits = (
  chainId: string,
  account: string,
): RememberedExit[] => {
  try {
    const raw = window.localStorage.getItem(storageKey(chainId, account));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is RememberedExit =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof entry.queueAddress === 'string' &&
        typeof entry.id === 'string',
    );
  } catch (error) {
    return [];
  }
};

export const rememberExits = (
  chainId: string,
  account: string,
  exits: RememberedExit[],
): void => {
  if (exits.length === 0) {
    return;
  }
  try {
    const known = rememberedExits(chainId, account);
    const added = exits.filter(exit => !known.some(k => sameExit(k, exit)));
    if (added.length === 0) {
      return;
    }
    window.localStorage.setItem(
      storageKey(chainId, account),
      JSON.stringify([
        ...known,
        ...added.map(({ queueAddress, id }) => ({ queueAddress, id })),
      ]),
    );
  } catch (error) {
    // Nothing to do: history is a convenience, never a statement about funds.
  }
};
