import { GatewayQuoteParams, GatewaySDK } from '@gobob/bob-sdk';
import { useAccount } from '@gobob/sats-wagmi';
import {
  Optional,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

type SendGatewayTransactionParams = {
  toToken: string;
  evmAddress: string;
  value: bigint;
  strategyAddress?: string;
};

type UseSendGatewayTransactionProps = Omit<
  { gatewaySDK?: GatewaySDK } & Omit<
    Optional<
      GatewayQuoteParams,
      | 'fromUserAddress'
      | 'toUserAddress'
      | 'amount'
      | 'toToken'
      | 'fromChain'
      | 'fromToken'
    >,
    'toChain'
  > & { toChain: 'bob' | 'bob-sepolia' } & UseMutationOptions<
      string | undefined,
      Error,
      SendGatewayTransactionParams,
      unknown
    >,
  'mutationKey' | 'mutationFn'
>;

const useSendGatewayTransaction = ({
  gatewaySDK,
  toChain = 'bob',
  ...props
}: UseSendGatewayTransactionProps) => {
  const {
    address: btcAddress,
    publicKey: btcPublicKey,
    connector,
  } = useAccount();

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['sats-send-gateway-transaction', btcAddress],
    mutationFn: async ({
      toToken,
      evmAddress,
      value,
      strategyAddress,
    }: SendGatewayTransactionParams) => {
      if (!connector || !btcAddress) {
        return undefined;
      }

      const gatewayClient = gatewaySDK || new GatewaySDK(toChain);

      const params = {
        ...props,
        fromChain: props.fromChain || 'bitcoin',
        fromToken: props.fromToken || 'BTC',
        toChain,
        toToken,
        gasRefill: 0,
        fromUserAddress: btcAddress,
        fromUserPublicKey: btcPublicKey,
        toUserAddress: evmAddress,
        amount: Number(value),
      };
      const quote = await gatewayClient.getQuote(params);

      if (strategyAddress) {
        quote.strategyAddress = strategyAddress;
      }

      const { uuid, psbtBase64 } = await gatewayClient.startOrder(
        quote,
        params,
      );

      if (!psbtBase64) {
        throw new Error('No psbt');
      }

      const bitcoinTxHex = await connector.signAllInputs(psbtBase64);

      return await gatewayClient.finalizeOrder(uuid, bitcoinTxHex);
    },
    ...props,
  });

  return {
    ...result,
    sendGatewayTransaction: mutate,
    sendGatewayTransactionAsync: mutateAsync,
  };
};

export { useSendGatewayTransaction };
