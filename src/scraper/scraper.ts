import cheerio from 'cheerio';
import fs from 'fs';

type ScrapeTarget = {
  className: string;
  url: string;
}
type ScrapedContent = {
  html: string;
  text: string;
}

type ScrapedObject = {
  parameterName: ScrapedContent;
  required: ScrapedContent;
  defaultValue: ScrapedContent;
  notes: ScrapedContent;
  version: ScrapedContent;
}

type DocObject = {
  name: string;
  type: string;
  required?: boolean;
  unnamed?: boolean;
}

function scrape(): ScrapedObject[] {
  const htmlUrl = '/Users/tuzmacbookpro2017/dev/MyProjects/comala-js/test/fixtures/state-macro.html';
  const content = fs.readFileSync(htmlUrl, { encoding: 'utf8', flag: 'r' });
  
  const $ = cheerio.load(content);
  // todo: make sure that it's the right table.
  const table = $('table.confluenceTable').first();
  const rows = $('tr', table);
  
  const parameters: ScrapedObject[] = [];
  const propNames = ['parameterName', 'required', 'defaultValue', 'notes', 'version'];
  
  for (let i = 0; i < rows.length; i++) {
    const cells = $('td', rows.get(i));
    if (cells.length !== propNames.length) continue;
    
    const param: Partial<ScrapedObject> = {};
    for (let j = 0; j < cells.length; j++) {
      const cell = cells.eq(j);
      const info = propNames[j];
      param[info as keyof ScrapedObject] = {
        html: cell.html(),
        text: cell.text()
      };
    }
    
    if (param.notes.text.startsWith('OBSOLETE')) continue;
    parameters.push(param as ScrapedObject);
  }
  
  return parameters;
}

function constructParam({ parameterName, defaultValue, notes, required, version }: ScrapedObject): string[] {
  const editedParam: DocObject = { type: 'string', name: parameterName.text };
  
  // handle unnamed parameters
  if (parameterName.text.startsWith('unnamed')) {
    editedParam.name = parameterName.text.split(' ').pop();
    editedParam.unnamed = true;
  }
  
  // rename body parameter
  else if (parameterName.text === 'macro body')
    editedParam.name = 'body';
  
  // is parameter required?
  if (required.html.includes('img'))
    editedParam.required = true;
  
  // variable type for parameter
  if (['true', 'false'].includes(defaultValue.text))
    editedParam.type = 'boolean';
  
  const doc = ['/**', ` * @type {${ editedParam.type }}`];
  
  if (editedParam.required)
    doc.push(' * This parameter is REQUIRED.');
  
  doc.push(' *', notes.html);
  
  // declaration
  doc.push(' */', `${ editedParam.name }: ${ editedParam.type };\n`,);
  
  return doc;
}

function createFile(macro: ScrapeTarget) {
  const fileLines = [
    'import Tag from \'./Tag\'',
    '',
    `class ${ macro.className } extends Tag {`,
  ];
  const allParameters = scrape();
  // console.log(allParameters)
  const textLines: string[] = allParameters.map(constructParam).flat();
  
  textLines.forEach(line => fileLines.push('\t' + line));
  
  fileLines.push('}');
  const str = fileLines.join('\n');
  // console.log(str);
  
  const path = `/Users/tuzmacbookpro2017/dev/MyProjects/comala-js/src/${ macro.className }.ts`;
  
  fs.writeFileSync(path, str);
  // console.log(fs.readFileSync(path, 'utf8'));
}

createFile({ className: 'State', url: 'https://wiki.comalatech.com/display/CDML/state+macro#' });