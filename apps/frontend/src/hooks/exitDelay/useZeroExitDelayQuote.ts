import { useMemo } from 'react';

import { constants } from 'ethers';

import { getZeroContract } from '@sovryn/contracts';

import { getRskChainId } from '../../utils/chain';
import { EXIT_DELAY_TTL, ExitDelayQuote } from '../../utils/exitDelay';
import { SURFACE_ZERO_WITHDRAW_COLL } from '../../utils/exitFee';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { NO_DELAY, UNREADABLE, quoteExitDelay } from './quoteExitDelay';

export type ZeroExitDelayQuote = ExitDelayQuote;

/**
 * How long the perimeter would hold collateral leaving a line of credit.
 *
 * Zero keeps its own controller pointer on BorrowerOperations rather than
 * reading the lending protocol's, so this resolves through Zero — the same
 * route the collateral exit itself takes. An unwired perimeter quotes a stated
 * zero and the form is untouched; a quote that could not be read comes back
 * `unknown` instead, because Zero's exit hook fails closed too.
 *
 * Zero has no passthrough on this surface: the borrower is the originator, the
 * position owner and the payout receiver, so all three identity arguments are
 * this account. `subProduct` is the zero address — there is a single Zero
 * deployment, not a family of sub-products.
 */
export const useZeroExitDelayQuote = (): ZeroExitDelayQuote => {
  const { account } = useAccount();

  const { value, loading } = useCacheCall(
    `exitDelay/zero/${account}`,
    getRskChainId(),
    async () => {
      if (!account) {
        return NO_DELAY;
      }
      const chainId = getRskChainId();
      let address: string;
      try {
        ({ address } = await getZeroContract('borrowerOperations', chainId));
      } catch (error) {
        // Without BorrowerOperations there is no pointer to follow, and no
        // basis for claiming the withdrawal is paid straight out.
        return UNREADABLE;
      }
      return quoteExitDelay({
        chainId,
        consumerAddress: address,
        account,
        surfaceId: SURFACE_ZERO_WITHDRAW_COLL,
        subProduct: constants.AddressZero,
      });
    },
    [account],
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
