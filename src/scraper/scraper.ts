import cheerio from 'cheerio';
import fs from 'fs';

type ScrapedObject = {
  parameterName: string;
  required: string;
  default: string;
  notes: string;
  version: string;
}

function scrape() {
  const htmlUrl = '/Users/tuzmacbookpro2017/dev/MyProjects/comala-js/test/fixtures/state-macro.html';
  const content = fs.readFileSync(htmlUrl, { encoding: 'utf8', flag: 'r' });
  
  const $ = cheerio.load(content);
  // todo: make sure that it's the right table.
  const table = $('table.confluenceTable').first();
  const rows = $('tr', table);
  
  const parameters = [];
  const propNames = ['parameterName', 'required', 'default', 'notes', 'version'];
  
  for (let i = 0; i < rows.length; i++) {
    const cells = $('td', rows.get(i));
    if (cells.length !== propNames.length) continue;
    
    const param: Partial<ScrapedObject> = {};
    for (let j = 0; j < cells.length; j++) {
      param[propNames[j] as keyof ScrapedObject] = cells.eq(j).text();
    }
    
    if (param.notes.startsWith('OBSOLETE')) continue;
    parameters.push(param);
  }
}

scrape();