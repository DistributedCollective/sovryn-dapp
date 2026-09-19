import { BigNumber } from 'ethers/lib/ethers';
import 'jest-canvas-mock';

import { resolveGasLimit } from './utils';

/**
 * A withdrawal hooked into the Perimeter's withdrawal delay costs more gas
 * than the same call with the delay off (it enqueues into the delay queue
 * and updates the receiver index), so a flat constant sized for the
 * un-hooked call can undershoot once the delay is armed. `resolveGasLimit`
 * is what `TransactionSteps` (opening a dialog) and `TransactionStep`
 * ("Reset values") both call to turn a request's configured constant into
 * the gas limit actually used, re-pricing it against a fresh estimate of
 * the real call rather than trusting the constant outright.
 */

// The nested nanoid package under apps/frontend/node_modules ships ESM-only,
// which Jest's default CJS transform cannot parse; every other suite that
// reaches utils.ts (via nanoid's use in handleNotification) mocks it the
// same way rather than fighting the resolution.
jest.mock('nanoid', () => ({ nanoid: () => 'test-id' }));

const makeContract = (overrides: {
  estimate?: BigNumber;
  estimateError?: Error;
}) => {
  const estimateFn = jest.fn(async () => {
    if (overrides.estimateError) {
      throw overrides.estimateError;
    }
    return overrides.estimate;
  });

  return {
    estimateGas: { withdraw: estimateFn },
  } as any;
};

describe('resolveGasLimit', () => {
  const floor = BigNumber.from(450_000);

  it('raises the floor when a fresh estimate plus margin exceeds it', async () => {
    const contract = makeContract({ estimate: BigNumber.from(500_000) });

    const result = await resolveGasLimit(
      contract,
      'withdraw',
      [],
      undefined,
      floor,
    );

    // 500_000 * 1.30 = 650_000, above the 450_000 floor.
    expect(result).toBe('650000');
  });

  it('never goes below the floor when the estimate is cheap', async () => {
    const contract = makeContract({ estimate: BigNumber.from(100_000) });

    const result = await resolveGasLimit(
      contract,
      'withdraw',
      [],
      undefined,
      floor,
    );

    // 100_000 * 1.30 = 130_000, below the floor — the floor wins, matching
    // the delay-off case: the estimate is cheaper, so nothing changes.
    expect(result).toBe(floor.toString());
  });

  it('falls back to the floor outright when estimation fails', async () => {
    const contract = makeContract({
      estimateError: new Error('execution reverted'),
    });

    const result = await resolveGasLimit(
      contract,
      'withdraw',
      [],
      undefined,
      floor,
    );

    expect(result).toBe(floor.toString());
  });

  it('with no floor, returns the bare estimate unmargined (the pre-existing, unconfigured-limit case)', async () => {
    const contract = makeContract({ estimate: BigNumber.from(321_000) });

    const result = await resolveGasLimit(contract, 'withdraw', [], undefined);

    expect(result).toBe('321000');
  });

  it('with no floor, falls back to the flat 6,000,000 default when estimation fails', async () => {
    const contract = makeContract({
      estimateError: new Error('execution reverted'),
    });

    const result = await resolveGasLimit(contract, 'withdraw', [], undefined);

    expect(result).toBe('6000000');
  });
});
