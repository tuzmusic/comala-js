console.log('Hello app');

const defaultOptions = {
  closing: true
};

type TagOptions = typeof defaultOptions

export default function createTag(
  name: string,
  parameters: Record<string,
    string | boolean |
    Array<string | boolean>> = {}, // TODO: catalog parameters in a type
  body?: string,
  options: TagOptions = defaultOptions
): string {
  
  function getOpeningTag(): string {
    let openingTag = '{' + name;
  
    // add parameters
    for (const key in parameters) {
      openingTag += (key == Object.keys(parameters)[0] ? ':' : '|');
    
      if (key !== 'unnamed')
        openingTag += key + '=';
    
      const value = parameters[key];
    
      openingTag += [value].join(',');
    }
  
    return openingTag + '}';
  }
  
  const lines = [];
  lines.push(getOpeningTag());
  
  if (body) lines.push('\t' + body);
  
  if (options.closing) lines.push(`{${ name }}`);
  
  const fullTag = lines.join('\n');
  
  return fullTag;
}
