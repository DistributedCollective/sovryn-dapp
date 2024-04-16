import RuneBridgeClient from './RuneBridgeClient';

export const runeBridgeApiClient = new RuneBridgeClient(
  process.env.REACT_APP_RUNE_BRIDGE_API_BASE_URL ??
    'http://127.0.0.1:8181/api/v1',
);
