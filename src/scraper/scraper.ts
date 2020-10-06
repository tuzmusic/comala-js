import cheerio from 'cheerio';
import fs from 'fs';
import request from 'request';
import shell from 'shelljs';
// @ts-ignore
import camelCase from 'lodash.camelcase';
import * as path from 'path';

const macrosDir = path.join(__dirname, '../../../src/Macros');

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

type MacroObject = {
  name: string;
  macros: ScrapeTarget[];
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
  const { html } = await asyncRequest(url);

  const $ = cheerio.load(html);

  // todo: make sure that it's the right table.
  const table = $('table.confluenceTable').first();
  const rows = $('tr', table);

  const parameters: ScrapedObject[] = [];
  const propNames = ['parameterName', 'required', 'defaultValue', 'notes', 'version'];

  // go through all the rows in the table
  for (let i = 0; i < rows.length; i++) {
    const cells = $('td', rows.get(i));
    if (cells.length !== propNames.length) continue;

    // go through all the cells (columns) in the row
    const param: Partial<ScrapedObject> = {};
    for (let j = 0; j < cells.length; j++) {
      const cell = cells.eq(j);
      const info = propNames[j];
      param[info as keyof ScrapedObject] = {
        html: cell.html(),
        text: cell.text(),
      };
    }

    if (param.notes.text.startsWith('OBSOLETE')) continue;
    parameters.push(param as ScrapedObject);
  }

  return parameters;
}

function fixNotes(html: string) {
  const $ = cheerio.load(html, { normalizeWhitespace: true });
  // remove icon tags. doesn't seem to completely work, but it's a start.
  // $('.icon').remove();

  // this is way too aggressive hahaha
  /*const allDivs = $('div');
  allDivs.each(i => {
    const thisDiv = allDivs.eq(i);
    thisDiv.replaceWith(thisDiv.html());
  });*/

  const outerDiv = $('div');
  // strip any outer div
  if (outerDiv.length) {
    html = outerDiv.html();

    // if there's a div within that, remove it
    const innerDiv = $('div', outerDiv);
    if (innerDiv.length)
      innerDiv.remove();
  }

  return html;
}

function constructParam({ parameterName, defaultValue, notes, required }: ScrapedObject): string[] {
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

  const fixedNotes = fixNotes(notes.html);

  // TODO: use cheerio to actually modify the html how we want it
  // we might even use this to convert to JSDoc markup instead of
  // html
  // notes
  doc.push(
    ' * ' +
    fixedNotes
      .replace(/\n+/g, '') // replace newlines
      .replace(/  +/g, ' '), // reduce spaces
  );

  // declaration
  doc.push(' */', `${ editedParam.name }: ${ editedParam.type };`, '');

  return doc;
}

async function createFile(path: string, { className, url }: ScrapeTarget) {
  // header (import statement)
  const fileLines: string[] = [];

  const interfaceName = `${ className }Params`;
  //region PARAMETER INTERFACE
  fileLines.push(`interface ${ interfaceName } {`);

  const allParameters = await scrape(url);
  const textLines = allParameters.map(constructParam).flat();

  textLines.forEach(line => fileLines.push('\t' + line.replace(/[†‡]/g, '')));
  fileLines.pop(); // remove final extra line at end of interface definition
  fileLines.push('}\n');
  //endregion PARAMETER INTERFACE

  //region CLASS
  fileLines.push(`export default class ${ className } {`);
  const classLines = [
    `parameters: ${ interfaceName }\n`,
    `constructor(firstParam: string, params: ${ interfaceName }) { // todo: argument name for unnamed parameter`,
    '\tthis.parameters = params;',
    '\t// todo: deal with unnamed parameter',
    '}',
  ];
  classLines.forEach(line => fileLines.push('\t' + line));
  fileLines.push('}');
  //endregion CLASS

  console.log('Creating file:', path);
  const str = fileLines.join('\n');
  fs.writeFileSync(path, str);
  // console.log(fs.readFileSync(path, 'utf8'));
}

async function getAllMacros() {
  const { html } = await asyncRequest('https://wiki.comalatech.com/display/CDML/Macros');
  const $ = cheerio.load(html);
  const headings = $('h2', '.contentLayout2');

  const macroLists: MacroObject[] = [];

  const baseUrl = 'https://wiki.comalatech.com';

  headings.each(i => {
    const heading = headings.eq(i);
    if (heading.text() === 'Other') return;

    const macroListObject = { name: heading.text(), macros: [] as ScrapeTarget[] };

    // find the list
    let ul;
    let current = heading.next();

    while (!ul) {
      const tagName: string = current.prop('tagName');
      if (tagName.toLowerCase() === 'ul')
        ul = current;
      else
        current = current.next();
    }
    // scrape the list
    const macrosUnderHeading = $('a', ul);
    macrosUnderHeading.each(j => {
      const link = macrosUnderHeading.eq(j);
      const className = link.text().replace(' macro', '');
      macroListObject.macros.push({
        className:
          className[0].toUpperCase() +
          camelCase(className).substring(1),
        url: baseUrl + link.attr('href'),
      });
    });

    // add the list of macros to our list of... lists!
    macroLists.push(macroListObject);
  });
  return macroLists;
  // console.log(macroLists);
}

getAllMacros().then(async macroLists => {
  for (const { name, macros } of macroLists) {
    const dirPath = path.join(macrosDir, name);
    shell.mkdir('-p', dirPath);
    macros.forEach(macro =>
      createFile(path.join(dirPath, `${ macro.className }.ts`), macro),
    );
  }
});
// createFile({ className: 'State', url: 'https://wiki.comalatech.com/display/CDML/state+macro#' });
