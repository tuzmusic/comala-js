/* eslint @typescript-eslint/no-use-before-define: 0 */

type NameableTags = 'stateNamed' | 'approvalNamed' | 'triggerNamed' | 'tagNamed'
type FlexibleArgs =
  | string
  | Record<NameableTags, string>
  | Record<string, string | boolean | number>
type StringFunc = (args: FlexibleArgs) => RegexChainer;

const knownTags = ['state', 'approval', 'trigger'];
type KnownTagType = typeof knownTags[number];
type TagInfo = Record<KnownTagType, { name: string }>
//{ [tagType: typeof knownTags[number]]: { name: string } }

// TODO: Checking children and params needs to make sure the search ends at
// the right place. Otherwise all we're doing is checking if Y exists *anywhere*
// after X. e.g., a child of tag Z could test positive as a child of tag X.
// (where Z comes after X)

export default class RegexChainer {
  source: string;
  stored = {} as
    { type: 'known-tag'; content: TagInfo }
    | { type: 'param'; content: object }
    | { type: 'unknown-tag-name'; content: string }
    | { type: 'string'; content: string }
  
  // these aliases are defined at the end of the file
  // because referring to the functions, defined below, gives
  // a TS error, despite the es-lint setting at the top.
  // toHaveParam: StringFunc;
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
  
  toHaveParam = (param: Record<string, string>) => {
    const { stored } = this;
    const [key, value] = Object.entries(param)[0];
    const paramRegExStr = new RegExp(
      prepareForRegex(`[|:${ key }]=${ value }`)
    );
    
    let tagRegExpStr: string;
    
    if (stored.type === 'unknown-tag-name') {
      tagRegExpStr = `${ stored.content }`;
    } else if (stored.type === 'known-tag') {
      const [tagName, { name }] = Object.entries(stored.content)[0];
      tagRegExpStr = `${ tagName }:${ name }`;
    }
    // test for a string containing the tag opener (opening bracket, tag name, unnamed arg)
    // and the param, and ending with a closing bracket.
    // i.e., the param occurs inside the tag.
    test(`{${ tagRegExpStr }.+${ paramRegExStr }.*}`);
  }
  
  test = (str: string) => {
    const { isNot, source } = this;
    const regExp = new RegExp(prepareForRegex(str), 's');
    if (isNot) {
      expect(source).not.toMatch(regExp);
    } else {
      expect(source).toMatch(regExp);
    }
  };
  
  expect = (args: FlexibleArgs) => {
    this.isNot = false;
    this.storeRelevantInfo(args);
    return this;
  };
  
  inside = (s: string) => {
    // aliases
    this.stored = null;
    this.source = s;
    return this;
  };
  
  private storeRelevantInfo(args: FlexibleArgs): void {
    // handle simple string argument
    if (typeof args === 'string') { // string
      this.stored = { type: 'string', content: prepareForRegex(args) };
      return;
    }
    
    if (args.tagNamed) {
      this.stored = { type: 'unknown-tag-name', content: args.tagNamed as string };
      return;
    }
    
    // handle specific tags
    for (const typeOfTag of knownTags) {
      const key = typeOfTag + 'Named';
      // check if this is the key
      const value: string = (args as Record<string, string>)[key];
      if (value) {
        // tagNamed: 'xyz' is {xyz...
        // stateNamed: 'abc" is {state:abc
        this.stored = {
          type: 'known-tag',
          content: {
            [typeOfTag]: { name: value }
          }
        };
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
      this.test(RegexChainer.storeRelevantInfo(this.stored));
      return this;
    };
    
    toComeBefore: StringFunc = args => {
      const { source, stored } = this;
      if (!source || !stored) throw new Error('Arguments missing.');
      
      const matchStr = `${ stored }.*${ RegexChainer.storeRelevantInfo(args) }`;
      this.test(matchStr);
      
      return this;
    };
    
    toComeAfter: StringFunc = args => {
      const { stored } = this;
      if (!stored) throw new Error('Arguments missing.');
      const oldStored = stored;
      this.stored = RegexChainer.storeRelevantInfo(args);
      this.toComeBefore(oldStored);
      
      return this;
    };
    */
}

const prepareForRegex = (str: string) => str.replace(/([|=])/g, '\\$1');


