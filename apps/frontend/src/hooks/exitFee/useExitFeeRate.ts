import { useMemo } from 'react';

import { Contract, constants } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../config/chains';

import { asyncCall } from '../../store/rxjs/provider-cache';
import {
  EXIT_FEE_REFERENCE_GROSS,
  EXIT_FEE_TTL,
  ExitFeeQuote,
} from '../../utils/exitFee';
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

const CONTROLLER_GETTER_ABI = [
  'function exitFeeController() view returns (address)',
];

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

        const getter = new Contract(
          protocol.address,
          CONTROLLER_GETTER_ABI,
          getProvider(RSK_CHAIN_ID),
        );

        let controllerAddress;
        try {
          // Negative-cached too: while undeployed this reverts and we cache the
          // uncharged answer.
          //
          // Known and accepted: the pointer is cached for EXIT_FEE_TTL under a
          // key with no block dimension, so at the moment governance pins the
          // controller the app can report "no fee" for up to that long while the
          // chain has started charging. The window is bounded, it exists once,
          // and the release order already covers it -- the dapp ships before
          // charging is enabled, never after. Closing it properly means block-
          // based invalidation in the shared cache, which is a wider change than
          // this window justifies.
          controllerAddress = await asyncCall(
            `exitFee/controllerAddress/${RSK_CHAIN_ID}/${protocol.address}`,
            () => getter.exitFeeController(),
            { ttl: EXIT_FEE_TTL },
          );
        } catch (error) {
          // The getter itself is missing or reverts, which is what a protocol
          // without the perimeter looks like. Nothing is charged there, and the
          // spec requires the forms to look exactly as they do today -- so this
          // is a real answer of "no fee", not a failure to obtain one. It is
          // also the state of mainnet until the activation SIPs execute.
          return UNCHARGED;
        }

        if (!controllerAddress || controllerAddress === constants.AddressZero) {
          // Perimeter deployed but not yet pinned: charges nothing by
          // construction.
          return UNCHARGED;
        }

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

  return useMemo(() => {
    // A value fetched for a different key is the previous account's or
    // pool's answer. Report it as still loading, which the display treats
    // as "nothing charged" — never as that other party's fee.
    const fresh = value.forKey === key;
    return {
      active: fresh ? value.active : false,
      rateBps: fresh ? value.rateBps : 0,
      unknown: fresh ? value.unknown : true,
      loading: loading || !fresh,
    };
  }, [value, loading, key]);
};
