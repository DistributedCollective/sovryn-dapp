import { RSK_CHAIN_ID } from '../../config/chains';

import { ExitDelayQuote } from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { useGetProtocolContract } from '../useGetContract';
import { useExitDelay } from './useExitDelay';

export type { ExitDelayQuote };

/**
 * How long the perimeter would hold a withdrawal this account makes now from a
 * lending surface.
 *
 * Reads the controller through the lending protocol's own pointers, the same
 * route the consumer contracts take, so the quote cannot disagree with what
 * the exit will actually do. While the protocol contract or the product is
 * still loading, the quote is loading too — never a stated zero.
 *
 * The three identity arguments are all this account: on the surfaces a user
 * reaches from the app the originator, the position owner and the payout
 * receiver are the same person. Passthrough surfaces resolve differently
 * on-chain, and quoting them from here would be a guess.
 */
export const useExitDelayQuote = (
  surfaceId: string,
  subProduct: string | undefined,
): ExitDelayQuote => {
  const { account } = useAccount();
  const protocol = useGetProtocolContract('protocol', RSK_CHAIN_ID);

  return useExitDelay({
    chainId: RSK_CHAIN_ID,
    consumerAddress: protocol?.address,
    surfaceId,
    subProduct,
    account,
  });
};
