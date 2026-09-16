import en from './translations.json';

/**
 * The house terms for what the Sovryn Perimeter does to a withdrawal are
 * "withdrawal delay" and "Perimeter fee". "Held" stays only where it states
 * what happens to one particular withdrawal — the delay's own tooltips, and
 * the contract-owner notice, which says the product holds that withdrawal.
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
        /exit fee|sovryn secure|colfee|keeper|delivered automatically/i.test(
          text,
        ),
      ),
    ).toEqual([]);
  });

  it('would catch a keeper script or a promise of automatic delivery', () => {
    // A guard is only worth having if it actually bites: run the same check
    // against a corpus that carries the retired wording, and require it to
    // come back non-empty rather than trusting the regex by inspection.
    const retiredNames =
      /exit fee|sovryn secure|colfee|keeper|delivered automatically/i;
    const synthetic: [string, string][] = [
      ['synthetic.keeper', 'A keeper delivers this automatically.'],
      ['synthetic.automatic', 'Nothing is delivered automatically here.'],
    ];

    expect(synthetic.filter(([, text]) => retiredNames.test(text))).toEqual(
      synthetic,
    );
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

  it('never names governance as a role', () => {
    expect(
      perimeterCopy.filter(([, text]) => /governance/i.test(text)),
    ).toEqual([]);
  });

  it('would catch "governance" used to name a role', () => {
    const synthetic: [string, string][] = [
      ['synthetic.governance', 'Resolved by governance.'],
    ];

    expect(synthetic.filter(([, text]) => /governance/i.test(text))).toEqual(
      synthetic,
    );
  });

  it('never names a block state anywhere in the Perimeter page copy, except admitting one could not be checked', () => {
    const exempt = 'perimeterPage.releaseRefused.unreadable';

    expect(
      stringsOf(en.perimeterPage, 'perimeterPage').filter(
        ([path, text]) =>
          path !== exempt && /\b(frozen|blacklisted)\b/i.test(text),
      ),
    ).toEqual([]);
  });

  it('would catch a block state named outside the one string that admits it could not check', () => {
    const exempt = 'perimeterPage.releaseRefused.unreadable';
    const synthetic: [string, string][] = [
      ['synthetic.statusTooltip', 'This party is frozen.'],
    ];

    expect(
      synthetic.filter(
        ([path, text]) =>
          path !== exempt && /\b(frozen|blacklisted)\b/i.test(text),
      ),
    ).toEqual(synthetic);
  });
});
