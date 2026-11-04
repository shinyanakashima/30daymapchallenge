import fs from 'node:fs';import {loadAll} from './data.mjs';import {stats,statuses} from '../src/model.mjs';
const {years}=loadAll();const check=process.argv.includes('--check');
for(const y of years){const n=stats(y);let out=`# 30DayMapChallenge ${y.year} 企画と進捗\n\n<!-- GENERATED from public/data/${y.year}/works.json. DO NOT EDIT. -->\n\n更新：${y.updatedAt}。公開日数 ${n.days}/30、公開作品 ${n.published}件、制作中 ${n.building}件。\n\n`;
for(const d of y.days){out+=`## Day ${d.day} ${d.theme}\n\n**テーマの意味**：${d.meaning}\n\n**企画・進捗**：${d.idea||'未検討'}\n\n`;for(const p of d.projects){out+=`- **${p.title}**（${statuses[p.status]}）：${p.description}`;if(p.appUrl)out+=` [作品を見る](${p.appUrl})`;if(p.repoUrl)out+=` [GitHub](${p.repoUrl})`;out+='\n';}if(d.projects.length)out+='\n';}
const filename=`docs/${y.year}-plan.md`;if(check){if(!fs.existsSync(filename)||fs.readFileSync(filename,'utf8')!==out)throw Error(`${filename}が古いです。npm run planを実行してください。`);}else{fs.mkdirSync('docs',{recursive:true});fs.writeFileSync(filename,out);}}
console.log(check?'Generated plans are current.':'Generated plans.');
