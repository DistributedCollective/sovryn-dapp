import { ChainIds } from '@sovryn/ethers-provider';

import { ESTIMATOR_URI } from '../../constants/infrastructure';
import { FAKE_SIMULATOR_TX_DATA } from './helpers';
import { SimulatorResponse, TxTuple } from './types';

const prepareBody = (networkId: ChainIds, tx: TxTuple) =>
  JSON.stringify({
    network_id: String(networkId),
    tx,
  });

export const simulateTx = async (
  networkId: ChainIds,
  tx: TxTuple,
  signal?: AbortSignal,
): Promise<SimulatorResponse> => {
  if (!ESTIMATOR_URI) {
    const fakeResponse: SimulatorResponse =
      tx.length === 2
        ? [FAKE_SIMULATOR_TX_DATA, FAKE_SIMULATOR_TX_DATA]
        : [FAKE_SIMULATOR_TX_DATA];
    return Promise.resolve(fakeResponse);
  }

  return fetch(ESTIMATOR_URI, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: prepareBody(networkId, tx),
    signal,
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed');
  });
};
