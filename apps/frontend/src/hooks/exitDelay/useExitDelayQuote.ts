import { useMemo } from 'react';

import { RSK_CHAIN_ID } from '../../config/chains';

import { EXIT_DELAY_TTL, ExitDelayQuote } from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { useGetProtocolContract } from '../useGetContract';
import { NO_DELAY, quoteExitDelay } from './quoteExitDelay';

export type { ExitDelayQuote };

/**
 * How long the perimeter would hold a withdrawal this account makes now.
 *
 * Reads the controller through the protocol's own pointer, the same route the
 * consumer contracts take, so the quote cannot disagree with what the exit
 * will actually do. While the perimeter is undeployed or unwired the pointer
 * is absent, the quote is a stated zero, and every form renders exactly as it
 * does without the perimeter. A quote that could not be read is NOT that: it
 * comes back `unknown`, because the exit hook fails closed.
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

  const { value, loading } = useCacheCall(
    `exitDelay/quote/${surfaceId}/${subProduct}/${account}`,
    RSK_CHAIN_ID,
    async () => {
      if (!protocol || !subProduct || !account) {
        // Nothing to quote yet: no wallet, or the contracts are still loading.
        // There is no withdrawal to describe either, so this is not a read that
        // failed.
        return NO_DELAY;
      }
      return quoteExitDelay({
        chainId: RSK_CHAIN_ID,
        consumerAddress: protocol.address,
        account,
        surfaceId,
        subProduct,
      });
    },
    [protocol?.address, surfaceId, subProduct, account],
    NO_DELAY,
    { ttl: EXIT_DELAY_TTL },
  );

  return useMemo(
    () => ({
      delaySeconds: value.delaySeconds,
      unknown: value.unknown,
      loading,
    }),
    [value, loading],
  );
};
