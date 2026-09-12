import en from './translations.json';

/**
 * The house terms for what the Sovryn Perimeter does to a withdrawal are
 * "withdrawal delay" and "Perimeter fee". "Held" stays only where it states
 * what happens to one particular withdrawal, and in the contract-owner notice,
 * whose wording is the owner's.
 */

const stringsOf = (node: unknown, path: string): [string, string][] =>
  typeof node === 'string'
    ? [[path, node]]
    : Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
        stringsOf(value, `${path}.${key}`),
      );

const perimeterCopy = [
  ...stringsOf(en.perimeterPage, 'perimeterPage'),
  ...stringsOf(en.exitDelay, 'exitDelay'),
  ...stringsOf(en.exitFee, 'exitFee'),
];

describe('Perimeter copy', () => {
  it('names the mechanism as the withdrawal delay, never as holding', () => {
    const statesOfOneWithdrawal = new Set([
      'perimeterPage.contractOwnerNotice',
      'exitDelay.tooltip',
      'exitDelay.unknown.tooltip',
    ]);

    expect(
      perimeterCopy.filter(
        ([path, text]) =>
          !statesOfOneWithdrawal.has(path) &&
          /\b(hold|holds|holding|held)\b/i.test(text),
      ),
    ).toEqual([]);
  });

  it('uses none of the retired names', () => {
    expect(
      perimeterCopy.filter(([, text]) =>
        /exit fee|sovryn secure|colfee/i.test(text),
      ),
    ).toEqual([]);
  });

  it('labels the fee as the Perimeter fee and the delay as the withdrawal delay', () => {
    expect(en.exitFee.label).toMatch(/^Perimeter fee\b/);
    expect(en.exitDelay.label).toBe('Withdrawal delay');
  });
});
