import { useEffect, useState } from 'react';

import { constants } from 'ethers';

import { getZeroContract } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import { getRskChainId } from '../../utils/chain';
import { ExitDelayQuote } from '../../utils/exitDelay';
import { SURFACE_ZERO_WITHDRAW_COLL } from '../../utils/exitFee';
import { useAccount } from '../useAccount';
import { useIsMounted } from '../useIsMounted';
import { useExitDelay } from './useExitDelay';

export type ZeroExitDelayQuote = ExitDelayQuote;

type BorrowerOperations = { address?: string; unresolvable: boolean };

/**
 * How long the perimeter would hold a withdrawal from a Zero surface.
 *
 * Zero keeps its own controller and queue pointers on BorrowerOperations
 * rather than reading the lending protocol's, so this resolves through Zero —
 * the same route the exit itself takes. Until BorrowerOperations' address is
 * known the quote is loading; if it cannot be resolved at all the quote is
 * unreadable, because Zero's exit hook fails closed too.
 *
 * Zero has no passthrough: the borrower is the originator, the position owner
 * and the payout receiver, so all three identity arguments are this account.
 * `subProduct` is the zero address — there is a single Zero deployment.
 */
export const useZeroExitDelayQuote = (
  surfaceId: string = SURFACE_ZERO_WITHDRAW_COLL,
): ZeroExitDelayQuote => {
  const { account } = useAccount();
  const chainId = getRskChainId() as ChainId;
  const isMounted = useIsMounted();
  const [borrowerOperations, setBorrowerOperations] =
    useState<BorrowerOperations>({ unresolvable: false });

  useEffect(() => {
    getZeroContract('borrowerOperations', chainId)
      .then(({ address }) => {
        if (isMounted()) {
          setBorrowerOperations({ address, unresolvable: false });
        }
      })
      .catch(() => {
        if (isMounted()) {
          setBorrowerOperations({ unresolvable: true });
        }
      });
  }, [chainId, isMounted]);

  return useExitDelay({
    chainId,
    consumerAddress: borrowerOperations.address,
    consumerUnresolvable: borrowerOperations.unresolvable,
    surfaceId,
    subProduct: constants.AddressZero,
    account,
  });
};
