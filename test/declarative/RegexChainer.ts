/* eslint @typescript-eslint/no-use-before-define: 0 */

type NameableTags = 'stateNamed' | 'approvalNamed' | 'triggerNamed' | 'tagNamed'

type FlexibleArgs =
  | string
  | Record<string | NameableTags, string | boolean | number>;

type StringFunc = (args: FlexibleArgs) => RegexChainer;

type TagInfo = { [tagType: string]: { name: string } | null }

// TODO: Checking children and params needs to make sure the search ends at
// the right place. Otherwise all we're doing is checking if Y exists *anywhere*
// after X. e.g., a child of tag Z could test positive as a child of tag X.
// (where Z comes after X)

export default class RegexChainer {
  source: string;
  stored = {} as
    { type: 'tag'; content: TagInfo }
    | { type: 'param'; content: object }
    | { type: 'string'; content: string }
  
  // these aliases are defined at the end of the file
  // because referring to the functions, defined below, gives
  // a TS error, despite the es-lint setting at the top.
  toHaveParam: StringFunc;
  withParam: StringFunc;
  andParam: StringFunc;
  toHaveChild: StringFunc;
  andHaveChild: StringFunc;
  toInclude: StringFunc;
  andExpect: StringFunc;
  and: StringFunc;
  private isNot: boolean;
  
  constructor() {
    this.isNot = false;
    // this.toHaveParam =
    //   this.withParam =
    //     this.andParam =
    //       this.toHaveChild =  // todo: and check closing tag?
    //         this.andHaveChild =  // todo: and check closing tag?
    //           this.toInclude = this.toComeBefore;
    this.andExpect =
      this.and = this.expect;
  };
  
  get not() {
    this.isNot = true;
    return this;
  }
  
  expect = (args: FlexibleArgs) => {
    this.isNot = false;
    this.getRelevantString(args);
    return this;
  };
  
  inside = (s: string) => {
    // aliases
    this.stored = null;
    this.source = s;
    return this;
  };
  
  test = (str: string) => {
    const { isNot, source } = this;
    const regExp = new RegExp(str, 's');
    if (isNot) {
      expect(source).not.toMatch(regExp);
    } else {
      expect(source).toMatch(regExp);
    }
  };
  
  private getRelevantString(args: FlexibleArgs): void {
    // handle simple string argument
    if (typeof args === 'string') { // string
      this.stored = { type: 'string', content: prepareForRegex(args) };
      return;
    }
    
    // handle specific tags
    for (const typeOfTag of ['state', 'approval', 'trigger', 'tag']) {
      const key = typeOfTag + 'Named';
      // check if this is the key
      const value: string = (args as Record<string, string>)[key];
      if (value) {
        // tagNamed: 'xyz' is {xyz...
        // stateNamed: 'abc" is {state:abc
        const content = typeOfTag === 'tag'
          ? { [value]: { name: null } }
          : { [typeOfTag]: { name: value } };
        this.stored = { type: 'tag', content };
        return;
      }
    }
    
    // if we've come this far we have an object with unknown keys
    this.stored = { type: 'param', content: args };
    
    /*
    if (args.hasOwnProperty('tagNamed')) { // object with tagName property
      str = '{' + args.tagNamed + (args.unnamed ? `:${ args.unnamed }` : '');
    } else { // PARAMS: object without tagName property. treat as an object of params
      // todo: this currently only work for named parameters
      str = ('[:|]' + Object.keys(args)[0].toLowerCase() + '=' + Object.values(args)[0] + '[|}]');
    }*/
  }
  
  /*  toOccur = () => {
      this.test(RegexChainer.getRelevantString(this.stored));
      return this;
    };
    
    toComeBefore: StringFunc = args => {
      const { source, stored } = this;
      if (!source || !stored) throw new Error('Arguments missing.');
      
      const matchStr = `${ stored }.*${ RegexChainer.getRelevantString(args) }`;
      this.test(matchStr);
      
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
    */
}

const prepareForRegex = (str: string) => str.replace(/([|=])/g, '\\$1');


