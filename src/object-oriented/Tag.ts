export default class Tag {
  constructor(tagName: string, parameters: object = {}, selfClosing: boolean = false) {}
  
  get markup() { return ''}
  
  addTextContent(...text: string[]) {}
  
  addParameter(param: object) {}
  
  addChild(child: Tag) {}
}