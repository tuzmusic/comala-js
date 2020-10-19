// eslint-disable-next-line @typescript-eslint/no-use-before-define
type ParamType = { childTags?: Tag[] } & Record<string, ParamValueType>
type ParamValueType = string | string[] | number | boolean;

export function lines(strs: string[]): string {
  return strs.join('\n');
}

export default class Tag {

  tagName: string;
  parameters: Record<string, string>;
  selfClosing: boolean;
  textLines: string[] = [];
  children: Tag[] = [];

  constructor(tagName: string, parameters: ParamType = {}, selfClosing: boolean = false) {
    this.tagName = tagName;
    
    // Get text content from parameters.
    const { textContent, childTags } = parameters;
    if (textContent) {
      // if a single textContent argument, convert to array and store
      this.textLines = typeof textContent === 'string' ? [textContent as string] : textContent as string[];
      // get rid of the parameter since we're not using it as an actual workflow param
      delete parameters['textContent'];
    }
    
    // Get children from parameters
    if (childTags && childTags instanceof Array && childTags.every((t: any) => t instanceof Tag)) {
      this.children = childTags as Tag[];
      // get rid of the parameter since we're not using it as an actual workflow param
      delete parameters['childTags'];
    }
    
    // this explicit cast is the only way to tell Typescript that
    this.parameters = parameters as Record<string, string>;
    this.selfClosing = selfClosing;
  }
  
  get markup() {
    const { children, tagName, parameters, selfClosing, textLines } = this;
    
    function getOpeningTag(): string {
      let openingTag = '{' + tagName;
      
      // add parameters
      for (const key in parameters) {
        openingTag += (key == Object.keys(parameters)[0] ? ':' : '|');
        if (key !== '_') openingTag += key.toLowerCase() + '=';
        openingTag += [parameters[key]].join(',');
      }
      
      return openingTag + '}';
    }
    
    // Opening Tag, & Parameters
    const markupLines = [getOpeningTag()];
    
    // Text Content
    textLines.forEach(line => markupLines.push('\t' + line));
    
    // Child Tags
    children.forEach(child => {
      const childLines = child.markup.split('\n');
      childLines.forEach(childLine => {
        markupLines.push('\t' + childLine);
      });
    });
    
    // Closing tag
    if (!selfClosing) markupLines.push(`{${ tagName }}`);
    
    return lines(markupLines);
  }
  
  addTextContent = (...textLines: string[]) => { this.textLines = textLines; };
  
  addParameter = (param: Record<string, string>) => { Object.assign(this.parameters, param); };
  
  addChild = (child: Tag) => { this.children.push(child); };
}
