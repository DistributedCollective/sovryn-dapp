import { Environments } from '../../types/global';

it.each(['development', 'production', 'test'])(
  'uses reviewed public Rootstock endpoints despite a leftover QA export in %s',
  mode => {
    const oldMode = process.env.NODE_ENV;
    const oldOverride = process.env.REACT_APP_RSK_RPC_OVERRIDE;
    try {
      (process.env as Record<string, string | undefined>).NODE_ENV = mode;
      process.env.REACT_APP_RSK_RPC_OVERRIDE = 'http://127.0.0.1:19474';
      jest.isolateModules(() => {
        const { RSK } = require('./rsk');
        expect(RSK.rpc[Environments.Mainnet]).toEqual([
          'https://rsk-live.sovryn.app/rpc',
        ]);
        expect(RSK.publicRpc[Environments.Mainnet]).toBe(
          'https://mainnet.sovryn.app/rpc',
        );
        expect(RSK.rpc[Environments.Testnet]).toEqual([
          'https://testnet.sovryn.app/rpc',
        ]);
      });
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = oldMode;
      if (oldOverride === undefined)
        delete process.env.REACT_APP_RSK_RPC_OVERRIDE;
      else process.env.REACT_APP_RSK_RPC_OVERRIDE = oldOverride;
    }
  },
);
