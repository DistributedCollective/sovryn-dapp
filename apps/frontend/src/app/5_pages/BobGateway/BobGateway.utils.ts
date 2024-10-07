import { GatewaySDK } from '@gobob/bob-sdk';
import { QueryClient } from '@tanstack/react-query';

export const bobGateway = new GatewaySDK('bob-sepolia');

export const queryClient = new QueryClient();
