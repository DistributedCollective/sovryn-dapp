import { Environments } from '../../types/global';

const OVERRIDE_VAR = 'REACT_APP_RSK_RPC_OVERRIDE';

const loadRsk = (): typeof import('./rsk').RSK => {
  let rsk: typeof import('./rsk').RSK;
  jest.isolateModules(() => {
    rsk = require('./rsk').RSK;
  });
  return rsk!;
};

describe('constants/infrastructure/rsk.ts', () => {
  const originalOverride = process.env[OVERRIDE_VAR];

  afterEach(() => {
    if (originalOverride === undefined) {
      delete process.env[OVERRIDE_VAR];
    } else {
      process.env[OVERRIDE_VAR] = originalOverride;
    }
  });

  it('keeps the committed RPC values when no override is set', () => {
    delete process.env[OVERRIDE_VAR];

    const RSK = loadRsk();

    expect(RSK.rpc[Environments.Mainnet]).toEqual([
      'https://rsk-live.sovryn.app/rpc',
    ]);
    expect(RSK.publicRpc[Environments.Mainnet]).toBe(
      'https://mainnet.sovryn.app/rpc',
    );
    expect(RSK.rpc[Environments.Testnet]).toEqual([
      'https://testnet.sovryn.app/rpc',
    ]);
    expect(RSK.publicRpc[Environments.Testnet]).toBe(
      'https://testnet.sovryn.app/rpc',
    );
  });

  it('points both mainnet RPC entries at the override when one is set', () => {
    process.env[OVERRIDE_VAR] = 'http://127.0.0.1:8545';

    const RSK = loadRsk();

    expect(RSK.rpc[Environments.Mainnet]).toEqual(['http://127.0.0.1:8545']);
    expect(RSK.publicRpc[Environments.Mainnet]).toBe('http://127.0.0.1:8545');
  });

  it('leaves testnet RPC entries untouched when the override is set', () => {
    process.env[OVERRIDE_VAR] = 'http://127.0.0.1:8545';

    const RSK = loadRsk();

    expect(RSK.rpc[Environments.Testnet]).toEqual([
      'https://testnet.sovryn.app/rpc',
    ]);
    expect(RSK.publicRpc[Environments.Testnet]).toBe(
      'https://testnet.sovryn.app/rpc',
    );
  });

  it('accepts an https override', () => {
    process.env[OVERRIDE_VAR] = 'https://qa-node.example/rpc';

    const RSK = loadRsk();

    expect(RSK.rpc[Environments.Mainnet]).toEqual([
      'https://qa-node.example/rpc',
    ]);
    expect(RSK.publicRpc[Environments.Mainnet]).toBe(
      'https://qa-node.example/rpc',
    );
  });

  it('throws at module load naming the variable when the override is not an http(s) URL', () => {
    process.env[OVERRIDE_VAR] = 'not-a-url';

    expect(() => loadRsk()).toThrow(OVERRIDE_VAR);
  });
});
