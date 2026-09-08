import { Environments } from '../../types/global';

const OVERRIDE_VAR = 'REACT_APP_RSK_RPC_OVERRIDE';
const env = process.env;

const loadRsk = (): typeof import('./rsk').RSK => {
  let rsk: typeof import('./rsk').RSK;
  jest.isolateModules(() => {
    rsk = require('./rsk').RSK;
  });
  return rsk!;
};

describe('constants/infrastructure/rsk.ts', () => {
  const originalOverride = process.env[OVERRIDE_VAR];
  const originalNodeEnv = process.env.NODE_ENV;

  /**
   * CRA inlines NODE_ENV at build time, so this is what distinguishes a QA
   * build from a release: `development` is `yarn dev`, everything else is a
   * bundle someone could ship.
   */
  const asBuild = (mode: string) => {
    // NODE_ENV is typed read-only; a test is the one place it is legitimately
    // rewritten, since CRA inlines it at build time everywhere else.
    (env as Record<string, string | undefined>).NODE_ENV = mode;
  };

  beforeEach(() => asBuild('development'));

  afterEach(() => {
    asBuild(originalNodeEnv);
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

  it.each(['production', 'test'])(
    'ignores the override in a %s build',
    mode => {
      // CRA inlines REACT_APP_* at build time. A release built in a shell that
      // still exported this would ship a bundle labelled mainnet reading a QA
      // fork, while the wallet signs against real mainnet.
      asBuild(mode);
      process.env[OVERRIDE_VAR] = 'http://127.0.0.1:8545';

      const RSK = loadRsk();

      expect(RSK.rpc[Environments.Mainnet]).toEqual([
        'https://rsk-live.sovryn.app/rpc',
      ]);
      expect(RSK.publicRpc[Environments.Mainnet]).toBe(
        'https://mainnet.sovryn.app/rpc',
      );
    },
  );

  it('does not even reject a malformed override outside development', () => {
    // Nothing reads it there, so refusing to load the app over it would brick
    // a release for a variable it is already ignoring.
    asBuild('production');
    process.env[OVERRIDE_VAR] = 'not-a-url';

    expect(() => loadRsk()).not.toThrow();
  });

  it('publishes the override in force, so the app can say so on screen', () => {
    process.env[OVERRIDE_VAR] = 'http://127.0.0.1:8545';

    let active: string | undefined;
    jest.isolateModules(() => {
      active = require('./rsk').RSK_RPC_OVERRIDE;
    });

    expect(active).toBe('http://127.0.0.1:8545');
  });

  it('publishes no override when none is in force', () => {
    delete process.env[OVERRIDE_VAR];

    let active: string | undefined = 'unset';
    jest.isolateModules(() => {
      active = require('./rsk').RSK_RPC_OVERRIDE;
    });

    expect(active).toBeUndefined();
  });
});
