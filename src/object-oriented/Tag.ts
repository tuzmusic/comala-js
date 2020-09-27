import { lines } from '../../test/createTag.test';

export default class Tag {
  
  tagName: string
  parameters: Record<string, string>
  selfClosing: boolean
  textLines: string[] = []
  children: Tag[] = []
  
  constructor(tagName: string, parameters: Record<string, string> = {}, selfClosing: boolean = false) {
    this.tagName = tagName;
    this.parameters = parameters;
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
  
  addTextContent(...textLines: string[]) { this.textLines = textLines; }
  
  addParameter(param: Record<string, string>) { Object.assign(this.parameters, param); }
  
  addChild(child: Tag) { this.children.push(child); }
}