import { Contract, constants } from 'ethers';

import { ChainId, getProvider } from '@sovryn/ethers-provider';

import { asyncCall } from '../../store/rxjs/provider-cache';
import {
  EXIT_DELAY_TTL,
  ExitDelayQuote,
  RELEASE_READ_TIMEOUT_MS,
} from '../../utils/exitDelay';
import { boundedBy } from './rawCall';
import { readPerimeterPointer } from './readPerimeterPointer';

/** A quote before the caller's own loading state is attached to it. */
export type ResolvedExitDelay = Omit<ExitDelayQuote, 'loading'>;

/** The chain stated that nothing is held. */
export const NO_DELAY: ResolvedExitDelay = { delaySeconds: 0, unknown: false };

/**
 * The chain stated nothing. Reported as unknown rather than as zero: the exit
 * hook fails CLOSED, so a withdrawal whose delay cannot be quoted is escrowed
 * or reverts — the one thing it will not do is pay straight to the wallet.
 */
export const UNREADABLE: ResolvedExitDelay = {
  delaySeconds: 0,
  unknown: true,
};

const CONTROLLER_ABI = [
  'function quoteExitDelayFor(address rawOriginator, address owner, address receiver, bytes32 surfaceId, address subProduct) view returns (uint32 d, address effOrig, address effOwner)',
];

/**
 * How long the perimeter would hold a withdrawal from one surface, resolved
 * the same way the consumer contract resolves it at execution time.
 *
 * The controller is reached through the consumer's own pointer rather than a
 * configured address, so the quote cannot disagree with the exit it describes.
 * Three outcomes, kept distinct all the way to the screen: a hold, a stated
 * absence of one, and a read that did not complete.
 *
 * The consumer's queue getter is read FIRST. The controller resolves a delay
 * from a global default for every surface without a bypass tier, including
 * surfaces whose consumer has no delay leg, so its answer alone would announce
 * a hold the consumer cannot impose. Only a getter the node positively
 * reported as reverting means "no delay leg"; every read that did not complete
 * is unreadable, because the consumer reads its pointers from chain state that
 * the browser's RPC trouble does not touch.
 *
 * A consumer whose queue pointer is unset still asks the controller: at a
 * delay of zero it pays direct, and at a delay above zero it reverts the
 * withdrawal for want of a queue, which is not "paid now" either.
 */
export const quoteExitDelay = async ({
  chainId,
  consumerAddress,
  account,
  surfaceId,
  subProduct,
}: {
  chainId: ChainId;
  /** The consumer contract holding the perimeter pointers for this surface. */
  consumerAddress: string;
  account: string;
  surfaceId: string;
  subProduct: string;
}): Promise<ResolvedExitDelay> => {
  const queue = await readPerimeterPointer(
    chainId,
    consumerAddress,
    'exitDelayQueue',
  );
  if (queue.kind === 'unreadable') {
    return UNREADABLE;
  }
  if (queue.kind === 'absent') {
    return NO_DELAY;
  }

  const controller = await readPerimeterPointer(
    chainId,
    consumerAddress,
    'exitFeeController',
  );
  // The queue getter answered, so this consumer has a delay leg; a controller
  // read that did not produce an address is no statement that nothing is held.
  if (controller.kind !== 'address') {
    return UNREADABLE;
  }
  // No controller pinned is the one wired case where zero is the chain's own
  // answer: the consumer quotes no delay and pays direct.
  if (controller.address === constants.AddressZero) {
    return NO_DELAY;
  }

  let delaySeconds: number;
  try {
    // Keyed on the pointers it was read through as well as the question, so
    // a rotated controller or queue never answers from the old pair's entry.
    const quote = await asyncCall(
      [
        'exitDelay/quoteFor',
        chainId,
        controller.address.toLowerCase(),
        queue.address.toLowerCase(),
        surfaceId,
        subProduct.toLowerCase(),
        account.toLowerCase(),
      ].join('/'),
      () =>
        boundedBy(
          new Contract(
            controller.address,
            CONTROLLER_ABI,
            getProvider(chainId),
          ).quoteExitDelayFor(account, account, account, surfaceId, subProduct),
          RELEASE_READ_TIMEOUT_MS,
        ),
      { ttl: EXIT_DELAY_TTL },
    );
    delaySeconds = Number(quote.d);
  } catch (error) {
    // A pinned controller that could not be quoted: on chain the same failure
    // reverts the withdrawal, so there is no reading in which it pays out.
    return UNREADABLE;
  }

  if (delaySeconds === 0) {
    return NO_DELAY;
  }
  if (queue.address === constants.AddressZero) {
    return UNREADABLE;
  }
  return { delaySeconds, unknown: false };
};
