/* eslint @typescript-eslint/no-use-before-define: 0 */

type FlexibleArgs =
  | string
  | Record<string, string | boolean | number>;

type StringFunc = (args: FlexibleArgs) => RegexChainer;

export default class RegexChainer {
  source: string;
  stored: string;

  // these aliases are defined at the end of the file
  // because referring to the functions, defined below, gives
  // a TS error, despite the es-lint setting at the top.
  toHaveParam: StringFunc;
  withParam: StringFunc;
  andParam: StringFunc;
  toHaveChild: StringFunc;
  toInclude: StringFunc;
  andExpect: StringFunc;
  and: StringFunc;
  private isNot: boolean;

  constructor() {
    this.isNot = false;
    this.toHaveParam =
      this.withParam =
        this.andParam =
          this.toHaveChild =  // todo: and check closing tag?
            this.toInclude = this.toComeBefore;
    this.andExpect =
      this.and = this.expect;
  };

  get not() {
    this.isNot = true;
    return this;
  }

  private get reset() {
    this.stored = this.source = null;
    this.isNot = false;
    return this;
  }

  private static getRelevantString(args: FlexibleArgs): string {
    let str;
    if (typeof args === 'string') { // string
      str = args as string;
    } else {
      ['state', 'approval', 'task'].forEach(name => {
        const key = name + 'Named';
        const value = (args as { [key: string]: string })[key];
        if (value) args = { tagNamed: name, unnamed: value };
      });

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
    // aliases
    this.stored = null;
    this.source = s;
    return this;
  };

  expect = (args: FlexibleArgs) => {
    this.isNot = false;
    this.stored = RegexChainer.getRelevantString(args);
    return this;
  };

  toOccur = () => expect(this.source.match(this.stored) === null).toBe(this.isNot);

  toComeBefore: StringFunc = args => {
    const { source, stored } = this;
    if (!source || !stored) throw new Error('Arguments missing.');

    const matchStr = `${ stored }.*${ RegexChainer.getRelevantString(args) }`;
    console.log(matchStr);
    const regExp = new RegExp(matchStr, 's');
    expect(source.match(regExp) === null).toBe(this.isNot);

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


