export function createTag(name: string): string {
  let result = '';
  const tag = `{${ name }}`;
  result = [tag, tag].join('\n');
  
  return result;
}
