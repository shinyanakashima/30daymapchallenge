import fs from 'node:fs';
import path from 'node:path';
export const root = process.cwd();
export const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
export {validateYear} from '../src/validation.mjs';
import {validateYear} from '../src/validation.mjs';
export function loadAll(){const site=read('public/data/site.json'),index=read('public/data/years.json');if(!site.title||!site.author?.name||!site.en?.tagline||!site.en?.description)throw Error('site.json不正');if(!Array.isArray(index.years)||new Set(index.years).size!==index.years.length||!index.years.includes(index.defaultYear)||!index.years.every(y=>Number.isInteger(y)&&y>=2019&&y<=9999))throw Error('years.json不正');const years=index.years.map(y=>read(`public/data/${y}/works.json`));for(let i=0;i<years.length;i++){for(const d of years[i].days){if(!d.en?.meaning||!d.en?.idea)throw Error(`English translation missing: Day ${d.day}`);for(const p of d.projects)if(!p.en?.title||!p.en?.description||!Array.isArray(p.en.tags))throw Error(`English translation missing: ${p.id}`);}const errors=validateYear(years[i],index.years[i]);if(errors.length)throw Error(errors.join('\n'));for(const day of years[i].days)for(const p of day.projects)if(p.thumbnail&&!fs.existsSync(path.join(root,'public',p.thumbnail)))throw Error(`画像なし:${p.thumbnail}`);}return {site,index,years};}
