/* eslint @typescript-eslint/no-use-before-define: 0 */

type NameableTags = 'stateNamed' | 'approvalNamed' | 'triggerNamed' | 'tagNamed'
type FlexibleArgs =
  | string
  | Record<NameableTags, string>
  | Record<string, string | boolean | number>
type StringFunc = (args: FlexibleArgs) => RegexChainer;

const knownTags = ['state', 'approval', 'trigger'];
type TagInfo = { tagType: string; name: string }

type StoredType = { type: 'known-tag'; content: TagInfo }
  | { type: 'param'; content: object }
  | { type: 'unknown-tag-name'; content: string }
  | { type: 'string'; content: string };

type ParamExpecter = (param: Record<string, string>) => RegexChainer;
type ChildExpecter = (param: Record<string, string>) => RegexChainer;

export default class RegexChainer {
  source: string;
  stored = {} as StoredType
  
  // these aliases are defined at the end of the file
  // because referring to the functions, defined below, gives
  // a TS error, despite the es-lint setting at the top.
  toHaveParam: ParamExpecter
  
  toHaveChild: ChildExpecter;
  
  // todo: must be called after a tag. can use 'stored'?
  //  this isn't just an alias for toHaveParam is it???
  //  actually I think it's meant to always be called on a child!
  withParam: ParamExpecter;
  
  // todo: alias for withParam, right?
  andParam: ParamExpecter;
  
  // todo: this should be chained off something like:
  //  expect(stateNamed).toHaveParam(param).
  //  so it can just use the stored tag already?
  //  what about checking params on the child? that would
  //  need to put a new tag in "stored". Maybe this should
  //  always happen
  andHaveChild: ChildExpecter;
  
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
    const paramRegExStr = `[|:]${ key }=${ value }`;
  
    const tagRegExpStr = getRegexStringFor(stored);
    if (!tagRegExpStr)
      throw new Error('toHaveParam must be chained after calling expect with a tag.');
  
    // test for a string containing the tag opener (opening bracket, tag name, unnamed arg)
    // and the param, and ending with a closing bracket.
    // i.e., the param occurs inside the tag.
    this.test(`{${ tagRegExpStr }.*${ paramRegExStr }.*}`);
    return this;
  }
  
  toHaveChild = (args: FlexibleArgs) => {
    const parents = ['workflow', 'state', 'trigger'];
    const { stored } = this;
    
    const child = this.getRelevantInfo(args);
    
    if (child.type === 'string'
      // only parents can have children
      || stored.type === 'known-tag' && !parents.includes(stored.content.tagType)
      // parents cannot be children. unknown tags are assumed to be self-closing.
      || child.type === 'known-tag' && parents.includes(child.content.tagType))
      throw new Error('toHaveChild must be called with a self-closing tag, ' +
        'after calling expect with a parent tag.');
    
    const parentRegExp = getRegexStringFor(stored);
    const childRegExp = getRegexStringFor(child);
    
    this.test(
      // parent opener tag (name, and unnamed argument, with opening and closing braces)
      `{${ parentRegExp }.*}` +
      // child tag (name) with opening and closing braces
      `.+{${ childRegExp }.*}` +
      // parent closing tag (opening brace, tag name, closing brace)
      `.+{${ (stored.content as TagInfo).tagType }}`, true);
  }
  
  test = (str: string, includeLines: boolean = false) => {
    const { isNot, source } = this;
    const regExp = new RegExp(prepareForRegex(str), includeLines ? 's' : '');
    if (isNot) {
      expect(source).not.toMatch(regExp);
    } else {
      expect(source).toMatch(regExp);
    }
  };
  
  expect = (args: FlexibleArgs) => {
    this.isNot = false;
    this.stored = this.getRelevantInfo(args);
    return this;
  };
  
  inside = (s: string) => {
    // aliases
    this.stored = null;
    this.source = s;
    return this;
  };
  
  private getRelevantInfo(args: FlexibleArgs): StoredType {
    // handle simple string argument
    if (typeof args === 'string') { // string
      return { type: 'string', content: prepareForRegex(args) };
    }
    
    if (args.tagNamed) {
      return { type: 'unknown-tag-name', content: args.tagNamed as string };
    }
    
    // handle specific tags
    for (const tagType of knownTags) {
      const key = tagType + 'Named';
      // check if this is the key
      const name: string = (args as Record<string, string>)[key];
      if (name) {
        // tagNamed: 'xyz' is {xyz...
        // stateNamed: 'abc" is {state:abc
        return { type: 'known-tag', content: { tagType, name } };
      }
    }
    
    // if we've come this far we have an object with unknown keys
    return { type: 'param', content: args };
  }
  
  /*  toOccur = () => {
      this.test(RegexChainer.getRelevantInfo(this.stored));
      return this;
    };
    
    toComeBefore: StringFunc = args => {
      const { source, stored } = this;
      if (!source || !stored) throw new Error('Arguments missing.');
      
      const matchStr = `${ stored }.*${ RegexChainer.getRelevantInfo(args) }`;
      this.test(matchStr);
      
      return this;
    };
    
    toComeAfter: StringFunc = args => {
      const { stored } = this;
      if (!stored) throw new Error('Arguments missing.');
      const oldStored = stored;
      this.stored = RegexChainer.getRelevantInfo(args);
      this.toComeBefore(oldStored);
      
      return this;
    };
    */
}

function prepareForRegex(str: string) {
  return str.replace(/([|=])/g, '\\$1');
}

function getRegexStringFor(args: StoredType): string | null {
  if (args.type === 'unknown-tag-name') {
    return `${ args.content }`;
  } else if (args.type === 'known-tag') {
    const { tagType, name } = args.content;
    return `${ tagType }:${ name }`;
  }
  return null;
}
