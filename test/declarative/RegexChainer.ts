type FlexibleArgs =
  | string
  | Record<'tagNamed' | 'unnamed' | 'stateNamed' | string, string>;

// eslint-disable-next-line @typescript-eslint/no-use-before-define
type StringFunc = (args: FlexibleArgs) => RegexChainer;

export default class RegexChainer {
  source: string;
  stored: string;

  private static getRelevantString(args: FlexibleArgs): string {

    let str;
    if (typeof args === 'string') { // string
      str = args as string;
    } else {
      if (args.hasOwnProperty('stateNamed')) {
        args = { tagNamed: 'state', unnamed: args.stateNamed };
      }
      if (args.hasOwnProperty('tagNamed')) { // object with tagName property
        str = '{' + args.tagNamed + (args.unnamed ? `:${ args.unnamed }` : '');
      } else { // object without tagName property. treat as an object of params
        // todo: this currently only work for named parameters
        str = ('[:|]' + Object.keys(args)[0].toLowerCase() + '=' + Object.values(args)[0]);
      }
    }
    return str.replace(/([|=])/g, '\\$1');
  }

  inside = (s: string) => {
    this.stored = null;
    this.source = s;
    return this;
  };

  expect = (args: FlexibleArgs) => {
    this.stored = RegexChainer.getRelevantString(args);
    return this;
  };

  toOccur = () => expect(this.source).toMatch(this.stored);

  toComeBefore: StringFunc = args => {
    const { source, stored } = this;
    if (!source || !stored) throw new Error('Arguments missing.');

    const matchStr = `${ stored }.*${ RegexChainer.getRelevantString(args) }`;
    console.log(matchStr);
    const regExp = new RegExp(matchStr, 's');
    expect(source).toMatch(regExp);

    return this;
  };

  toComeAfter: StringFunc = args => {
    const { stored } = this;
    if (!stored) throw new Error('Arguments missing.');
    const oldStored = stored;
    this.stored = RegexChainer.getRelevantString(args);
    this.toComeBefore(oldStored);

    return this;
  };
}
