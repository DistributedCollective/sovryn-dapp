import { useMemo } from 'react';

import { Contract, constants } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../config/chains';

import {
  EXIT_FEE_REFERENCE_GROSS,
  EXIT_FEE_TTL,
  ExitFeeQuote,
} from '../../utils/exitFee';
import { readPerimeterPointer } from '../exitDelay/readPerimeterPointer';
import {
  EXIT_DELAY_QUOTE_TIMEOUT_MS,
  useDeadlinePassed,
} from '../exitDelay/useExitDelay';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { useGetProtocolContract } from '../useGetContract';

export type ExitFeeRate = ExitFeeQuote;

/**
 * No quote obtained. The rows are hidden for this exactly as for a settled
 * "no fee" — the chain fails open, so nothing is charged either way — but the
 * hooks keep the distinction visible to their consumers.
 */
const UNKNOWN = { active: false, rateBps: 0, unknown: true };

/**
 * Stamp a fetched quote with the cache key it was fetched FOR.
 *
 * The shared cache keeps its previous state until the effect for a changed
 * key has run and its result has landed, so on the first render after an
 * account or pool switch `value` still belongs to the old key. A quote is
 * only displayed when its stamp matches the key being asked about; until
 * then the hook reports the hidden default.
 */
const stamped = async <T extends object>(
  forKey: string,
  fetch: () => Promise<T>,
) => ({ ...(await fetch()), forKey });
/**
 * A real answer of "nothing is charged": the protocol holds no controller
 * pointer, so the on-chain path charges nothing by construction. This is a
 * fact, not a failure, and must not be shown as unavailable.
 */
const UNCHARGED = { active: false, rateBps: 0, unknown: false };

const CONTROLLER_ABI = [
  'function quoteExitFee(bytes32 surfaceId, address subProduct, address actor, uint256 grossAmount) view returns (tuple(bool active, uint16 rateBps, uint256 feeAmount, uint256 netAmount, address feeReceiver, uint8 reason))',
];

export const useExitFeeRate = (
  surfaceId: string,
  subProduct: string | undefined,
): ExitFeeRate => {
  const { account } = useAccount();
  const protocol = useGetProtocolContract('protocol', RSK_CHAIN_ID);

  // The protocol contract loads asynchronously. Before it has, the fetcher
  // answers UNCHARGED — and the shared cache keeps that answer for the TTL.
  // If the key ignored readiness, the rerun triggered by the contract landing
  // would hit that same fresh entry and a genuinely charged fee would stay
  // hidden for up to 30 s after every page load. Keying on the address makes
  // the pre-load answer live under its own key, so the loaded one is fetched.
  const key = `exitFee/rate/${surfaceId}/${subProduct}/${account}/${protocol?.address}`;

  const { value, loading } = useCacheCall(
    key,
    RSK_CHAIN_ID,
    () =>
      stamped(key, async () => {
        if (!protocol || !subProduct || !account) {
          // Nothing to quote against yet. The spec's rule for every such case is
          // that the form looks exactly as it does without the perimeter.
          return UNCHARGED;
        }

        // The pointer is cached for a TTL under a key with no block
        // dimension, and a refetch only runs on the next observed block, so
        // at the moment the Owner pins the controller an open client can
        // report "no fee" for up to one TTL plus one block (about 60 s on
        // RSK) while the chain has already started charging. The window is
        // bounded and one-time, tied to a single Owner action.
        const pointer = await readPerimeterPointer(
          RSK_CHAIN_ID,
          protocol.address,
          'exitFeeController',
        );
        if (pointer.kind === 'unreadable') {
          // The node gave no answer. The rows stay hidden, but this is not a
          // stated "no fee": the chain may well be charging.
          return UNKNOWN;
        }
        if (
          pointer.kind === 'absent' ||
          pointer.address === constants.AddressZero
        ) {
          // No controller getter, or no controller pinned: the protocol
          // charges nothing by construction, a real answer of "no fee".
          return UNCHARGED;
        }
        const controllerAddress = pointer.address;

        try {
          const controller = new Contract(
            controllerAddress,
            CONTROLLER_ABI,
            getProvider(RSK_CHAIN_ID),
          );
          const [quote] = await controller.functions.quoteExitFee(
            surfaceId,
            subProduct,
            account,
            EXIT_FEE_REFERENCE_GROSS,
          );
          return {
            active: quote.active,
            rateBps: Number(quote.rateBps),
            unknown: false,
          };
        } catch (error) {
          // The pointer resolved, so the perimeter IS live and this call should
          // have worked. A revert, RPC failure or decode error here means we do
          // not know the rate -- and with a live perimeter that is not the same
          // as the rate being zero.
          return UNKNOWN;
        }
      }),
    [protocol?.address, surfaceId, subProduct, account],
    { ...UNKNOWN, forKey: '' },
    { ttl: EXIT_FEE_TTL },
  );

  // A rate that has not arrived within the same deadline the delay quote is
  // given is reported as unreadable, so a form waiting on it can let the user
  // sign with the warning rather than wait on a stalled read.
  const fresh = value.forKey === key;
  const passed = useDeadlinePassed(
    key,
    fresh && !loading,
    EXIT_DELAY_QUOTE_TIMEOUT_MS,
  );
  return useMemo(() => {
    // A value fetched for a different key is the previous account's or
    // pool's answer. Report it as still loading, which the display treats
    // as "nothing charged" — never as that other party's fee.
    if (!fresh && passed) {
      return { active: false, rateBps: 0, unknown: true, loading: false };
    }
    return {
      active: fresh ? value.active : false,
      rateBps: fresh ? value.rateBps : 0,
      unknown: fresh ? value.unknown : true,
      loading: loading || !fresh,
    };
  }, [value, loading, fresh, passed]);
};
