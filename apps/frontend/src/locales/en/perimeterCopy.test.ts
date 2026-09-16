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

  it('names the Owner role only in the status the recovery lever sets, naming the position owner everywhere else', () => {
    const statusCopy = stringsOf(
      en.perimeterPage.status,
      'perimeterPage.status',
    );
    const namesOwnerRole = /(?<!position )\bowner\b/i;
    const ownerRoleStatus = 'perimeterPage.status.resolvedByOwner';

    expect(
      statusCopy.filter(
        ([path, text]) => path !== ownerRoleStatus && namesOwnerRole.test(text),
      ),
    ).toEqual([]);
  });

  it('would catch the Owner role being named on a status other than the recovery lever’s', () => {
    const namesOwnerRole = /(?<!position )\bowner\b/i;
    const ownerRoleStatus = 'perimeterPage.status.resolvedByOwner';
    const synthetic: [string, string][] = [
      ['perimeterPage.status.notExecutor', 'Releasable by the owner.'],
    ];

    expect(
      synthetic.filter(
        ([path, text]) => path !== ownerRoleStatus && namesOwnerRole.test(text),
      ),
    ).toEqual(synthetic);
  });

  it('never names a block state in a release refusal, except admitting one could not be checked', () => {
    const releaseRefusedCopy = stringsOf(
      en.perimeterPage.releaseRefused,
      'perimeterPage.releaseRefused',
    );

    expect(
      releaseRefusedCopy.filter(
        ([path, text]) =>
          path !== 'perimeterPage.releaseRefused.unreadable' &&
          /\b(frozen|blacklisted)\b/i.test(text),
      ),
    ).toEqual([]);
  });
});
