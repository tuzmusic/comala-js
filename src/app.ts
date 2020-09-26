console.log('Hello app');

interface TagOptions {
  closing?: boolean;
}

const defaultOptions: TagOptions = {
  closing: true
};

export function createTag(
  name: string,
  parameters: Record<string, string | boolean> = {}, // TODO: catalog parameters in a type
  body: string | null = null,
  options: TagOptions = defaultOptions
): string {
  
  function getOpeningTag() {
    let openingTag = '{' + name;
    
    for (const key in parameters) {
      if (parameters.hasOwnProperty(key)) { // really shouldn't be necessary but typescript complains
        openingTag += (key == Object.keys(parameters)[0] ? ':' : '|');
        if (key !== 'unnamed') openingTag += `${ key }=`;
        openingTag += `${ parameters[key] }`;
      }
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
