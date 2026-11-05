import {createContext, useContext, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import type {Site, Years, YearData, Day, Project, Language} from './types';
import {stats, visibleDays, resolveYear} from './model.mjs';
import {validateYear} from './validation.mjs';
import {preferredLanguage, localizeSite, localizeYear, languageUrl} from './language.mjs';
import messages from './ui.json';
import './style.css';

const LocaleContext = createContext({lang:'en' as Language, ui:messages.en});
const useLocale = () => useContext(LocaleContext);
function initialLanguage():Language { try { return preferredLanguage(location.search,localStorage.getItem('map-journal-language')); } catch { return preferredLanguage(location.search,null); } }
const BASE = import.meta.env.BASE_URL;
const asset = (p:string) => `${BASE}${p.replace(/^\//,'')}`;
const pad = (n:number) => String(n).padStart(2,'0');

function External({href,children,className=''}:{href:string;children:React.ReactNode;className?:string}) {
  const {ui}=useLocale();
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only">{ui.newTab}</span></a>;
}

function Work({project}:{project:Project}) {
  const {ui}=useLocale();
  const [broken,setBroken]=useState(false);
  const primary=project.appUrl || project.videoUrl || project.articleUrl;
  const label=project.appUrl?ui.view:project.videoUrl?ui.watch:ui.read;
  return <article className={`work ${project.status}`}>
    <div className="work-visual">
      {project.thumbnail && !broken
        ? <img src={asset(project.thumbnail)} alt={project.thumbnailAlt || `${ui.image}${project.title}`} loading="lazy" width="800" height="600" onError={()=>setBroken(true)}/>
        : <div className="work-blank" aria-hidden="true">{ui[project.status]}</div>}
      {primary&&<External href={primary} className="visual-link"><span className="sr-only">{ui.open}{project.title}</span></External>}
    </div>
    <div className="work-body">
      <span className={`status ${project.status}`}>{ui[project.status]}</span>
      <h4>{project.title}</h4>
      <p>{project.description}</p>
      {project.tags.length>0&&<ul className="tags">{project.tags.map(t=><li key={t}>{t}</li>)}</ul>}
      {(primary||project.repoUrl)&&<div className="work-links">
        {primary&&<External href={primary} className="primary-link">{label} ↗</External>}
        {project.repoUrl&&<External href={project.repoUrl} className="code-link">GitHub ↗</External>}
      </div>}
    </div>
  </article>;
}

function DayRow({day}:{day:Day}) {
  const {ui}=useLocale();
  const state=day.projects.some(p=>p.status==='published')?'published':day.projects.some(p=>p.status==='building')?'building':'planned';
  return <section className={`day ${state}`} id={`day-${day.day}`} aria-labelledby={`day-${day.day}-title`}>
    <div className="day-head">
      <span className="day-number" aria-hidden="true">{pad(day.day)}</span>
      <div className="day-theme">
        <h3 id={`day-${day.day}-title`}><span className="sr-only">Day {day.day} </span>{day.theme}</h3>
      </div>
      {!day.projects.length&&<span className="status planned">{ui.planned}</span>}
    </div>
    {day.projects.length>0&&<div className="works">{day.projects.map(p=><Work key={p.id} project={p}/>)}</div>}
  </section>;
}

function validateIndex(site:Site, years:Years){if(!site.title || !site.author?.name || !Array.isArray(years.years) || !years.years.every(y=>Number.isInteger(y)) || !years.years.includes(years.defaultYear))throw Error('config');}
async function json<T>(url:string):Promise<T>{const r=await fetch(url,{cache:'no-cache'});if(!r.ok)throw Error(`HTTP ${r.status}`);try{return await r.json()}catch{throw Error('invalidJson')}}

function App(){
  const [lang,setLang]=useState<Language>(initialLanguage);const ui=messages[lang];
  const [rawSite,setSite]=useState<Site|null>(null),[years,setYears]=useState<Years|null>(null),[rawData,setData]=useState<YearData|null>(null),[error,setError]=useState(''),[notFound,setNotFound]=useState(false),[retry,setRetry]=useState(0),[filter,setFilter]=useState('all'),[selectedView,setView]=useState<'gallery'|'plan'>('gallery');
  useEffect(()=>{document.documentElement.lang=lang;try{localStorage.setItem('map-journal-language',lang)}catch{}},[lang]);
  useEffect(()=>{const onPop=()=>setLang(initialLanguage());window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[]);
  const switchLanguage=(next:Language)=>{setLang(next);history.replaceState(null,'',languageUrl(location.href,next));};
  const site:Site|null=rawSite?localizeSite(rawSite,lang):null;const data:YearData|null=rawData?localizeYear(rawData,lang):null;
  useEffect(()=>{let live=true;(async()=>{setError('');setNotFound(false);setData(null);try{const [s,y]=await Promise.all([json<Site>(asset('data/site.json')),json<Years>(asset('data/years.json'))]);validateIndex(s,y);if(!live)return;setSite(s);setYears(y);const route=resolveYear(location.pathname,BASE,y.years,y.defaultYear);if(!route.year){setNotFound(true);return;}if(route.redirect)history.replaceState(null,'',`${BASE}${route.year}/${location.search}${location.hash}`);const d=await json<YearData>(asset(`data/${route.year}/works.json`));if(validateYear(d,route.year).length)throw Error('invalidYear');if(live){setData(d);document.title=`${d.year} — ${s.title} / ${s.author.name}`;}}catch(e){if(live)setError(e instanceof Error?e.message:'読み込みに失敗しました。')}})();return()=>{live=false}},[retry]);

  if(error)return <main className="message"><p className="label">DATA UNAVAILABLE</p><h1>{ui.loadError}</h1><p role="alert">{error in ui ? ui[error as keyof typeof ui] : error.startsWith('HTTP ') ? `${ui.fetchError} (${error})` : ui.fetchError}</p><button onClick={()=>setRetry(v=>v+1)}>{ui.retry}</button></main>;
  if(notFound)return <main className="message"><p className="label">YEAR NOT FOUND</p><h1>{ui.yearMissing}</h1><p>{ui.chooseYear}</p>{years?.years.map(y=><a key={y} href={`${BASE}${y}/?lang=${lang}`}>{ui.yearLink}{y} →</a>)}</main>;
  if(!site||!years||!data)return <main className="message" role="status"><p className="label">LOADING</p><p>{ui.loading}</p></main>;

  const view=site.showPlans?selectedView:'gallery';const count=stats(data);const days=visibleDays(data,filter) as Day[];
  const filters:[string,string][]=[['all',ui.all],['published',ui.published],['building',ui.building],['planned',ui.planned]];

  return <LocaleContext.Provider value={{lang,ui}}>
    <a href="#collection" className="skip-link">{ui.skip}</a>
    <header className="site-header">
      <a className="mark" href={`${BASE}${data.year}/?lang=${lang}`}><b>30DMC</b><span>{data.year}</span></a>
      <nav aria-label={ui.mainNav}>
        <div className="language-toggle" role="group" aria-label={ui.switchLang}>
          <button lang="en" aria-pressed={lang==='en'} onClick={()=>switchLanguage('en')}>EN</button>
          <button lang="ja" aria-pressed={lang==='ja'} onClick={()=>switchLanguage('ja')}>日本語</button>
        </div>
        <External href={site.officialUrl} className="nav-link nav-official">{ui.challenge} ↗</External>
        <External href={site.repoUrl} className="nav-link">GitHub ↗</External>
      </nav>
    </header>
    <main>
      <section className="hero">
        <h1 className="mega" aria-label={site.title}><span>30DAY</span><span className="accent">MAP</span><span>CHALLENGE</span></h1>
        <div className="hero-foot">
          <div className="tally">
            <div className="tally-main"><strong>{pad(count.days)}</strong><span>/30<br/>{ui.daysPublished}</span></div>
            <div className="tally-sub"><span><b>{pad(count.published)}</b> {ui.worksPublished}</span><span><b>{pad(count.building)}</b> {ui.building}</span></div>
            <ol className="progress" aria-label={ui.collection}>{data.days.map(d=>{const s=d.projects.some(p=>p.status==='published')?'published':d.projects.some(p=>p.status==='building')?'building':'planned';return <li key={d.day}><a href={`#day-${d.day}`} className={s} onClick={()=>setFilter('all')}><span className="sr-only">Day {d.day} {d.theme} {ui[s]}</span><span aria-hidden="true">{pad(d.day)}</span></a></li>})}</ol>
            {years.years.length>1&&<label className="year-select"><span className="sr-only">{ui.selectYear}</span><select value={data.year} onChange={e=>location.assign(`${BASE}${e.target.value}/?lang=${lang}`)}>{years.years.slice().sort((a,b)=>b-a).map(y=><option key={y} value={y}>{y}</option>)}</select></label>}
          </div>
        </div>
      </section>
      <section id="collection" className="collection">
        <div className="collection-head">
          <h2>{ui.sectionTitle}</h2>
          {site.showPlans&&<div className="view-toggle" aria-label={ui.viewMode}><button aria-pressed={view==='gallery'} onClick={()=>setView('gallery')}>{ui.gallery}</button><button aria-pressed={view==='plan'} onClick={()=>setView('plan')}>{ui.plans}</button></div>}
          <div className="filters" role="group" aria-label={ui.statusFilter}>{filters.map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div>
          <p className="result-count" role="status">{days.length} {ui.days}</p>
        </div>
        {!days.length?<div className="empty"><p>{ui.empty}</p><button onClick={()=>setFilter('all')}>{ui.showAll}</button></div>
          :view==='gallery'?<div className="days">{days.map(d=><DayRow key={d.day} day={d}/>)}</div>
          :<div className="plan-list">{days.map(d=><article key={d.day} id={`day-${d.day}`} className="plan-row"><span className="plan-day">{pad(d.day)}</span><div><h3>{d.theme}</h3><p className="plan-meaning">{d.meaning}</p><p>{d.idea || ui.ideaPending}</p></div></article>)}</div>}
      </section>
    </main>
    <footer className="site-footer"><span>© {site.copyrightStart} {site.author.name}</span><External href={site.officialUrl}>{ui.challenge} ↗</External><External href={site.repoUrl}>Source on GitHub ↗</External></footer>
  </LocaleContext.Provider>;
}
createRoot(document.getElementById('root')!).render(<App/>);
