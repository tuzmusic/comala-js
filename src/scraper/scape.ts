import cheerio from 'cheerio';

interface ParameterDoc {
    paramName: string;
    description: string;
    defaultValue?: string;
    unnamed?: boolean;
}

const html = '<html/>';
const $ = cheerio.load(html);

const tables = $('table.confluenceTable');
const table = tables[0];
const firstHeading = $(table).find('th')[0].text();

if (firstHeading !== 'Parameter') {
    console.log('wrong table!');
}

const rows = $(table).find('tr');

const parameters = [];

for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const param: Partial<ParameterDoc> = {};
    if (i === 0) continue;

    const columns = $(row).find('td');

    ['paramName', '', 'defaultValue', 'description'].forEach((key, j) => {
        if (!key) return;

        const textContent = columns[j].text();

        // don't set any undefined values (defaultValue might be blank)
        if (!textContent) return;

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        param[key] = textContent;
    });

    if (param.paramName.startsWith('unnamed')) {
        param.unnamed = true;
        param.paramName = param.paramName.split(' ').pop();
    }

    parameters.push(param);
}