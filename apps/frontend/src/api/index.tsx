import runeBridgeClient from './runeBridgeClient';

const runeBridgeApiClient = new runeBridgeClient(
  process.env.REACT_APP_RUNE_BRIDGE_API_BASE_URL ??
    'http://127.0.0.1:8181/api/v1',
);

export { runeBridgeApiClient };
