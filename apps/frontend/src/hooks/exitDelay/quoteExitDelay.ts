import { Contract, constants } from 'ethers';

import { ChainId, getProvider } from '@sovryn/ethers-provider';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { EXIT_DELAY_TTL, ExitDelayQuote } from '../../utils/exitDelay';

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

const QUEUE_GETTER_ABI = ['function exitDelayQueue() view returns (address)'];

const CONTROLLER_GETTER_ABI = [
  'function exitFeeController() view returns (address)',
];

const CONTROLLER_ABI = [
  'function quoteExitDelayFor(address rawOriginator, address owner, address receiver, bytes32 surfaceId, address subProduct) view returns (uint32 d, address effOrig, address effOwner)',
];

/**
 * A reverted call answers the question; an unreachable node does not.
 *
 * `exitDelayQueue()` and `exitFeeController()` revert on a consumer that
 * predates the perimeter, and that revert IS the answer "this surface holds
 * nothing" — the same consumer has no delay leg to escrow with. A network,
 * timeout or server failure carries no such information and must not be read
 * as an absent pointer.
 */
export const isCallRevert = (error: unknown): boolean =>
  (error as { code?: string })?.code === 'CALL_EXCEPTION';

/**
 * How long the perimeter would hold a withdrawal from one surface, resolved
 * the same way the consumer contract resolves it at execution time.
 *
 * The controller is reached through the consumer's own pointer rather than a
 * configured address, so the quote cannot disagree with the exit it describes.
 * Three outcomes, kept distinct all the way to the screen: a hold, a stated
 * absence of one, and a read that did not complete.
 *
 * The consumer's queue pointer is checked FIRST, and a surface without one is
 * quoted as no hold whatever the controller says. The controller resolves a
 * delay from a global default for every surface that has no bypass tier, so it
 * answers for surfaces whose consumer has no queue leg to escrow with — and a
 * single `setGlobalDelaySeconds` would otherwise announce a hold on every
 * surface at once, including ones that pay straight to the wallet. The
 * announcement must not get ahead of the enforcement.
 */
export const quoteExitDelay = async ({
  chainId,
  consumerAddress,
  queueKey,
  controllerKey,
  account,
  surfaceId,
  subProduct,
}: {
  chainId: ChainId;
  /** The consumer contract holding the perimeter pointers for this surface. */
  consumerAddress: string;
  /**
   * Cache key for the queue-pointer read. Shared with the vault page, which
   * follows the same pointer to list what is held.
   */
  queueKey: string;
  /**
   * Cache key for the controller-pointer read. The fee hooks read the same
   * pointer off the same consumer, so passing their key makes the two share
   * one round trip rather than each issuing its own.
   */
  controllerKey: string;
  account: string;
  surfaceId: string;
  subProduct: string;
}): Promise<ResolvedExitDelay> => {
  const provider = getProvider(chainId);

  let queueAddress: string;
  try {
    const queuePointer = new Contract(
      consumerAddress,
      QUEUE_GETTER_ABI,
      provider,
    );
    queueAddress = await asyncCall(
      queueKey,
      () => queuePointer.exitDelayQueue(),
      { ttl: EXIT_DELAY_TTL },
    );
  } catch (error) {
    return isCallRevert(error) ? NO_DELAY : UNREADABLE;
  }

  // No queue on this consumer means no leg that can escrow: whatever the
  // controller would quote, this withdrawal is paid to the wallet at signing.
  if (!queueAddress || queueAddress === constants.AddressZero) {
    return NO_DELAY;
  }

  let controllerAddress: string;
  try {
    const pointer = new Contract(
      consumerAddress,
      CONTROLLER_GETTER_ABI,
      provider,
    );
    controllerAddress = await asyncCall(
      controllerKey,
      () => pointer.exitFeeController(),
      { ttl: EXIT_DELAY_TTL },
    );
  } catch (error) {
    return isCallRevert(error) ? NO_DELAY : UNREADABLE;
  }

  // No controller pinned is the one case where zero is the chain's own answer:
  // `safeQuoteDelay` returns (0, …) for it and the withdrawal pays direct.
  if (!controllerAddress || controllerAddress === constants.AddressZero) {
    return NO_DELAY;
  }

  try {
    const controller = new Contract(
      controllerAddress,
      CONTROLLER_ABI,
      provider,
    );
    const quote = await controller.quoteExitDelayFor(
      account,
      account,
      account,
      surfaceId,
      subProduct,
    );
    return { delaySeconds: Number(quote.d), unknown: false };
  } catch (error) {
    // A controller IS pinned and it could not be quoted. On chain that same
    // failure reverts the withdrawal, so there is no reading of this in which
    // the user is paid straight out.
    return UNREADABLE;
  }
};
