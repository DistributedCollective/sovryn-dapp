export class Percent<
  T extends {
    infinite?: T | undefined;
    absoluteValue?: A | undefined;
    mul?(hundred: 100): T;
    toString(precision?: number): string;
  },
  A extends {
    gte(n: string): boolean;
  },
> {
  private _percent: T;

  public constructor(ratio: T) {
    this._percent = ratio.infinite || (ratio.mul && ratio.mul(100)) || ratio;
  }

  nonZeroish(precision: number): this | undefined {
    const zeroish = `0.${'0'.repeat(precision)}5`;

    if (this._percent.absoluteValue?.gte(zeroish)) {
      return this;
    }
  }

  toString(precision: number): string {
    return (
      this._percent.toString(precision) +
      (this._percent.absoluteValue && !this._percent.infinite ? '%' : '')
    );
  }

  prettify(): string {
    if (this._percent.absoluteValue?.gte('1000')) {
      return this.toString(0);
    } else if (this._percent.absoluteValue?.gte('10')) {
      return this.toString(1);
    } else {
      return this.toString(2);
    }
  }
}
