export function validateYear(data, year) {
 const errors=[]; if(data.year!==year)errors.push('年度不一致');
 if(!Array.isArray(data.days)||data.days.length!==30)return ['30日分のデータが必要'];
 const seen=new Set(),ids=new Set();
 for(const d of data.days){if(!Number.isInteger(d.day)||d.day<1||d.day>30||seen.has(d.day))errors.push('Dayの重複・範囲不正');seen.add(d.day);
 if(d.date!==`${year}-11-${String(d.day).padStart(2,'0')}`)errors.push(`Day${d.day}:日付不一致`);
 if(!d.theme||!d.meaning||typeof d.idea!=='string'||!Array.isArray(d.projects)){errors.push(`Day${d.day}:項目不足`);continue;}
 for(const p of d.projects){if(!p.id||ids.has(p.id))errors.push('作品IDの重複・欠落');ids.add(p.id);
 if(!p.title||!p.description||!Array.isArray(p.tags))errors.push(`${p.id}:表示情報不足`);
 if(!['planned','building','published'].includes(p.status))errors.push(`${p.id}:状態不正`);
 if(p.status==='published'&&!p.appUrl&&!p.articleUrl&&!p.videoUrl)errors.push(`${p.id}:公開URLが必要`);
 for(const key of ['appUrl','repoUrl','articleUrl','videoUrl'])if(p[key]){try{const u=new URL(p[key]);if(u.protocol!=='https:')errors.push(`${p.id}:HTTPS URLが必要`);}catch{errors.push(`${p.id}:URL不正`);}}
 if(p.thumbnail){if(p.thumbnail.startsWith('/')||p.thumbnail.includes('..')||!p.thumbnail.startsWith(`images/${year}/`))errors.push(`${p.id}:画像パス不正`);if(!p.thumbnailAlt)errors.push(`${p.id}:画像altが必要`);}
 }}
 return errors;
}
