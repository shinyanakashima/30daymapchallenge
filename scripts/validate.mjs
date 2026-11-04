import {loadAll} from './data.mjs';
const {years}=loadAll(); console.log(`Validated ${years.length} year(s), ${years.reduce((s,y)=>s+y.days.length,0)} days.`);
