import cheerio from 'cheerio';
import fs from 'fs';
import request from 'request';

//region Types
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
//endregion

// Async version of request function
function asyncRequest(url: string): Promise<{ response: any; html: string }> {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error) reject(error);
      resolve({ response, html });
    });
  });
}

async function scrape(url: string): Promise<ScrapedObject[]> {
  // if (!url) {
  //   const htmlUrl = '/Users/tuzmacbookpro2017/dev/MyProjects/comala-js/test/fixtures/state-macro.html';
  //   const content = fs.readFileSync(htmlUrl, { encoding: 'utf8', flag: 'r' });
  // }
  const { html } = await asyncRequest(url);
  
  const $ = cheerio.load(html);
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
  
  // TODO: use cheerio to actually modify the html how we want it
  // we might even use this to convert to JSDoc markup instead of
  // html
  // notes
  doc.push(
    ' * ' +
    notes.html
      .replace(/\n+/g, '')// replace newlines
      .replace(/  +/g, ' ') // reduce spaces
  );
  
  // declaration
  doc.push(' */', `${ editedParam.name }: ${ editedParam.type };\n`,);
  
  return doc;
}

async function createFile(macro: ScrapeTarget) {
  const fileLines = [
    'import Tag from \'./Tag\'',
    '',
    `class ${ macro.className } extends Tag {`,
  ];
  const allParameters = scrape(macro.url);
  // console.log(allParameters)
  const textLines: string[] = (await allParameters).map(constructParam).flat();
  
  textLines.forEach(line => fileLines.push('\t' + line));
  
  fileLines.push('}');
  const str = fileLines.join('\n');
  // console.log(str);
  
  const path = `/Users/tuzmacbookpro2017/dev/MyProjects/comala-js/src/${ macro.className }.ts`;
  
  fs.writeFileSync(path, str);
  console.log(fs.readFileSync(path, 'utf8'));
}

const macros: ScrapeTarget[] = [
  { className: 'State', url: 'https://wiki.comalatech.com/display/CDML/state+macro#' }
];

async function getAllMacros() {
  const { html } = await asyncRequest('https://wiki.comalatech.com/display/CDML/Macros');
  const $ = cheerio.load(html);
  const headings = $('h2', '.contentLayout2');
  
  const macroLists: {
    name: string;
    macros: ScrapeTarget[];
  }[] = [];
  
  const baseUrl = 'https://wiki.comalatech';
  
  headings.each(i => {
    const heading = headings.eq(i);
    if (heading.text() === 'Other') return
    
    const macroListObject = { name: heading.text(), macros: [] as ScrapeTarget[] };
    
    // find the list
    let ul;
    let current = heading.next();
    
    while (!ul) {
      const tagName: string = current.prop('tagName');
      if (tagName.toLowerCase() === 'ul')
        ul = current;
      else
        current = current.next()
    }
    
    // scrape the list
    const macrosUnderHeading = $('a', ul);
    macrosUnderHeading.each(j => {
      const link = macrosUnderHeading.eq(j);
      macroListObject.macros.push({
        className: link.text().replace(' macro', ''), url: baseUrl + link.attr('href')
      });
    });
    
    // add the list of macros to our list of... lists!
    macroLists.push(macroListObject);
  });
  console.log(macroLists);
}

getAllMacros();

// createFile({ className: 'State', url: 'https://wiki.comalatech.com/display/CDML/state+macro#' });