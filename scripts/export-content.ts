import * as fs from 'fs';
import * as path from 'path';
import { CONTENT } from '../src/app/data/content.data';

const contentExport = {
  generated: new Date().toISOString(),
  pages: CONTENT,
};

const outPath = path.resolve(__dirname, '../src/assets/api/content.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(contentExport, null, 2));
console.log(`Content exported to ${outPath}`);
